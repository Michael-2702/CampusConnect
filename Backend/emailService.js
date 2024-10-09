// emailService.js
const nodemailer = require('nodemailer');
const { otp } = require("./models/db")

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});

const otp = function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
await otpModel.create({ email, otp });

async function sendOTP(email, otp) {
  const mailOptions = {
    from: 'michaelhosamani27@gmail.com',
    to: email,
    subject: 'Email Verification OTP',
    text: `Your OTP for email verification is: ${otp}`,
    html: `<p>Your OTP for email verification is: <strong>${otp}</strong></p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent');
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
}

module.exports = {
  generateOTP,
  sendOTP
};