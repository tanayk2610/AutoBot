require('../database_models/reservations.js');
require('../database_models/provider_keys.js');
var mongoose = require('mongoose');
var nock = require("nock")
var Key = mongoose.model('Key');
var mockData = require('./mockData/newMock.json')
var dropletData = require('./mockData/dropletMockData.json')
var updateData = require('./mockData/UpdateMockData.json')
var Reservation = mongoose.model('Reservation');
var needle = require("needle");
var os   = require("os");
var fs = require('fs');
var fileSync=require('fs');
var shell=require('node-cmd');

// defining enums to match OS
var Enum = require('enum');
var myEnum = new Enum({'Ubuntu': 'ubuntu-16-04-x64', 'FreeBSD': 'freebsd-10-3-x64', 'Fedora': 'fedora-24-x64', 'Debian': 'debian-9-x64', 'CoreOS': 'coreos-stable', 'CentOS': 'centos-6-x64'}, {ignoreCase: true});
module.exports =
{
    create_vm: function (params, bot, message) {
        bot.startConversation(message, function(err, convo){
          if(err) {
            console.log(err);
          } else {
               convo.say("Please wait for a moment");
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
                              //console.log(result.Token);
                              var data;
                              var ssh_key = parseInt(result.KeyPair);
                              var name = "DevOps-Node";
                              var region = "nyc3";
                              // var image = (params.OS.indexOf("buntu") > -1) ? "ubuntu-16-04-x64" : "centos-6-5-x64";
                              var image = myEnum.get(params.OS).value
                              var config = params.config;
                              // console.log(image)
                              // console.log(config)
                              client.createDroplet(name, config, region, image, ssh_key, function(err, resp, body)
                              {
                                  if(err) {
                                    console.log("request failed");
                                    bot.reply(message, "Request Failed, please check your ssh key ID");
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
          }
          convo.next();
        });
    },

    terminateVM: function (params, bot, message) {
        console.log(params.UserId);
        console.log("Bhavya bansal" + params.reservationID);

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
                          bot.reply(message, "No Reservation found with given ID. Please input correct reservation ID and try again!!!");
                      } else {
                        client.deleteDroplet(resId, function(err, resp, body) {
                          console.log(err)
                          console.log(resp)
                            if(!err)
                            {
                                Reservation.remove({"Reservation.droplet.id" : resId}, function(err, result) {
                                    if(err) {
                                        bot.reply(message, "Internal server error");
                                    } else {
                                        bot.reply(message, "Reservation Deleted Successfully");
                                    }
                                });
                            } else {
                                console.log("deleting res failed. status" + resp);
                                bot.reply(message, "Can not delete reservation, please try again after some time!!!")
                            }

                        });
                      }
                  });
              }
            }
        });

    },

    updateVM: function(params, bot, message, response) {
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

                var resId = parseInt(params.reservationId);
                var newConfig = params.newConfig;
                Reservation.findOne({"Reservation.droplet.id" : resId}, function(err, resultReservation) {

                    if(err) {
                        console.log("Database Connectivity error", err);
                        bot.reply(message, "Internal Server Error, please try again after some time!!!")
                    }

                    if(resultReservation == null) {
                        console.log("No reservation found with given reservation ID", err);
                        bot.reply(message, "No Reservation found with given ID. Please input correct reservation ID and try again!!!");
                    } else {
                      client.resizeDroplet(resId, newConfig, function(err, resp, body) {
                          if(err) {
                            console.log("Error updating the droplet")
                            bot.reply(message, "Update failed, please try again later.")
                          } else {
                            console.log("Status code is: " + resp.statusCode)
                            if(!err && resp.statusCode == 201) {
                              bot.reply(message, "Droplet has been updated Succesfully")
                            } else {
                              bot.reply(message, "Error serving the request: Seems like you tried to downgrade your droplet. Digital Ocean Droplets can not be downsized.")
                            }
                          }
                      });
                    }
                });
            }
          }
      });
    },

    createFlavoredVm: function(params, bot, message) {
      console.log("new method called");
      Key.findOne({ "UserId": params.UserId, "Service": "digital-ocean" }, function(err,result) {

          if(err) {
              console.log("Could not fetch keys from database", err);
              bot.reply(message, "Internal Server Error, please try again after some time!!!")
          } else {
              if(result == null) {
                  console.log("Could not fetch keys from database", err);
                  bot.reply(message, "Looks like you have not provided me your Digital Ocean Keys. Please save your keys first");
              } else {
                  getImageId(params, bot, message, function(success, imageID) {
                      if(success) {
                        console.log("Image created Succesfully");
                        var doImageId = imageID.replace(/\n$/, '');
                        headers.Authorization = 'Bearer ' + result.Token;
                        var data;
                        var ssh_key = parseInt(result.KeyPair);
                        var name = "DevOps-Node";
                        var region = "nyc3";
                        // var image = (params.OS.indexOf("buntu") > -1) ? "ubuntu-16-04-x64" : "centos-6-5-x64";
                        var image = parseInt(doImageId);
                        var config = params.config;
                        client.createDroplet(name, config, region, image, ssh_key, function(err, resp, body)
                        {
                            if(err) {
                              console.log("request failed");
                              bot.reply(message, "Request failed, please try again after some time");
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
                                                bot.reply(message, "Internal Server Error");
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
                            client.deleteImage(image, function(err,resp, body) {
                                if(err) {
                                  console.log("Image is still on your account, please delete if not required");
                                } else {
                                    if(!err && resp.statusCode == 204) {
                                      console.log("packer image deleted Succesfully");
                                    }
                                }
                            });
                        });
                      } else {
                        bot.reply(message, "Requst Failed: Please try again!!!!!")
                      }

                      var user = message.user;
                      shell.get(
                        'rm '+ user + '.json' + '&& rm build.log',
                        function(err1, data1, stderr1) {
                          if(err1) {
                            console.log("can not delete logs and json");
                          } else {
                            console.log("logs and json deleted Succesfully");
                          }
                        }
                      );
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

    deleteImage: function (imageId, onResponse) {
      needle.delete("https://api.digitalocean.com/v2/images/" + imageId, null,{headers:headers}, onResponse)
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
        // mocking service call here
        //nock("https://api.digitalocean.com").get("/v2/droplets/"+dropletId).reply(202, dropletData)
        needle.get("https://api.digitalocean.com/v2/droplets/"+dropletId, {headers:headers}, onResponse)
    },


    deleteDroplet: function (dropletId, onResponse)
    {

        console.log("Attempting to delete: "+ dropletId );
        // mocking service call here
        //nock("https://api.digitalocean.com").delete("/v2/droplets/"+dropletId).reply(204)
        needle.delete("https://api.digitalocean.com/v2/droplets/" + dropletId, null,{headers:headers}, onResponse)
    },

    resizeDroplet: function(dropletId, newConfig, onResponse)
    {
      var data = {
        "type": "resize",
        "disk": true,
        "size": newConfig
      }
      console.log("Attempting to Resize the droplet:" + dropletId);
      // mocking service call here
      //nock("https://api.digitalocean.com").post("/v2/droplets/"+ dropletId + "/actions", data).reply(201, updateData)
      needle.post("https://api.digitalocean.com/v2/droplets/" + dropletId + "/actions", data, {headers:headers,json:true}, onResponse );
    }

};

function getImageId(params, bot, message, callback) {
  console.log("******** createImage starts*************");
  bot.startConversation(message, function(err, convo){
    if(err){
      console.log(err);
    } else{
      convo.say("Please wait for a moment");
      var newConfig = params.config;
      console.log("New config is: " + newConfig)
      var OS = params.OS;
      var user = message.user;
      Key.findOne({ "UserId": user, "Service": "digital-ocean" }, function(err,result){

          if(err) {
              console.log("Could not fetch keys from database", err);
              bot.reply(message, "Internal Server Error, please try again after some time!!!")
              callback(false, null);
          } else {
              if(result == null) {
                  console.log("Could not fetch keys from database", err);
                  bot.reply(message, "Looks like you have not provided me your Digital Ocean Keys. Please save your keys first");
                  callback(false, null);
              } else {
                  var OSType = myEnum.get(OS).value;
                  var data;
                  if(OSType == "ubuntu-16-04-x64") {
                    data = JSON.parse(fileSync.readFileSync('./jenkins_config_files/ubuntu_jenkins.json').toString());
                  } else if(OSType == "fedora-24-x64") {
                    data = JSON.parse(fileSync.readFileSync('./jenkins_config_files/fedora_jenkins.json').toString());
                  } else if(OSType == "debian-9-x64") {
                    data = JSON.parse(fileSync.readFileSync('./jenkins_config_files/debian_jenkins.json').toString());
                  } else if(OSType == "centos-6-x64") {
                    data = JSON.parse(fileSync.readFileSync('./jenkins_config_files/centos_jenkins.json').toString());
                    // will change once we have support for remaining operating systems
                  } else {
                      data = JSON.parse(fileSync.readFileSync('./jenkins_config_files/ubuntu_jenkins.json').toString());
                  }

                  data.builders[0].size=newConfig;
                  data.builders[0].image=OSType;
                  data.builders[0].api_token = result.Token;

                  fileSync.writeFile( user + '.json', JSON.stringify(data), (newErr) => {
                    if(newErr) {
                      console.log("file write error")
                    } else {
                      console.log("file has been created Succesfully")
                      shell.get(
                          './packer build '+ user +'.json >> build.log',
                          function(err, data, stderr){
                              if(err){
                                  //bot.reply(message, "Internal Server Error, please try again after some time!!!!")
                                  callback(false , null);
                              }
                              else{
                                shell.get(
                                  'tail -2 build.log | head -2 | grep -Po \'ID: [0-9]+\' | gawk \'{print $1}\' FPAT=\'[0-9]+\'',
                                  function(err1, data1, stderr1) {
                                    if(err1) {
                                      //bot.reply(message, "Error creatig image, please try again after some time!!!!");
                                      callback(false, null);
                                    } else {
                                      callback(true, data1);
                                    }
                                  }
                                );
                              }
                          }
                      );
                    }
                  });



              }
          }
      });
    }
    convo.next();
  });
}
