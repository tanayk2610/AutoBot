var connection = require('../connect.js');

var mongoose = connection.connection;

Schema = mongoose.Schema;

var KeySchema = new Schema({

  UserId: {
    type: String,
    index: true
  },
  Service: String,
  Token: String,
  KeyPair: String

}, {collection: 'Keys'});

var Key = mongoose.model('Key', KeySchema);
