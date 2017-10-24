require('../database_models/reservations.js');
require('../database_models/provider_keys.js');
var mongoose = require('mongoose');
var nock = require("nock")
var Key = mongoose.model('Key');
var mockData = require('./mockData/newMock.json')
var dropletData = require('./mockData/dropletMockData.json')
var Reservation = mongoose.model('Reservation');
var needle = require("needle");
var os   = require("os");
var fs = require('fs');

// defining enums to match OS

var Enum = require('enum');
var myEnum = new Enum({'Ubuntu': 'ubuntu-16-04-x64', 'FreeBSD': 'freebsd-10-3-x64', 'Fedora': 'fedora-24-x64', 'Debian': 'debian-8-x64', 'CoreOS': 'coreos-stable', 'CentOS': 'centos-6-x64'}, {ignoreCase: true});
module.exports =
{
    create_vm: function (params, bot, message, response) {
        Key.findOne({ "UserId": params.UserId, "Service": "digital-ocean" }, function(err,result) {

            if(err) {
                console.log("Could not fetch keys from database", err);
                bot.reply(message, "Internal Server Error, please try again after some time!!!")
            } else {
                if(result == null) {
                    console.log("Could not fetch keys from database", err);
                    bot.reply(message, "Looks like you have not provided me your Digital Ocean Keys. Please save your keys first");
                } else {
                  // read api token
                  headers.Authorization = 'Bearer ' + result.Token;
                  console.log(result.Token);
                  var data;
                  var ssh_key = parseInt(result.KeyPair);
                  var name = "DevOps-Node";
                  var region = "nyc3";
                  // var image = (params.OS.indexOf("buntu") > -1) ? "ubuntu-16-04-x64" : "centos-6-5-x64";
                  var image = myEnum.get(params.OS).value
                  var config = params.config;
                  client.createDroplet(name, config, region, image, ssh_key, function(err, resp, body)
                  {
                      if(err) {
                        console.log("request failed")
                      }
                      if(!err && resp.statusCode == 202)
                      {
                          var dropletId = resp.body.droplet.id;
                          console.log("Got droplet: " + dropletId + " getting public IP now");

                          // Get IP Handler
                          function getIPCallback(error, response, body)
                          {
                              data = response.body;
                              data["ReservationId"] = "" + data.droplet.id;
                              if( (data.droplet.networks.v4.length > 0)  && (data.droplet.status == "active") )
                              {
                                  console.log(data.droplet.networks.v4[0].ip_address);

                                  console.log("STORE Reservation data in DB :");
                                  var r = {
                                      "UserId" : params.UserId,
                                      "Cloud" : "digital-ocean",
                                      "Reservation" : data,
                                      "Request" : params,
                                  }

                                  Reservation.create(r, function(err, key) {
                                      if(err) {
                                          console.log("Could not write to database", err);
                                          bot.reply(message, "Internal Servor Error");
                                      } else {
                                        bot.reply(message, "Your VM is hosted at IP address: " + data.droplet.networks.v4[0].ip_address );
                                      }
                                  });

                              } else {
                                  console.log("...");
                                  setTimeout(function () {
                                      client.getIP(dropletId, getIPCallback);
                                  }, 1000);
                              }
                          }

                          // Get IP
                          client.getIP(dropletId, getIPCallback);
                      }
                  });
                }
            }
        });

    },

    terminateVM: function (params, bot, message, response) {
        console.log(params.UserId);
        console.log(params.reservationID);

        Key.findOne({ "UserId": params.UserId, "Service": "digital-ocean" }, function(err,result) {

            if(err) {
                console.log("Could not fetch keys from database", err);
                bot.reply(message, "Internal Server Error, please try again after some time!!!")
            } else {
                if(result == null) {
                  console.log("Could not fetch keys from database", err);
                  bot.reply(message, "Looks like you have not provided me your Digital Ocean Keys. Please save your keys first");
                } else {
                  // read api token
                  headers.Authorization = 'Bearer ' + result.Token;

                  var resId = parseInt(params.reservationID);
                  Reservation.findOne({"Reservation.droplet.id" : resId}, function(err, resultReservation) {

                      if(err) {
                          console.log("Database Connectivity error", err);
                          bot.reply(message, "Internal Server Error, please try again after some time!!!")
                      }

                      if(resultReservation == null) {
                          console.log("No reservation found with given reservation ID", err);
                          bot.reply(message, "No Reservation found with given ID");
                      } else {
                        client.deleteDroplet(resId, function(err, resp, body) {
                            if(!err)
                            {
                                Reservation.remove({"Reservation.droplet.id" : resId}, function(err, result) {
                                    if(err) {
                                        bot.reply(message, "Internal server error");
                                    } else {
                                        bot.reply(message, "Reservation Deleted Succesfully");
                                    }
                                });
                            } else {
                                console.log("deleting res failed. status" + resp.statusCode);
                                bot.reply(message, "Can not delete reservation, please try again after some time!!!")
                            }

                        });
                      }
                  });
              }
            }
        });

    }
}

// code to create virtual machines using Digital Ocean
var headers =
{
    'Content-Type':'application/json',
    Authorization: ""
};


//Digital ocean client methods

var client =
{
    listRegions: function( onResponse )
    {
        needle.get("https://api.digitalocean.com/v2/regions", {headers:headers}, onResponse)
    },


    listImages: function( onResponse )
    {
        needle.get("https://api.digitalocean.com/v2/images", {headers:headers}, onResponse)
    },


    createDroplet: function (dropletName, mainMemorySize, region, imageName, ssh_key, onResponse)
    {
        var data =
        {
            "name": dropletName,
            "region":region,
            "size": mainMemorySize,
            "image":imageName,
            // Id to ssh_key already associated with account.
            "ssh_keys":[ssh_key],
            //"ssh_keys":null,
            "backups":false,
            "ipv6":false,
            "user_data":null,
            "private_networking":null
        };

        console.log("Attempting to create Droplet: "+ JSON.stringify(data) + "\n" );
        // mocking service call here
        //nock("https://api.digitalocean.com").post("/v2/droplets", data).reply(202, mockData)
        needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );
    },


    getIP: function(dropletId, onResponse )
    {
        //nock("https://api.digitalocean.com").get("/v2/droplets/"+dropletId).reply(202, dropletData)
        // mocking service call here
        needle.get("https://api.digitalocean.com/v2/droplets/"+dropletId, {headers:headers}, onResponse)
    },


    deleteDroplet: function (dropletId, onResponse)
    {
        var data = null;

        console.log("Attempting to delete: "+ dropletId );

        needle.delete("https://api.digitalocean.com/v2/droplets/"+dropletId, data, {headers:headers,json:true}, onResponse );
    },

};
