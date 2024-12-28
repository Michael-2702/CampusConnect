import { Request, Response } from "express";
import { otpModel, userModel } from "../../models/db";
import { generateOTP, sendOTP } from "../../emailService";


export const initiateSignUpHandler = async (req: Request, res: Response) => {
    const { email } = req.body;
  
    if (!email.endsWith('@pvppcoe.ac.in')) {
      res.status(403).json({ msg: "Only Emails ending with @pvppcoe.ac.in can Register" });
      return;
    }
  
    try {
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        res.status(403).json({ msg: "Email Already Exists" });
        return;
      }
  
      const otp = generateOTP();
      await otpModel.findOneAndUpdate(
        { email },
        { otp, createdAt: new Date() },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
  
      const emailSent = await sendOTP(email, otp);
      if (!emailSent) {
        res.status(500).json({ msg: "Failed to send OTP. Please try again." });
        return
      }
  
      res.json({ msg: "OTP sent to your email. Please verify to continue registration." });
    } catch (e) {
      console.error(e);
      res.status(500).json({ msg: "An error occurred. Please try again." });
    }
};
  