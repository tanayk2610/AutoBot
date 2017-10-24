var nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'autoBotsWolfPack@gmail.com',
    pass: process.env.AUTOBOTEMAILPASSWORD
  }
});



module.exports = {

  sendEmail: function(emailAddress, otp) {
    var mailOptions = {
    from: 'autoBotsWolfPack@gmail.com',
    to: emailAddress,
    subject: 'OTP for verification by Optimus Prime',
    text: "Hello Human \n" + "\n" + "Please enter this OTP at slack channel so that optimus prime can confirm your action : " + otp + "\n\n" + "Regards" + "\n" + "Team AutoBots"
    };

    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
    });
  }

}
