import express, { Router, Request, Response } from "express";

const commentHandler: Router = express();

// upload a comment
commentHandler.get("/signup", (req: Request, res: Response) => {

})

// get comments of a post

// update my own comment

// delete my own comment

// admin - delete comment

export default commentHandler;