import { Router, Request, Response } from "express";
import { userModel } from "../../models/db";

const viewProfileHanler: Router = Router();

// use zod 

// view profile
viewProfileHanler.get("/", async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId

        const user = await userModel.findById(userId);

        if(!user){
            res.status(401).json({
                msg: "User not found"
            })
            return;
        }

        res.status(200).json({
            userInfo: user
        })

    }   
    catch (e) {
        console.error("Error while view my profile")
        res.status(401).json({
            msg: "Error while view my profile"
        })
        return;
    }
})

viewProfileHanler.get("/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id

        const user = await userModel.findById(userId);

        if(!user){
            res.status(401).json({
                msg: "User not found"
            })
            return;
        }

        res.status(200).json({
            userInfo: user,
            isOwnProfile: false
        })

    }   
    catch (e) {
        console.error("Error while view my profile")
        res.status(401).json({
            msg: "Error while view my profile"
        })
        return;
    }
})


export default viewProfileHanler;