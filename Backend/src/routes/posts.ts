import {  Router } from "express";
import commentHandler from "./handlers/commentHandler";
import likeHandler from "./handlers/likeHandler";
import reportPostHandler from "./handlers/reportPostHandler";
import viewPostHandler from "./handlers/viewPostHandler";
import { authMiddleware } from "../middlewares/auth";
import { uploadPostsHandler } from "./handlers/uploadPostsHandler";
import { deletePostHandler } from "./handlers/deletePostHandler";
import { upload } from "../middlewares/upload";
import unReportPostHandler from "./handlers/unReportPostHandler";

const postRouter: Router = Router();

postRouter.use(authMiddleware)

// upload posts
postRouter.post("/createPost", upload.single("picture"), uploadPostsHandler)

// view Posts handler
postRouter.use("/viewPosts", viewPostHandler)

// delete your own post
postRouter.delete("/deletePost/:postId", deletePostHandler)

// report posts
postRouter.use("/reportPost", reportPostHandler)

// un-report posts
postRouter.use("/unReportPost", unReportPostHandler)

// Like handler
postRouter.use("/like", likeHandler)

// comment handler
postRouter.use("/comment", commentHandler)

export default postRouter;