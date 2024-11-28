import express, { Express, Router, Request, Response } from "express";
import commentHandler from "./handlers/commentHandler";
import reportPostHandler from "./handlers/reportPostHandler";
import viewPostHandler from "./handlers/viewPostHandler";
import postRouter from "./posts";
import viewProfileHanler from "./handlers/viewProfileHandler";
import { createAdminHandler } from "./handlers/createAdminHandler";
import { adminLoginHandler } from "./handlers/adminLoginHandler";
import { authMiddleware } from "../middlewares/auth";
import { adminDeletePostHandler } from "./handlers/deletePostHandler";
import { viewUsersHandler } from "./handlers/viewUsersHnalder";

const adminRouter: Router = express();

// create admin
adminRouter.post("/createAdmin", createAdminHandler)

// admin login
adminRouter.post("/adminLogin", adminLoginHandler)

// view admin info
// adminRouter.get("/viewAdminInfo", (req: Request, res: Response) => {

// })

// delete a post
adminRouter.use("/delete", authMiddleware, postRouter)

// view posts
adminRouter.use("/viewPosts", authMiddleware, viewPostHandler)

// delete a post
adminRouter.delete("/deletePost/:id", authMiddleware, adminDeletePostHandler)

// view reported posts
adminRouter.use("/report", authMiddleware, reportPostHandler)

// view profile handler
adminRouter.use("/viewProfile", authMiddleware, viewProfileHanler)

// view user count and user list
adminRouter.get("/viewUsers", authMiddleware, viewUsersHandler)

// comment handler
adminRouter.use("/comment", authMiddleware, commentHandler)


export default adminRouter;