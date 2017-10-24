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
                console.log("Could not fetch keys from database", err);
                bot.reply(message, "You have not yet made any reservations with me yet!!!");
            }
            else{
                console.log(result); // Debug
                var reply = textFormatter(result);
                bot.reply(message, reply);
            }
        }
    });
}

function textFormatter(data) {
    var reply = "*Here are all your reservations:* \n";
    for(var i=0; i<data.length; i++) {
        console.log("iteration" + (i+1));  // Debug
        if(data[i].Cloud == "digital-ocean")
            data[i].Cloud = "Digital Ocean";
        if(data[i].Request.OS == "ubuntu")
            data[i].Request.OS = "Ubuntu"
        reply += "> " + (i+1) + ". Cloud Service: *" + data[i].Cloud + "*, Reservation ID: *" + data[i].Reservation.ReservationId + "*, OS: *" + data[i].Request.OS + "*\n";
    }
    reply += "\n";
    reply += "Please type: *delete droplet <reservation ID>* to delete a droplet" + "\n";
    reply += "**********OR*************" + "*\n";
    reply += "Please type: *update droplet <reservation ID>* to update the configuration for a droplet" + "\n";
    return reply;
}
