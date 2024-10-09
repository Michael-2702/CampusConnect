// emailService.js
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: 'your-email@example.com',
    pass: 'your-password'
  }
});

// Generate a verification token
function generateVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Send verification email
async function sendVerificationEmail(email, token) {
  const mailOptions = {
    from: '"Your App Name" <noreply@yourapp.com>',
    to: email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking on this link: http://yourapp.com/verify/${token}`,
    html: `<p>Please verify your email by clicking on this link: <a href="http://yourapp.com/verify/${token}">Verify Email</a></p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent');
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}

// Verify email
async function verifyEmail(token) {
  // Here you would typically:
  // 1. Find the user with this token in your database
  // 2. Check if the token is still valid (not expired)
  // 3. If valid, mark the user's email as verified
  // 4. Clear the verification token

  // This is a placeholder implementation
  console.log('Verifying token:', token);
  return true; // Return true if verification successful, false otherwise
}

module.exports = {
  generateVerificationToken,
  sendVerificationEmail,
  verifyEmail
};