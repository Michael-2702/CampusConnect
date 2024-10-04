require('dotenv').config(); 
const express = require("express");
const mongoose = require("mongoose");
const { userRouter } = require("./routes/user");
const { postRouter } = require("./routes/posts");
const cors = require("cors");
const port = 3000; 

const app = express();
app.use(cors()); 

app.use(express.json()); 

app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);

async function main() {
    console.log('MONGO_URL:', process.env.MONGO_URL);

    if (!process.env.MONGO_URL) {
        throw new Error('MONGO_URL is undefined. Please check your .env file.');
    }

    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

main().catch((err) => console.error('Error in main function:', err));
