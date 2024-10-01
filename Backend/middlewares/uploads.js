const multer = require("multer")
const path = require("path")
const express = require("express");

const app = express();
app.use(express.urlencoded({ extended: false })) // helps in parsing form data
app.use('/uploads', express.static('uploads')); // Serve static files from the 'uploads' directory

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`)
    }
})
  
const upload = multer({ storage: storage })

module.exports = {
    upload
}