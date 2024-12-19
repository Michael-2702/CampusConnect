import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { adminModel } from "../../models/db"
import JWT_SECRET from "../../config"


export const adminLoginHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { adminId, password }  = req.body

        const admin = await adminModel.findOne({adminId})

        if(!admin){
            res.status(401).json({
                msg: "Admin not found or Incorrect credentials"
            })
            return
        }

        const checkPassword = await bcrypt.compare(password, admin.password)

        if(!checkPassword){
            res.status(401).json({
                msg: "Incorrect password"
            })
            return
        }

        const token = jwt.sign({
            userId: admin._id
        }, JWT_SECRET as string)

        res.status(200).json({
            msg: "admin signed in successfully",
            token
        })
    }
    catch(e) {
        console.error("Error while loggin admin")
        res.status(401).json({
            msg: "Error while loggin admin"
        })
        return
    }
}