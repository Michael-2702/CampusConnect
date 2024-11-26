import express, { Express, Router, Request, Response } from "express";
import { Jwt } from "jsonwebtoken";
import bcrypt from "bcrypt"
import viewProfileHanler from "./handlers/viewProfileHandler";
import friendHanler from "./handlers/friendHandler";
import userBioHanler from "./handlers/userBioHandler";
import PfpHanler from "./handlers/profilePicHandler";

const userRouter: Router = express();

// signup
userRouter.get("/signup", (req: Request, res: Response) => {

})

// signup
userRouter.get("/signin", (req: Request, res: Response) => {

})

// view own profile
userRouter.use("/viewProfile", viewProfileHanler)

// friends
userRouter.use("/friends", friendHanler)

// user Bio
userRouter.use("/bio", userBioHanler)

// PFP
userRouter.use("/profilePicture", PfpHanler)


export default userRouter;