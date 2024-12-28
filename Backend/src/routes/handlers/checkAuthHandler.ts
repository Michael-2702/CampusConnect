import { Request, Response } from "express";
import { userModel } from "../../models/db";


export const checkAuth = async (req: Request, res: Response) => {
    try {   
        const userId = req.userId;

        const user = await userModel.findById(userId).select("-password")
        if(!user){
            res.status(401).json({
                msg: "user not found"
            })
            return
        }

        res.status(400).json(user)
        
    } catch (error) {
        console.error("Error while checking auth")
        res.status(500).json({
            msg: "Error while checking auth"
        })
        return
    }
}