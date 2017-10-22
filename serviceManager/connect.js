// var express = require('express'),
// fs = require('fs'),
// bodyParser = require('body-parser'),

// require('../serviceManager/database_models/provider_keys.js');
var mongoDBUri = 'mongodb://localhost/autoBots';
var mongoose = require('mongoose');
// Key = mongoose.model('Key');
// connectDB();

mongoose.connect(mongoDBUri);
var db = mongoose.connection;

db.on('open', function () {

	console.log("connected to AutoBots Database");

});

db.on('error', function () {
  console.log('unable to connect to database at ' + mongoDBUri + " trying again in 5s...");
  setTimeout(function() {
  	connectDB();
  }, 5000);
});

function connectDB() {
	try {
	  mongoose.connect(mongoDBUri);
	  db = mongoose.connection;
	  console.log("Started connection on " + mongoDBUri + ", waiting for it to open...");
	} catch (err) {
	  console.log("Setting up failed to connect to " + mongoDBUri, err.message);
	}
}

exports.connection = mongoose
