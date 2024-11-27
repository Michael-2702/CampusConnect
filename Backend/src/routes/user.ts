import { Router, Request, Response } from "express";
import jwt, { Jwt, JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt"
import viewProfileHanler from "./handlers/viewProfileHandler";
import friendHanler from "./handlers/friendHandler";
import userBioHanler from "./handlers/userBioHandler";
import PfpHanler from "./handlers/profilePicHandler";
import { any, z } from "zod";
import { userModel } from "../models/db";
import { error } from "console";
import JWT_SECRET from "../config";
import { signupHandler } from "./handlers/signupHandler";
import { loginHandler } from "./handlers/loginHandler";
import { authMiddleware } from "../middlewares/auth";

const userRouter: Router = Router();

// signup
userRouter.post("/signup", signupHandler)

// signin
userRouter.post("/signin", loginHandler)

userRouter.get("/hello", authMiddleware, (req: Request, res: Response) => {
    res.send("Hello")
})

// view own profile
userRouter.use("/viewProfile", authMiddleware, viewProfileHanler)

// friends
userRouter.use("/friends", authMiddleware, friendHanler)

// user Bio
userRouter.use("/bio", authMiddleware, userBioHanler)

// PFP
userRouter.use("/profilePicture", authMiddleware, PfpHanler)


export default userRouter;