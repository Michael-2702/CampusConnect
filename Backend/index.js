require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const { userRouter } = require("./routes/user");
const { postRouter } = require("./routes/posts");
const cors = require("cors");
const port = 3000;

const app = express()
app.use(cors());

app.use(express.json())

app.use("/api/v1/user", userRouter)
app.use("/api/v1/post", postRouter)

async function main(){
    await mongoose.connect(process.env.MONGO_URL)
    console.log("connected to mongodb");
    
    app.listen(port)
}

main()
