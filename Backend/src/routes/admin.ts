import express, { Express, Router, Request, Response } from "express";
import commentHandler from "./handlers/commentHandler";
import reportPostHandler from "./handlers/reportPostHandler";

const adminRouter: Router = express();

// create admin
adminRouter.get("/createAdmin", (req: Request, res: Response) => {

})

// admin login

// view admin info

// delete a post

// view posts

// view reported posts
adminRouter.use("/report", reportPostHandler)

// view users profile

// view user count

// view user list

// comment handler
adminRouter.use("/comment", commentHandler)


export default adminRouter;