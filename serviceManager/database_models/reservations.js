var connection = require('../connect.js');

var mongoose = connection.connection;

Schema = mongoose.Schema;

var ReservationSchema = new Schema({

  UserId: String,
  Cloud : String,
  Reservation: Schema.Types.Mixed,
  Request: Schema.Types.Mixed
}, {collection: 'Reservations'});


var Reservation = mongoose.model('Reservation', ReservationSchema);
