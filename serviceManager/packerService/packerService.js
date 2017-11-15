require('../database_models/provider_keys.js');

var mongoose = require('mongoose');
var shell=require('node-cmd');
var fileSync=require('fs');
const gcp = require('../googleCloudPlatformService/googleCloudPlatformService.js');
var Key = mongoose.model('Key');
var Enum = require('enum');
const zipFolder = require('zip-folder');


var pluginEnum = new Enum({
    'SpotBugs': "eclipse -application org.eclipse.equinox.p2.director -repository http://findbugs.cs.umd.edu/eclipse/ -installIU edu.umd.cs.findbugs.plugin.eclipse.feature.group;",
    'Hibernate': "eclipse -application org.eclipse.equinox.p2.director -repository http://download.eclipse.org/releases/oxygen/ -installIU org.eclipse.emf.cdo.server.hibernate.source.feature.group;",
    'Subversive': "eclipse -application org.eclipse.equinox.p2.director -repository http://download.eclipse.org/releases/oxygen/ -installIU org.eclipse.team.svn.feature.group;",
    'Checklist': "eclipse -application org.eclipse.equinox.p2.director -repository http://eclipse-cs.sf.net/update -installIU net.sf.eclipsecs.feature.group;"
}, {ignoreCase: true});

exports.createImage = function(bot, message, response){
    console.log("******** createImage starts*************");
    bot.startConversation(message, function(err, convo){
      if(err){
        console.log(err);
      } else{
        convo.say("Please wait for a moment");

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

                    //Configuration of VM
                    var mainMemory = response.result.parameters.RAM;
                    var RAM = parseInt(mainMemory.trim().substring(0, mainMemory.length-2));
                    var CPUs = parseInt(response.result.parameters.CPU);
                    var OS = response.result.parameters.osKind.toLowerCase();
                    var plugins = response.result.parameters.pluginList.split(" ");
                    var pluginConfig = "";
                    if(plugins != "none"){
                        pluginConfig = "cd/usr/bin";
                        for(var i=0;i<plugins.length;i++) {
                            pluginConfig = pluginConfig.concat(pluginEnum.get(plugins[i])+',');
                        }
                        pluginConfig = pluginConfig.trim().substring(0,pluginConfig.length-2);
    
                    }


                    var date = new Date();
                    var timeStamp = date.getFullYear().toString()+date.getMonth().toString()+
                                date.getDate().toString()+date.getHours().toString()+
                                date.getMinutes().toString()+date.getSeconds().toString();  
                    var filename = `${user}_${timeStamp}`; 

                    //Modifying JSON file to user provided configuration
                    var data = JSON.parse(fileSync.readFileSync('../serviceManager/packerService/config/' + OS +  '/config.json').toString());
                    
                    // console.log('Old JSON content:\n\n\n'+JSON.stringify(data));
                    // console.log('\n\n\n');

                    data.variables.memory = "" + RAM*1024 + "";
                    data.variables.cpus = "" + CPUs + "";
                    data.builders[0].output_directory = `../builds/${filename}`;

                    // Saving the user requested settings as packer template
                    fileSync.writeFile('../serviceManager/packerService/config/' + OS + '/userConfig/' + user + '.json', JSON.stringify(data));
                    
                    // console.log('New JSON content:\n\n\n'+JSON.stringify(data));
                    // console.log('\n\n\n');

                    shell.get(
                        './packer build ../serviceManager/packerService/config/' + OS + '/userConfig/' + user +'.json',
                        function(err, data, stderr){
                            if(err) {
                                console.log(err);
                            }
                           else {
                               console.log("Packer in action.");
                               bot.reply(message,`Image created, packing it into a zip file...`);
                               zipFolder(`../builds/${filename}`,`../builds/zips/${filename}.zip`, function(err) {
                                   if(err) {
                                       console.log('Error encountered wile creating zip file!', err);
                                       bot.reply(message, `The zip file couldn't be created due to some error, please try again.`);
                                    } else {
                                        console.log(`***    Zip created successfully for user ${user}   ***`);
                                        bot.reply(message, `Zip created successfully, uploading it on cloud...`);
                                        const bucketName = 'csc510-bot';
                                        var filepath = `../builds/zips/${filename}.zip`;
                                        gcp.uploadFile(bucketName,filepath, function(flag){
                                            if(flag){
                                                // bot.reply(message, `Here is your VM: https://storage.googleapis.com/csc510-bot/${filename}.zip`);
                                                // console.log('callback if entered');
                                                gcp.makePublic(bucketName, filename, function(flag){
                                                    if(flag){
                                                        // console.log('callback2 if entered');
                                                        bot.reply(message, `Here is your VM: https://storage.googleapis.com/csc510-bot/${filename}.zip`);
                                                    }
                                                    else{
                                                        bot.reply(message, `There was some error in creating you VM, please try again.`);
                                                    }
                                                });
                                            }
                                            else
                                                bot.reply(message, `There was some error in creating you VM, please try again.`);
                                                console.log('callback end entered');
                                        });
                                    }
                                });
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