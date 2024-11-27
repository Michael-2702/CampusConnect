import { z } from "zod";
import bcrypt from "bcrypt"
import { Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { userModel } from "../../models/db";
import JWT_SECRET from "../../config";

export const loginHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const mySchema = z.object({
        email: z.string().email().refine(val => val.endsWith("@pvppcoe.ac.in"), {
            message: "Only Emails existing with @pvppcoe.ac.in can login"
        }),
        password: z.string()
    }). strict({
        message: "Extra fields are not allowed"
    })

    const response = mySchema.safeParse(req.body);

    if(!response.success){
        res.status(411).json({
            msg: "Incorrect Format",
            error: response.error.errors
        })
        return;
    }

    const {email, password} = req.body;

    try{
        const  user = await userModel.findOne({email});

        if(!user){
            res.status(403).json({
                msg: "Incorrect Email or User Doesn't Exist"
            })
            return;
        }

        const checkPassword = bcrypt.compare(password, user.password);
        if(!checkPassword){
            res.status(411).json({
                msg: "Incorrect Password"
            })
        }

        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET as string)

        res.status(200).json({
            msg: "signed in successfully",
            token
        })
    }
    catch (e) {
        console.error("Error while signing in")
        res.status(500).json({
            msg: "Error while signing in"
        })
        return;
    }
}