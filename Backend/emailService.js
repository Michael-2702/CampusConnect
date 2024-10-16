// emailService.js
require('dotenv').config(); 
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  }
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTP(email, otp) {
  const mailOptions = {
    from: '"VPPCOE" <michaelhosamani27@gmail.com>',
    to: email,
    subject: 'Email Verification OTP',
    text: `Your OTP for email verification is: ${otp}`,
    html: `<p>Your OTP for email verification is: <strong>${otp}</strong></p>`
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent: %s', info.messageId);
    // Ethereal URL for viewing the sent email (for testing purposes)
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
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