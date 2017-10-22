var request = require('request');
var serviceURL  = "http://service:3001";

var keyService = require('../serviceManager/keyController/keySave.js');

var digitalOceanService = require('../serviceManager/DigitalOcean/digitalOCean.js');


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
		bot.reply(message, "Please wait for a moment, my autobots will be right back with your VM on cloud!!!!!");
		console.log("*********Spinning up new virtual machine*************");

		var params = {
			"UserId": message.user,
			"OS": response.result.parameters.osKind,
			"vCPUs": response.result.parameters.vCPUs,
			"RAM": response.result.parameters.mainMemory,
			"Storage": response.result.parameters.Storage
		}

		digitalOceanService.create_vm(params, bot, message, response);
	}

}
