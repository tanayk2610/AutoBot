
require('../database_models/provider_keys.js');
var mongoose = require('mongoose');
var nock = require("nock")
var accountMockData = require('./mockData/account.json')

var Key = mongoose.model('Key');

exports.get_keys = function (req, res) {
    var userId = req.params.UserId;
    console.log(req)
    Key.find({"UserId": userId},{Service:1,KeyPair:1
    }, function (err, results) {
        if (err) {
            res.statusCode = 500
            return res.send({"status": 500, "message": "Internal Server Error"});
        } else {
            if (results.length == 0) {
                res.statusCode = 404
                return res.send({"status": 404, "message": "No keys associated with user"});
            } else {
                res.statusCode = 200
                return res.send({"status": 200, "data": results});
            }
        }
    });

};

exports.post_keys_digital_ocean = function (params, bot, message, response) {

    var userId = params.UserId;
    console.log("post_keys : POST Request ")
    console.log(userId);

    validateDigitalOcean(bot,message, params, function (valid) {
        if (!valid) {
          bot.reply(message, "Invalid keys for Digital Ocean Account. Please try again!!!!");
        } else {
            Key.findOneAndUpdate({"UserId": params.UserId, "Service": params.Service}, params, {
                upsert: true,
                new: true
            }, function (err, key) {
                console.log("DO key is: " + key);
                if (err) {
                  bot.reply(message, "Server Error, please try again after some time")
                } else {
                  bot.reply(message, "Keys Saved successfully");
                }
            });
        }
    });
}

function validateDigitalOcean(bot, message, msg, callback) {
        var status = true;
        var needle = require("needle");

        var headers = {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + msg.Token
        };
        console.log(headers);

      
        needle.get("https://api.digitalocean.com/v2/account", {headers: headers}, function (err, resp, body) {
            console.log("bhavya \n")
            if (accountMockData.account) {
                console.log("Digital ocean validated....");
                callback(true);
            } else {
                console.log("Digital ocean validation Failed!....");
                status = false;
                callback(false);
            }
        });
        return status;

}
