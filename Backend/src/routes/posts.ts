import express, { Express, Router, Request, Response } from "express";
import commentHandler from "./handlers/commentHandler";
import likeHandler from "./handlers/likeHandler";
import reportPostHandler from "./handlers/reportPostHandler";
import viewPostHandler from "./handlers/viewPostHandler";
import { authMiddleware } from "../middlewares/auth";
import { uploadPostsHandler } from "./handlers/uploadPostsHandler";
import { adminDeletePostHandler, deletePostHandler } from "./handlers/deletePostHandler";

const postRouter: Router = express();

// upload posts
postRouter.post("/create", authMiddleware, uploadPostsHandler)

// view Posts handler
postRouter.use("/getPosts", authMiddleware, viewPostHandler)

// delete your own post
postRouter.delete("/deletePost/:id", authMiddleware, deletePostHandler)

// admin -  delete post
postRouter.delete("/adminDeletePost/:id", authMiddleware, adminDeletePostHandler)

// report posts
postRouter.use("/report", reportPostHandler)

// Like handler
postRouter.use("/like", likeHandler)

// comment handler
postRouter.use("/comment", commentHandler)

export default postRouter;