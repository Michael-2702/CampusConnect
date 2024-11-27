require('dotenv').config()
import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors"
// import path from "path";
import userRouter from "./routes/user";
import adminRouter from "./routes/admin";
import postRouter from "./routes/posts";
const app: Express = express()

app.use(cors());
app.use(express.json());

app.use("/api/v2/user", userRouter)
app.use("/api/v2/admin", adminRouter)
app.use("/api/v2/post", postRouter)



async function main() {
    try {
        await mongoose.connect("mongodb://localhost:27017/CampusConnect");
        console.log("Connected to DB")
    }
    catch(e) {
        console.error("Error while connecting to DB", e);
    }

    app.listen(3000);
}
main()