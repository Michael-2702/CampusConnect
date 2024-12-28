import { Router } from "express";
import viewProfileHanler from "./handlers/viewProfileHandler";
import friendHanler from "./handlers/friendHandler";
import userBioHanler from "./handlers/userBioHandler";
import PfpHanler from "./handlers/profilePicHandler";
import { signupHandler } from "./handlers/signupHandler";
import { loginHandler } from "./handlers/loginHandler";
import viewBioHandler from "./handlers/viewBioHandlers";
import { initiateSignUpHandler } from "./handlers/initiateSignupHandler";
import { verifyOtpHandler } from "./handlers/verifyOTPHandler";
import { authMiddleware } from "../middlewares/auth";
import { checkAuth } from "./handlers/checkAuthHandler";

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

userRouter.use(authMiddleware)

// check auth of user
userRouter.get("/check", checkAuth)

// view own profile
userRouter.use("/viewProfile", viewProfileHanler)

// friends
userRouter.use("/friends", friendHanler)

// user Bio
userRouter.use("/bio", userBioHanler)

// view Bio
userRouter.use("/viewBio", viewBioHandler)

// PFP
userRouter.use("/profilePicture", PfpHanler)


export default userRouter;