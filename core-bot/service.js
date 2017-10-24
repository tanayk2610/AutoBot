var request = require('request');
var serviceURL  = "http://service:3001";

var keyService = require('../serviceManager/keyController/keySave.js');

var digitalOceanService = require('../serviceManager/DigitalOcean/digitalOcean.js');

var reservationsController = require('../serviceManager/reservationsController/reservationsController.js');

module.exports = {

	saveDigitalOceanKeys: function (bot, message, response) {
		bot.reply(message, "Please wait for a moment...")
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

	createVirtualMachine: function(bot, message, response) {
		console.log("*********Spinning up new virtual machine*************");

		var params = {
			"UserId": message.user,
			"OS": response.result.parameters.osKind,
			"config": response.result.parameters.config
		}

		  validateOperatingSystem(response.result.parameters.osKind, function(result) {
			if(!result) {
				bot.reply(message, "Unfortunaly, Digital Ocean do not support entered Operating System. Please select from the given list only!!!")
			} else {
					digitalOceanService.create_vm(params, bot, message, response);
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
