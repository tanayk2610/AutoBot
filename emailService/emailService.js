var nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'autoBotsWolfPack@gmail.com',
    pass: 'NcsuAutoBots'
  }
});



module.exports = {

  sendEmail: function(emailAddress, otp) {
    var mailOptions = {
    from: 'autoBotsWolfPack@gmail.com',
    to: emailAddress,
    subject: 'OTP for verification by Optimus Prime',
    text: otp
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
