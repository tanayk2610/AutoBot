require('../database_models/provider_keys.js');

var mongoose = require('mongoose');
var shell=require('node-cmd');
var fileSync=require('fs');
var Key = mongoose.model('Key');
var Enum = require('enum');
var myEnum = new Enum({'Ubuntu': 'ubuntu-16-04-x64', 'FreeBSD': 'freebsd-10-3-x64', 'Fedora': 'fedora-24-x64', 'Debian': 'debian-8-x64', 'CoreOS': 'coreos-stable', 'CentOS': 'centos-6-x64'}, {ignoreCase: true});

exports.createImage = function(bot, message, response){
    console.log("******** createImage starts*************");
    bot.startConversation(message, function(err, convo){
      if(err){
        console.log(err);
      } else{
        convo.say("Please wait for a moment");
        var newConfig = response.result.parameters.config;
        console.log("New config is: " + newConfig)
        var OS = response.result.parameters.osKind;
        var user = message.user;
        Key.findOne({ "UserId": user, "Service": "digital-ocean" }, function(err,result){

            if(err) {
                console.log("Could not fetch keys from database", err);
                bot.reply(message, "Internal Server Error, please try again after some time!!!")
            } else {
                if(result == null) {
                    console.log("Could not fetch keys from database", err);
                    bot.reply(message, "Looks like you have not provided me your Digital Ocean Keys. Please save your keys first");
                } else {
                    var data = JSON.parse(fileSync.readFileSync('../serviceManager/packerService/config/' + response.result.parameters.osKind.toLowerCase() +  '/config.json').toString());

                    console.log("\nContent: \n"+JSON.stringify(data));

                    fileSync.writeFile('../serviceManager/packerService/config/' + response.result.parameters.osKind.toLowerCase() + '/userConfig/' + user + '.json', JSON.stringify(data));

                    shell.get(
                        '../serviceManager/packerService/config/./packer build ../serviceManager/packerService/config/' + response.result.parameters.osKind.toLowerCase() + '/userConfig/' + user +'.json',
                        function(err, data, stderr){
                            if(err){
                                console.log(err);
                            }
                           else{
                            console.log("Packer in action");
                            bot.reply(message, "Here is your VM.");
                           }
                       }
                   );
                }
            }
        });
      }
      convo.next();
    });
}
