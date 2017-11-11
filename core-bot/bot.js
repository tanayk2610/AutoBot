var Botkit = require('botkit');
var apiai = require('apiai');
var app = apiai(process.env.APIAITOKEN);
var Slack = require('slack-node')
var request = require('request')
var service = require('./service.js')
var slack = new Slack(process.env.SLACKTOKEN)
var emailService = require('../emailService/emailService.js')
var shortid = require('shortid')
var otpMockData = require('./otpMock.json')
// variable to store all slack user details
var slackUsersList =[]
var url = "https://api.api.ai/v1/"
var userIdNameMap = {}

var userIdEmailMap = {}
function getSlackUsers() {

  slack.api("users.list", function(error, response) {
    slackUsersList = response.members;

  });
  for(var i = 0 ; i < slackUsersList.length; i++) {
    var user = slackUsersList[i];
    userIdNameMap[user.id] = user.real_name
    userIdEmailMap[user.id] = user.profile.email
  }
}


var possibleFunctions = "Here is what my autobots can do for you: \n 1. `create vm` : creates virtual machine on Digital Ocean, you can add flavors on top of the requested machine\n 2. `create VM image with eclipse` : creates a virtual machine image with eclipse configured and you can also install selective plugins\n 3. `manage reservations` : shows all your current reservations and further options to edit/delete the specific reservation\n 4. `save digital ocean keys`: will save your digital ocean keys for creating virtual machines. \n 5. `show available configuratons` : VM configurations which can be created on Digital Ocean\n 6. `exit` : exit the conversation\n"

var controller = Botkit.slackbot({
    debug: false
});

// connect the bot to a stream of messages
controller.spawn({
    token: process.env.SLACKTOKEN,
}).startRTM()

/** Stores the latest session id associated with the user **/
var sessionMap = {}
getSlackUsers()

controller.hears('(.*)', ['mention', 'direct_mention', 'direct_message'], function (bot, message) {
      if (sessionMap[message.user] == undefined) {
      sessionMap[message.user] = message.user;
    }

      if(message.text.indexOf("<") > 1) {
        console.log("Initial:" + message.text)
        message.text = message.text.substring(0,message.text.indexOf("<"));
      }

      var request = app.textRequest(message.text, {
      sessionId: sessionMap[message.user]
    });

    request.on('response', function (response) {
        // console.log(response);
        if (response.result.actionIncomplete) {
            bot.reply(message, response.result.fulfillment.speech);
        } else {
            switch (response.result.action) {

                case 'user.initiation':
                   if(userIdNameMap[message.user] == undefined) {
                     getSlackUsers()
                   }

                   bot.reply(message, "Hello, " + userIdNameMap[message.user])
                   break;

                case 'greeting.initial':
                    bot.reply(message, response.result.fulfillment.speech);
                    break;

                case 'user.reply':
                    bot.reply(message, response.result.fulfillment.speech);
                    break;

                case 'bot.help':
                    bot.reply(message, possibleFunctions);
                    break;

                case 'action.exit':
                    bot.reply(message, response.result.fulfillment.speech);
                    sessionMap[message.user] = message.user;
                    deleteContextsForUser(message.user)
                    break;

                case 'conversation.end':
                    if(userIdNameMap[message.user] == undefined) {
                        getSlackUsers()
                    }
                     bot.reply(message, "Good Bye, " + userIdNameMap[message.user])
                    break;

                case 'save.digital.ocean.keys':
                    service.saveDigitalOceanKeys(bot, message, response);
                    break;

                case 'create.vm':
                    var OsType =  response.result.parameters.osKind
                    // console.log(OsType)
                    var config = response.result.parameters.config
                    bot.startConversation(message, function(err, convo){
                      if(err) {
                        console.log("error")
                      } else{
                        convo.ask("Type **plain** to get a plain Vm OR Type **flavored** to add jenkins flavor on top of your VM", function(response, convo){
                        if(response.text === "plain") {
                          service.createVirtualMachine(bot, message, OsType, config, false);
                        } else if(response.text === "flavored"){
                          service.createVirtualMachine(bot, message, OsType, config, true);
                        } else {
                          bot.reply(message, "Please choose either plain or flavored, and try again!!!!!");
                        }
                        convo.next();
                        });
                      }
                    });

                    break;

                case 'manage.reservation':
                    service.manageReservations(bot, message, response);
                    break;

                case 'terminate.droplet':
                    if(userIdEmailMap[message.user] == undefined) {
                        getSlackUsers()
                    }
                    var userEmail = userIdEmailMap[message.user];
                    // mock otp for this milestone, mocking removed for service milestone
                    var otp = shortid.generate()
                    var dropletId = response.result.parameters.reservationId
                    console.log("Droplet Id is: " + dropletId);
                    emailService.sendEmail(userEmail, otp);
                    bot.startConversation(message, function(err, convo){
                      if(err) {
                        console.log("error")
                      } else{
                        convo.ask("I have sent you an OTP. Please enter OTP to verify the terminate action!!", function(response, convo){
                          validateOTP(response.text, otp, function(valid){
                            if(!valid){
                              bot.reply(message, "OTP Verification failed. Please try again!!!")
                            } else{
                              service.terminateVirtualMachine(bot, message, dropletId)
                            }
                          });
                          convo.next();
                        });
                      }
                    });
                    //service.terminateVirtualMachine(bot, message, response);
                    break;

                case 'show.configurations':
                   var textContent = 'Click below link to see configurations supported by digital ocean \n https://www.digitalocean.com/pricing/'
                   var attachments = [{
                      text: textContent
                    }]
                   bot.reply(message, {
                     attachments: attachments
                   })
                   break;

                case 'update.droplet' :
                   service.updateVirtualMachine(bot, message, response);
                   break;

                case 'create.vm.with.eclipse' :
                   service.createPackerImage(bot, message, response);

                default:
                    bot.reply(message, response.result.fulfillment.speech);

            }
        }
    });

    request.on('error', function (error) {
        console.log(error);
    });

    request.end();
});


function deleteContextsForUser(sessionId)
{

	var options = {
		url: url + "contexts/?sessionId=" + sessionId,
		method: 'DELETE',
		headers: {
			"User-Agent": "EnableIssues",
			"content-type": "application/json",
			"Authorization": "Bearer" + process.env.APIAITOKEN
		}
	};

	// Send a http request to url and specify a callback that will be called upon its return.
	request(options, function (error, response, body)
	{
    console.log("context cleared");
	});

}


function validateOTP(number, otp, callback) {
  if(otp == number) {
    callback(true);
  } else{
    callback(false);
  }
}

//  bot.reply(message, "Please see below available configurations from Digital Ocean")
//  bot.reply(message, {
//    "attachments": [
//      {
//        "fallback": "Required plain-text summary of the attachment.",
//        "color": "#36a64f",
//        "image_url": "https://transfer.sh/hMmpP/digitalOceanPricing.PNG",
//        "ts": 123456789
//      }
//    ]
//  });
