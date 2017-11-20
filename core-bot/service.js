var request = require('request');
var serviceURL  = "http://service:3001";

var keyService = require('../serviceManager/keyController/keySave.js');

var digitalOceanService = require('../serviceManager/DigitalOcean/digitalOcean.js');

var reservationsController = require('../serviceManager/reservationsController/reservationsController.js');

var packerService = require('../serviceManager/packerService/packerService.js');

module.exports = {

	saveDigitalOceanKeys: function (bot, message, response) {
		console.log("*************Saving Digital Ocean Keys******************");
    // getting params from api ai response message
		var params = {
			"UserId": message.user,
			"Service": response.result.parameters.provider,
			"Token": response.result.parameters.token,
			"KeyPair": response.result.parameters.sshKey
		};

		keyService.post_keys_digital_ocean(params, bot, message, response);

	},

	createVirtualMachine: function(bot, message, OsType, config, userDecision) {
		console.log("*********Spinning up new virtual machine*************");
		//console.log(OsType)
		var params = {
			"UserId": message.user,
			"OS": OsType,
			"config": config
		}

		 validateOperatingSystem(OsType, function(result) {
			 if(!result) {
				bot.reply(message, "Unfortunaly, Digital Ocean do not support entered Operating System. Please select from the given list only!!!")
			} else {
				  validateConfig(config, function(result2) {
						if(!result2) {
							bot.reply(message, "Unfortunaly, Digital Ocean do not support entered configuraton. Please refer show configurations help in the main menu");
						} else if(userDecision){
							console.log("flavored");
							//digitalOceanService.create_vm(params, bot, message);
							digitalOceanService.createFlavoredVm(params, bot, message);
						} else {
							digitalOceanService.create_vm(params, bot, message);
							//digitalOceanService.createFlavoredVm(params, bot, message);
							console.log("plain");
						}
					});
			}
		});
	},

	manageReservations: function(bot,message,response) {
		console.log("**************Managing Reservations*******************");

		var params = {
			"UserId": message.user
		}

		reservationsController.get_reservations(params, bot, message, response);
	},

	terminateVirtualMachine: function(bot, message, reservationId) {
		console.log("**************Terminating Virtual Machine*******************");

		var params = {
			"UserId": message.user,
			"reservationID": reservationId
		}

		digitalOceanService.terminateVM(params, bot, message);
	},

	updateVirtualMachine: function(bot, message, response) {
		console.log("**************Resizing Droplet*******************");

		var params = {
			"UserId": message.user,
			"reservationId": response.result.parameters.reservationId,
			"newConfig": response.result.parameters.newConfig
		}

		validateConfig(params.newConfig, function(valid) {
			if(!valid){
				bot.reply(message, "Unfortunaly, Digital Ocean do not support entered configuraton. Please refer show configurations help in the main menu");
			} else {
				digitalOceanService.updateVM(params, bot, message, response)
			}
		});

	},

	createPackerImage: function(bot, message, response) {
		console.log("****************Creating Packer Image********************");

		validatePlugins(response.result.parameters.pluginList, function(valid) {
			if(!valid) {
				bot.reply(message, "Sorry, Some plugins entered by you are not supported by me currently. Please try again!!!");
			} else{
				validateOperatingSystem(response.result.parameters.osKind, function(result){
					if(!result) {
					 bot.reply(message, "Unfortunaly, We do not support entered Operating System. Please select from the given list only!!!")
				 } else {
					    validateSystemConfig(response, function(configResult) {
									if(!configResult) {
										bot.reply(message, "Unfortunaly, you have entered incorrect configurations. Please enter correct configurations and try again!!!!");
									} else{
											packerService.createImage(bot, message, response);
											//bot.reply(message, "success");
									}
							});
				 }
				});
			}
		});

	}
}

function validateOperatingSystem(operatingSystem, callback) {
	var os = operatingSystem.toLowerCase();
	//console.log("Operating system entered is:" + os)
	var listOfOperatingSystemSupported = ["Ubuntu", "FreeBSD", "Fedora", "Debian", "CoreOS", "CentOS"]
	var stricmp = listOfOperatingSystemSupported.toString().toLowerCase();
	if (stricmp.indexOf(os.toLowerCase()) > -1) {
    callback(true);
  } else {
		callback(false);
  }
};

function validatePlugins(pluginList, callback) {
	console.log(pluginList);
	if(pluginList == "none") {
		callback(true);
	} else {
		var pluginsProvided = pluginList.split(" ")
		var flag = true;
		var listOfPluginsProvided = ["SpotBugs", "Checklist", "Hibernate", "Subversive"]
		var stricmp = listOfPluginsProvided.toString().toLowerCase();
		for(var i = 0; i < pluginsProvided.length; i++) {
			var plugin = pluginsProvided[i];
			if (stricmp.indexOf(plugin.toLowerCase()) < 0) {
				flag = false;
				break;
			}
		}
		if(flag == false) {
			callback(false)
		} else {
			callback(true)
		}
	}

}

function validateConfig(config, callback) {
	var flag = false;
	var listOfConfigSupported = ["512MB", "1GB", "2GB", "4GB", "8GB", "16GB"]
	var stricmp = listOfConfigSupported.toString().toLowerCase();
	for(var i = 0; i < listOfConfigSupported.length; i++) {
			if(config.toLowerCase() == listOfConfigSupported[i].toLowerCase()) {
				flag = true;
				break;
			}
	}
	if(flag == true) {
		callback(true);
	} else {
		callback(false);
	}
}

function validateSystemConfig(response, callback) {
	var mainMemory = response.result.parameters.RAM;
	var lastTwoCharacters = mainMemory.substring(mainMemory.length-2, mainMemory.length);
	if(lastTwoCharacters == "GB" || lastTwoCharacters == "gb") {
		var RAM = parseInt(mainMemory.trim().substring(0, mainMemory.length-2));
		var CPU = parseInt(response.result.parameters.CPU);

		if(!isNaN(RAM) && RAM <= 16 && !isNaN(CPU) && CPU <= 8) {
			callback(true);
		} else {
			callback(false);
		}
	} else {
		callback(false);
	}

}
