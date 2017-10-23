require('../database_models/reservations.js');
var mongoose = require('mongoose');

var Reservation = mongoose.model('Reservation');

exports.get_reservations = function(params, bot, message, response) {
    var UserId = params.UserId;
    
    Reservation.findOne({"UserId":params.UserId, "Service": "digital-ocean" }, function(err,result) {
        if(err) {
            console.log("Could not fetch keys from database", err);
            bot.reply(message, "Internal Server Error, please try again after some time!!!")
        } else {
            if(result == null) {
                console.log("Could not fetch keys from database", err);
                bot.reply(message, "Oh ho, you have not yet made any reservations with me");
            }
            else{
                console.log(result);
            }
        }
    });
}