require('../database_models/provider_keys.js');

var mongoose = require('mongoose');
var shell = require('node-cmd');
var fileSync = require('fs');
const gcp = require('../googleCloudPlatformService/googleCloudPlatformService.js');
var Key = mongoose.model('Key');
var Enum = require('enum');
const zipFolder = require('zip-folder');


var pluginEnum = new Enum({
    'SpotBugs': "eclipse -application org.eclipse.equinox.p2.director -repository http://findbugs.cs.umd.edu/eclipse/ -installIU edu.umd.cs.findbugs.plugin.eclipse.feature.group;",
    'Hibernate': "eclipse -application org.eclipse.equinox.p2.director -repository http://download.eclipse.org/releases/oxygen/ -installIU org.eclipse.emf.cdo.server.hibernate.source.feature.group;",
    'Subversive': "eclipse -application org.eclipse.equinox.p2.director -repository http://download.eclipse.org/releases/oxygen/ -installIU org.eclipse.team.svn.feature.group;",
    'Checklist': "eclipse -application org.eclipse.equinox.p2.director -repository http://eclipse-cs.sf.net/update -installIU net.sf.eclipsecs.feature.group;"
}, { ignoreCase: true });

exports.createImage = function (bot, message, response) {
    console.log("******** createImage starts*************");
    bot.startConversation(message, function (err, convo) {
        if (err) {
            console.log(err);
        } else {
            convo.say("Please wait for a moment");
            console.log("**************     else entered        *************");
            var user = message.user;
            //Configuration of VM
            var mainMemory = response.result.parameters.RAM;
            var RAM = parseInt(mainMemory.trim().substring(0, mainMemory.length - 2));
            var CPUs = parseInt(response.result.parameters.CPU);
            var OS = response.result.parameters.osKind.toLowerCase();

            // Creating Timestamp
            var date = new Date();
            var timeStamp = date.getFullYear().toString() + date.getMonth().toString() +
                date.getDate().toString() + date.getHours().toString() +
                date.getMinutes().toString() + date.getSeconds().toString();
            var filename = `${user}_${timeStamp}`;

            // Plugins to install
            var plugins = response.result.parameters.pluginList.split(" ");
            var pluginConfig = "cd/usr/bin;";
            if (plugins != "none") {
                for (var i = 0; i < plugins.length; i++) {
                    pluginConfig = pluginConfig.concat("\n" + pluginEnum.get(plugins[i]));
                }
            }
            fileSync.writeFile('../serviceManager/packerService/' + OS + '/userConfig/' + filename + '.sh', pluginConfig);
            
            console.log("**************     Modifying JSON file to user provided configuration      ************");
            //Modifying JSON file to user provided configuration
            var data = JSON.parse(fileSync.readFileSync('../serviceManager/packerService/' + OS + '/config.json').toString());

            // console.log('Old JSON content:\n\n\n'+JSON.stringify(data));
            // console.log('\n\n\n');

            data.variables.memory = "" + RAM * 1024 + "";
            data.variables.cpus = "" + CPUs + "";
            data.variables.vm_name = `${OS}_${timeStamp}`;
            data.variables.output_directory = `../builds/${filename}`;
            data.variables.eclipse_path = '../serviceManager/packerService/' + OS + '/userConfig/' + filename + '.sh';

            console.log("**************     Saving the user requested settings as packer template      ************");
            // Saving the user requested settings as packer template
            fileSync.writeFile('../serviceManager/packerService/' + OS + '/userConfig/' + filename + '.json', JSON.stringify(data));

            // console.log('New JSON content:\n\n\n'+JSON.stringify(data));
            // console.log('\n\n\n');

            console.log("**************     Running packer      ************");
            shell.get(
                './packer build ../serviceManager/packerService/' + OS + '/userConfig/' + filename + '.json',
                function (err, data, stderr) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("Packer in action.");
                        bot.reply(message, `Image created, packing it into a zip file...`);
                        zipFolder(`../builds/${filename}`, `../builds/zips/${filename}.zip`, function (err) {
                            if (err) {
                                console.log('Error encountered wile creating zip file!', err);
                                bot.reply(message, `There was some error in creating your VM, please try again.`);
                            } else {
                                console.log(`***    Zip created successfully for user ${user}   ***`);
                                bot.reply(message, `Zip created successfully, uploading it on cloud...`);
                                const bucketName = 'csc510-bot';
                                var filepath = `../builds/zips/${filename}.zip`;
                                gcp.uploadFile(bucketName, filepath, function (flag) {
                                    if (flag) {
                                        // bot.reply(message, `Here is your VM: https://storage.googleapis.com/csc510-bot/${filename}.zip`);
                                        // console.log('callback if entered');
                                        gcp.makePublic(bucketName, filename, function (flag) {
                                            if (flag) {
                                                // console.log('callback2 if entered');
                                                bot.reply(message, `Here is your VM: https://storage.googleapis.com/csc510-bot/${filename}.zip`);
                                            }
                                            else {
                                                console.log("Error in makePublic");
                                                bot.reply(message, `There was some error in creating you VM, please try again.`);
                                            }
                                        });
                                    }
                                    else {
                                        console.log("Error in uploadFile");
                                        bot.reply(message, `There was some error in creating you VM, please try again.`);      
                                    }
                                    // console.log('callback end entered');
                                });
                            }
                        });
                    }
                }
            );
        }
    });
}