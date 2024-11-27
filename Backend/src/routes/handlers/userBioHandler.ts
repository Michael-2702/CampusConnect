import express, { Express, Router, Request, Response } from "express";
import { userModel } from "../../models/db";


const userBioHanler: Router = express();

// set bio
userBioHanler.post("/", async (req: Request, res: Response): Promise<void> => {
    try{
        const userId = req.userId
        const { content } = req.body

        const user = await userModel.findById(userId)

        if(!user) {
            res.status(403).json({
                msg: "user not found"
            })
            return
        }

        user.bio = content

        user.save();

        res.status(200).json({
            bio: user.bio
        })
    }
    catch(e) {
        console.error("Error while setting bio")
    }
})
// i think the post request isn't even necessary as it is set as an empty string in the database itself by default

// update bio 
userBioHanler.put("/", async (req: Request, res: Response) => {
    try{
        const userId = req.userId
        const { content } = req.body

        const user = await userModel.findById(userId)

        if(!user) {
            res.status(403).json({
                msg: "user not found"
            })
            return
        }

        user.bio = content

        user.save();

        res.status(200).json({
            bio: user.bio
        })
    }
    catch(e) {
        console.error("Error while updating bio")
    }
})

// delete bio
userBioHanler.delete("/", async (req: Request, res: Response) => {
    try{
        const userId = req.userId

        const user = await userModel.findById(userId)

        if(!user) {
            res.status(403).json({
                msg: "user not found"
            })
            return
        }

        user.bio = ""

        user.save();

        res.status(200).json({
            bio: user.bio
        })
    }
    catch(e) {
        console.error("Error while updating bio")
    }
})

export default userBioHanler;