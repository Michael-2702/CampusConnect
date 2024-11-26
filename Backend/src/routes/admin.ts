import express, { Express, Router, Request, Response } from "express";
import commentHandler from "./handlers/commentHandler";
import reportPostHandler from "./handlers/reportPostHandler";
import viewPostHandler from "./handlers/viewPostHandler";
import postRouter from "./posts";
import viewProfileHanler from "./handlers/viewProfileHandler";

const adminRouter: Router = express();

// create admin
adminRouter.post("/createAdmin", (req: Request, res: Response) => {

})

// admin login
adminRouter.post("/adminLogin", (req: Request, res: Response) => {

})

// view admin info
adminRouter.get("/viewAdminInfo", (req: Request, res: Response) => {

})

// delete a post
adminRouter.use("/delete", postRouter)

// view posts
adminRouter.use("/viewPosts", viewPostHandler)

// view reported posts
adminRouter.use("/report", reportPostHandler)

// view profile handler
adminRouter.use("/viewProfile", viewProfileHanler)

// view user count

// view user list

// comment handler
adminRouter.use("/comment", commentHandler)


export default adminRouter;