require('dotenv').config(); 
const express = require("express");
const mongoose = require("mongoose");
const { userRouter } = require("./routes/user");
const { postRouter } = require("./routes/posts");
const { adminRouter } = require("./routes/admin")
const { upload } = require("./middlewares/uploads");
const path = require("path")
const cors = require("cors");
const port = 3000; 

const app = express();
app.use(cors()); 
app.use(express.urlencoded({ extended: false })) // Helps in parsing form data

// Serve static files from 'uploads' directory at localhost:3000/uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json()); 


app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/admin", adminRouter)

async function main() {

    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }

    // Start the server after successful connection
    app.listen(port);
}

main()
