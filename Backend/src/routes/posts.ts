import express, { Express, Router, Request, Response } from "express";
import commentHandler from "./handlers/commentHandler";
import likeHandler from "./handlers/likeHandler";
import reportPostHandler from "./handlers/reportPostHandler";
import viewPostHandler from "./handlers/viewPostHandler";
import { authMiddleware } from "../middlewares/auth";
import { uploadPostsHandler } from "./handlers/uploadPostsHandler";

const postRouter: Router = express();

// upload posts
postRouter.post("/create", authMiddleware, uploadPostsHandler)

// view Posts handler
postRouter.use("/getPosts", authMiddleware, viewPostHandler)

// delete your own post
postRouter.delete("/deletePost/:id", (req: Request, res: Response) => {

})

// admin -  delete post
postRouter.delete("/AdminDeletePost/:id", (req: Request, res: Response) => {

})

// report posts
postRouter.use("/report", reportPostHandler)

// Like handler
postRouter.use("/like", likeHandler)

// comment handler
postRouter.use("/comment", commentHandler)

export default postRouter;