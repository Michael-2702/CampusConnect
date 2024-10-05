const multer = require("multer")
const path = require("path")
const express = require("express");

const app = express();
app.use(express.urlencoded({ extended: false })) // helps in parsing form data
app.use('/uploads', express.static('uploads')); // Serve static files from the 'uploads' directory

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      if (req.route.path === "/createPost") {
          // Post images should go in 'uploads/userPostsImages'
          cb(null, './uploads/userPostsImages');
      } else {
          // Profile images should go in 'uploads/profileImages'
          cb(null, './uploads/profileImages');
      }
  },
  filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`); 
  }
});
  
const upload = multer({ storage: storage })

module.exports = {
    upload
}