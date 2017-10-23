require('../database_models/reservations.js');
require('../database_models/provider_keys.js');
var mongoose = require('mongoose');

var Key = mongoose.model('Key');

var Reservation = mongoose.model('Reservation');

var needle = require("needle");
var os   = require("os");
var fs = require('fs');
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
                    bot.reply(message, "Oh ho, looks like you have not provided me your Digital Ocean Keys. Please save your keys first");
                } else {
                  // read api token
                  headers.Authorization = 'Bearer ' + result.Token;
                  console.log(result.Token);
                  var data;
                  var ssh_key = parseInt(result.KeyPair);
                  var name = "DevOps-Node";
                  var region = "nyc3";
                  var image = (params.OS.indexOf("buntu") > -1) ? "ubuntu-16-04-x64" : "centos-6-5-x64";
                  var mainMemorySize = params.RAM;
                  client.createDroplet(name, mainMemorySize, region, image, ssh_key, function(err, resp, body)
                  {
                      if(err) {
                        console.log("error happened")
                      }
                      if(!err && resp.statusCode == 202)
                      {
                          var dropletId = resp.body.droplet.id;
                          console.log("Got droplet: " + dropletId + " polling for public IP...");

                          // Get IP Handler
                          function getIPCallback(error, response)
                          {
                              data = response.body;
                              data["ReservationId"] = "" + data.droplet.id;
                              if( (data.droplet.networks.v4.length > 0)  && (data.droplet.status == "active") )
                              {
                                  console.log(data.droplet.networks.v4[0].ip_address);

                                  // All SET!
                                  // STORE RESERVATION AND REQUEST IN DB
                                  console.log("STORE the following in DB :");
                                  console.log();
                                  var r = {
                                      "UserId" : params.UserId,
                                      "Cloud" : "digital-ocean",
                                      "Reservation" : data,
                                      "Request" : params,
                                  }

                                  Reservation.create(r, function(err, key) {
                                      if(err) {
                                          console.log("Could not write to database", err);
                                          res.statusCode = 500
                                          return res.send({"status": 500, "message": "Internal Server Error"});
                                      }
                                      // NOTIFY BOT ABOUT STATUS
                                      // res.statusCode = 201
                                      // return res.send({"status" : 201, "data" : data});
                                      bot.reply(message, "Created VM, IP address is : " + data.droplet.networks.v4[0].ip_address )
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

        needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );
    },


    getIP: function(dropletId, onResponse )
    {
        needle.get("https://api.digitalocean.com/v2/droplets/"+dropletId, {headers:headers}, onResponse)
    },


    deleteDroplet: function (dropletId, onResponse)
    {
        var data = null;

        console.log("Attempting to delete: "+ dropletId );

        needle.delete("https://api.digitalocean.com/v2/droplets/"+dropletId, data, {headers:headers,json:true}, onResponse );
    },

};
