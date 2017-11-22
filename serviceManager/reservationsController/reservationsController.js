require('../database_models/reservations.js');
var mongoose = require('mongoose');

var Reservation = mongoose.model('Reservation');

exports.get_reservations = function(params, bot, message, response) {
    console.log("Debug: get_reservations begins"); // Debug
    var UserId = params.UserId;

    Reservation.find({"UserId":params.UserId}, function(err,result) {
        console.log("Debug: data fetched, function called"); // Debug
        if(err) {
            console.log("Could not fetch keys from database", err);
            bot.reply(message, "Internal Server Error, please try again after some time!!!")
        } else {
            if(result == null || result.length == 0) {
                console.log("Could not find reservations for the user", err);
                bot.reply(message, "You have not made any reservations with me yet!!!");
            }
            else{
                // console.log(result); // Debug
                // var reply = textFormatter(bot, message, result);
                textFormatter(bot, message, result);
                // bot.reply(message, reply);
            }
        }
    });
}

function textFormatter(bot, message, data) {
    bot.startConversation(message, function(err, convo) {
        convo.say("Here are all your reservations:");
        var reply = "";
        for(var i=0; i<data.length; i++) {
            console.log("iteration" + (i+1));  // Debug
            if(data[i].Cloud == "digital-ocean")
                data[i].Cloud = "Digital Ocean";
            reply += "> " + (i+1) + ". Cloud Service: *" + data[i].Cloud + "*,   Droplet-ID: *" + data[i].Reservation.ReservationId + "*,   OS: *" + data[i].Request.OS + "*,   Droplet-Config: *" + data[i].Request.config + "*,   IPv4 address: *" + data[i].Reservation.droplet.networks.v4[0].ip_address + "*\n";
        }
        reply += "\n";
        reply += "Further Actions on Droplet: \n\n"
        reply += "Please type: *delete droplet* to delete a droplet" + "\n\n";
        reply += "               **********OR*************" + "*\n\n";
        reply += "Please type: *update droplet* to update the configuration for a droplet";
        convo.say(reply);
    });
}
