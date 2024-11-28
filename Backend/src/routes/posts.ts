import {  Router } from "express";
import commentHandler from "./handlers/commentHandler";
import likeHandler from "./handlers/likeHandler";
import reportPostHandler from "./handlers/reportPostHandler";
import viewPostHandler from "./handlers/viewPostHandler";
import { authMiddleware } from "../middlewares/auth";
import { uploadPostsHandler } from "./handlers/uploadPostsHandler";
import { deletePostHandler } from "./handlers/deletePostHandler";

const postRouter: Router = Router();

// upload posts
postRouter.post("/create", authMiddleware, uploadPostsHandler)

// view Posts handler
postRouter.use("/viewPosts", authMiddleware, viewPostHandler)

// delete your own post
postRouter.delete("/deletePost/:id", authMiddleware, deletePostHandler)

// report posts
postRouter.use("/report", authMiddleware, reportPostHandler)

// Like handler
postRouter.use("/like", authMiddleware, likeHandler)

// comment handler
postRouter.use("/comment", authMiddleware, commentHandler)

export default postRouter;