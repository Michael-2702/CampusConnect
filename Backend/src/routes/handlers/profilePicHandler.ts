import { Router, Request, Response } from "express";
import { userModel } from "../../models/db";
import { upload } from "../../middlewares/upload";
import path from 'path';
import fs from 'fs';

const PfpHanler: Router = Router();

const UPLOADS_BASE_PATH = path.join(process.cwd(), 'uploads');

// set/change pfp
PfpHanler.put("/", upload.single("picture"), async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const profileImagePath = req.file ? `/uploads/profileImages/${req.file.filename}` : undefined;

        const user = await userModel.findById(userId);

        if (!user) {
            res.status(404).json({
                msg: "User not found"
            });
            return;
        }

        user.profileImagePath = profileImagePath;
        await user.save();

        res.json({
            msg: "Profile Picture uploaded successfully",
            user
        });

        // if (!user.profileImagePath) {
        //     user.profileImagePath = profileImagePath;
        //     await user.save();

        //     res.json({
        //         msg: "Profile Picture uploaded successfully",
        //         user
        //     });
        // } else {
        //     res.status(400).json({
        //         msg: "Profile picture is already uploaded, use updateProfilePicture endpoint to update it"
        //     });
        // }
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        res.status(500).json({ 
            msg: "Error uploading profile picture", 
            error: error instanceof Error ? error.message : 'Unknown error' 
        });
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
        console.error("Error while getting pfp", e)
        res.status(401).json({
            msg: "Error while getting pfp"
        })
        return;
    }
})

// get other's pfp
PfpHanler.get("/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        const user = await userModel.findById(userId);
        if (!user) {
            res.status(404).json({ msg: "User not found" });
            return;
        }

        res.json({
            imagePath: user.profileImagePath
        });
    } catch (error) {
        console.error("Error getting profile picture:", error);
        res.status(500).json({ 
            msg: "Error deleting getting picture"
        });
    }
})

// delete pfp
PfpHanler.delete("/", async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        const user = await userModel.findById(userId);
        if (!user) {
            res.status(404).json({ msg: "User not found" });
            return;
        }

        if (!user.profileImagePath) {
            res.status(400).json({ msg: "No profile picture to delete" });
            return;
        }

        const imagePath = path.join(UPLOADS_BASE_PATH, 'profileImages', path.basename(user.profileImagePath));

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath); 
        }

        user.profileImagePath = "";

        await user.save();

        res.json({
            msg: "Profile picture deleted successfully",
            user
        });
    } catch (error) {
        console.error("Error deleting profile picture:", error);
        res.status(500).json({ 
            msg: "Error deleting profile picture",
        });
    }
})

export default PfpHanler;