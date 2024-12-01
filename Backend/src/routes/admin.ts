import { Router } from "express";
import reportPostHandler from "./handlers/reportPostHandler";
import viewPostHandler from "./handlers/viewPostHandler";
import postRouter from "./posts";
import viewProfileHanler from "./handlers/viewProfileHandler";
import { createAdminHandler } from "./handlers/createAdminHandler";
import { adminLoginHandler } from "./handlers/adminLoginHandler";
import { authMiddleware } from "../middlewares/auth";
import { adminDeletePostHandler } from "./handlers/deletePostHandler";
import { viewUsersHandler } from "./handlers/viewUsersHnalder";
import { getCommentHandler } from "./handlers/getCommentHandler";
import { adminDeleteCommentHandler } from "./handlers/deleteCommentHandler";

const adminRouter: Router = Router();

// create admin
adminRouter.post("/createAdmin", createAdminHandler)

// admin login
adminRouter.post("/adminLogin", adminLoginHandler)

// view admin info
// adminRouter.get("/viewAdminInfo", (req: Request, res: Response) => {

// })
adminRouter.use(authMiddleware)
// delete a post
adminRouter.use("/delete", postRouter)

// view posts
adminRouter.use("/viewPosts", viewPostHandler)

// delete a post
adminRouter.delete("/deletePost/:id", adminDeletePostHandler)

// view reported posts
adminRouter.use("/report", reportPostHandler)

// view profile handler
adminRouter.use("/viewProfile", viewProfileHanler)

// view user count and user list
adminRouter.get("/viewUsers", viewUsersHandler)

// comment get handler
adminRouter.get("/comment/:id", getCommentHandler)

// delete comment
adminRouter.delete("/comment/:postId/:commentId", adminDeleteCommentHandler)


export default adminRouter;