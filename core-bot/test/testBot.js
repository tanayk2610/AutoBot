var chai = require("chai");
var expect = chai.expect;
var nock = require("nock");

var main = require("../bot.js");

// Load mock data
var data = require("../mock.json")

describe('testBot', function(){

  // MOCK SERVICE
  var mockService = nock("https://api.api.ai/v1/")
  .persist()
});
