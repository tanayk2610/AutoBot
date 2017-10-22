var request = require('request');
var serviceURL  = "http://service:3001";

var keyService = require('../serviceManager/keyController/keySave.js');

module.exports = {

	saveDigitalOceanKeys: function (bot, message, response) {
		bot.reply(message, "Please wait for a moment...")
		console.log("*************Saving Digital Ocean Keys******************");
    // getting params from api ai response message
		var params = {
			"UserId": message.user,
			"Service": response.result.parameters.provider,
			"Token": response.result.parameters.token
		};

		keyService.post_keys_digital_ocean(params, bot, message, response);

	}
}
