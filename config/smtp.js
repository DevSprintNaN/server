const nodemailer = require("nodemailer");
require("dotenv").config();

class SMTPClient{
  constructor(email){
    this.transporter = nodemailer.createTransport({
      host: process.env._SMTP_HOST,
      port: process.env._SMTP_PORT,
      secure: false,
      auth: {
        user: process.env._SMTP_HOST_USER,
        pass: process.env._SMTP_HOST_PASSWORD,
      },
    });
    this.email=email;
  }

  generateOTP(){
    this.OTP=Math.floor(100000 + Math.random() * 900000).toString();
    return this.OTP;
  }

  generateMail(){
    this.mailOptions = {
      from: process.env._SMTP_SENDER_EMAIL,
      to: this.email,
      subject: "Your OTP for verification",
      text: `Your OTP is ${this.OTP}`,
    };
  }

  sendVerificationMail(){
    this.transporter.sendMail(this.mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        throw Error('SMTP Client Error');
      }
      else{
        return info;
      }
    });
  }

}

module.exports=SMTPClient;