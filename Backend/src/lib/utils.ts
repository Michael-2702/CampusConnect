import { Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import mongoose from "mongoose"
import JWT_SECRET from "../config"

export const generateToken = (userId: mongoose.Types.ObjectId, res: Response) => {
    const token = jwt.sign({
        userId
    }, JWT_SECRET, {
        expiresIn: "7d"
    })

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
    })
}