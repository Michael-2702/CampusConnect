import express, { Express, Router, Request, Response } from "express";
import commentHandler from "./handlers/commentHandler";
import likeHandler from "./handlers/likeHandler";
import reportPostHandler from "./handlers/reportPostHandler";
import viewPostHandler from "./handlers/viewPostHandler";

const postRouter: Router = express();

// upload posts
postRouter.get("/create", (req: Request, res: Response) => {

})

// get all posts

// delete your own post

// admin -  delete post

// get my posts
postRouter.use("/getPosts", viewPostHandler)

// get other user's posts

// report posts
postRouter.use("/report", reportPostHandler)

// Like handler
postRouter.use("/like", likeHandler)

// comment handler
postRouter.use("/comment", commentHandler)

export default postRouter;