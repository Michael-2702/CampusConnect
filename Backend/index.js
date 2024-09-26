require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const { userRouter } = require("./routes/user")
const { postRouter } = require("./routes/posts")

const app = express()

app.use(express.json())

app.use("/api/v1/user", userRouter)
app.use("/api/v1/post", postRouter)

async function main(){
    await mongoose.connect(process.env.MONGO_URL)
    console.log("connected to mongodb");
    
    app.listen(3000)
}

main()
