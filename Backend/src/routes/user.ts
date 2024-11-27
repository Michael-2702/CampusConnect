import { Router, Request, Response } from "express";
import jwt, { Jwt, JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt"
import viewProfileHanler from "./handlers/viewProfileHandler";
import friendHanler from "./handlers/friendHandler";
import userBioHanler from "./handlers/userBioHandler";
import PfpHanler from "./handlers/profilePicHandler";
import { z } from "zod";
import { userModel } from "../models/db";
import { error } from "console";
import JWT_SECRET from "../config";
import { signupHandler } from "./handlers/signupHandler";
import { loginHandler } from "./handlers/loginHandler";

const userRouter: Router = Router();

// signup
userRouter.post("/signup", signupHandler)

// signin
userRouter.post("/signin", loginHandler)

// view own profile
userRouter.use("/viewProfile", viewProfileHanler)

// friends
userRouter.use("/friends", friendHanler)

// user Bio
userRouter.use("/bio", userBioHanler)

// PFP
userRouter.use("/profilePicture", PfpHanler)


export default userRouter;