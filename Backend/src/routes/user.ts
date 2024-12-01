import { Router } from "express";
import viewProfileHanler from "./handlers/viewProfileHandler";
import friendHanler from "./handlers/friendHandler";
import userBioHanler from "./handlers/userBioHandler";
import PfpHanler from "./handlers/profilePicHandler";
import { signupHandler } from "./handlers/signupHandler";
import { loginHandler } from "./handlers/loginHandler";
import { authMiddleware } from "../middlewares/auth";
import viewBioHandler from "./handlers/viewBioHandlers";
import { upload } from "../middlewares/upload";
import { initiateSignUpHandler } from "./handlers/initiateSignupHandler";
import { verifyOtpHandler } from "./handlers/verifyOTPHandler";

const userRouter: Router = Router();

// signup
// step 1: initiate signup
userRouter.post("/initiate-signup", initiateSignUpHandler)

// step 2: verify otp
userRouter.post("/verify-otp", verifyOtpHandler)

// step 3: complete signup
userRouter.post("/complete-signup", signupHandler)

// signin
userRouter.post("/signin", loginHandler)

// view own profile
userRouter.use("/viewProfile", authMiddleware, viewProfileHanler)

// friends
userRouter.use("/friends", authMiddleware, friendHanler)

// user Bio
userRouter.use("/bio", authMiddleware, userBioHanler)

// view Bio
userRouter.use("/viewBio", authMiddleware, viewBioHandler)

// PFP
userRouter.use("/profilePicture", authMiddleware, PfpHanler)


export default userRouter;