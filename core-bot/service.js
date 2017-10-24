var request = require('request');
var serviceURL  = "http://service:3001";

var keyService = require('../serviceManager/keyController/keySave.js');

var digitalOceanService = require('../serviceManager/DigitalOcean/digitalOcean.js');

var reservationsController = require('../serviceManager/reservationsController/reservationsController.js');

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

	createVirtualMachine: function(bot, message, OsType, config, userDecision, privateKey) {
		console.log("*********Spinning up new virtual machine*************");
		console.log(OsType)
		var params = {
			"UserId": message.user,
			"OS": OsType,
			"config": config,
			"privateKey": null
		}
		if(userDecision == true) {
			params['privateKey'] = privateKey;
		}
		 console.log(params['OS']);
		 validateOperatingSystem(OsType, function(result) {
			 if(!result) {
				bot.reply(message, "Unfortunaly, Digital Ocean do not support entered Operating System. Please select from the given list only!!!")
			} else {
					digitalOceanService.create_vm(params, bot, message);
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

		digitalOceanService.updateVM(params, bot, message, response)
	}

}

function validateOperatingSystem(operatingSystem, callback) {
	var os = operatingSystem.toLowerCase();
	console.log("Operating system entered is:" + os)
	var listOfOperatingSystemSupported = ["Ubuntu", "FreeBSD", "Fedora", "Debian", "CoreOS", "CentOS"]
	var stricmp = listOfOperatingSystemSupported.toString().toLowerCase();
	if (stricmp.indexOf(os.toLowerCase()) > -1) {
    callback(true);
  } else {
		callback(false);
  }
};
