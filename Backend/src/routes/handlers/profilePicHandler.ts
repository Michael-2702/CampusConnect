import express, { Express, Router, Request, Response } from "express";
import { userModel } from "../../models/db";


const PfpHanler: Router = express();

// set/change pfp
PfpHanler.put("/", async (req: Request, res: Response): Promise<void> => {
    try{
        const userId = req.userId;
        const { imagePath } = req.body

        const user = await userModel.findById(userId);

        if(!user){
            res.status(401).json({
                msg: "user not found"
            })
            return;
        }

        user.profileImagePath = imagePath
        user.save()

        res.status(200).json({
            imagePath
        })
    }   
    catch (e) {
        console.error("Error while setting/changing pfp")
        res.status(401).json({
            msg: "Error while setting/changing pfp"
        })
        return;
    }
})

// get pfp
PfpHanler.get("/", async (req: Request, res: Response): Promise<void> => {
    try{
        const userId = req.userId;

        const user = await userModel.findById(userId);

        if(!user){
            res.status(401).json({
                msg: "user not found"
            })
            return;
        }

        res.status(200).json({
            imagePath: user.profileImagePath
        })
    }   
    catch (e) {
        console.error("Error while getting pfp")
        res.status(401).json({
            msg: "Error while getting pfp"
        })
        return;
    }
})

// get other's pfp
PfpHanler.get("/:id", async (req: Request, res: Response): Promise<void> => {
    try{
        const userId = req.params.id;

        const user = await userModel.findById(userId);

        if(!user){
            res.status(401).json({
                msg: "user not found"
            })
            return;
        }

        res.status(200).json({
            imagePath: user.profileImagePath
        })
    }   
    catch (e) {
        console.error("Error while getting pfp")
        res.status(401).json({
            msg: "Error while getting pfp"
        })
        return;
    }
})

// delete pfp
PfpHanler.delete("/", async (req: Request, res: Response): Promise<void> => {
    try{
        const userId = req.userId;

        const user = await userModel.findById(userId);

        if(!user){
            res.status(401).json({
                msg: "user not found"
            })
            return;
        }

        if(user.profileImagePath !== ""){
            user.profileImagePath = ""
            user.save()

            res.status(200).json({
                imagePath: user.profileImagePath
            })
        }
    }   
    catch (e) {
        console.error("Error while deleting pfp")
        res.status(401).json({
            msg: "Error while deleting pfp"
        })
        return;
    }
})

export default PfpHanler;