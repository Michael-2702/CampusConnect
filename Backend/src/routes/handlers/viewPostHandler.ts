import { Router, Request, Response } from "express";
import { postModel, userModel } from "../../models/db";
import { mongo } from "mongoose";


const viewPostHandler: Router = Router();


// get all posts
viewPostHandler.get("/", async (req: Request, res: Response): Promise<void> => {
    try{
        const userId = req.userId
        const allPosts = await postModel.find({}).sort({ createdAt: -1});

        if(!allPosts){
            res.status(401).json({
                msg: "No posts found"
            })
        }

        const processedPosts = allPosts.map(post => {
            const isReported = post.reportedBy.includes(new mongo.ObjectId(userId?.toString())); // to check if the logged in user has reported a certain post or not
            
            return {
                ...post.toObject(),
                isReported,
                reportButtonText: isReported ? 'Unreport' : 'Report',
                reportCount: post.reportedBy.length
            };
        });

        res.status(200).json({
            allPosts: processedPosts
        })
    }   
    catch (e) {
        console.error("Error while getting all posts")
        res.status(401).json({
            msg: "Error while getting all posts"
        })
        return
    }   
})

// get my posts
viewPostHandler.get("/myPosts", async (req: Request, res: Response): Promise<void> => {
    try{
        const userId = req.userId;

        const userPosts = await postModel.find({ postedBy: userId }).sort({ createdAt: -1});

        if(!userPosts){
            res.status(401).json({
                msg: "User posts not found"
            })
            return
        }

        res.status(200).json({
            msg: "got my posts successfully",
            myPosts: userPosts
        })
    }
    catch (e) {
        console.error("Error while getting my posts")
        res.status(401).json({
            msg: "Error while getting my posts"
        })
        return
    }
})

// get other user's post
viewPostHandler.get("/:id", async (req: Request, res: Response): Promise<void> => {
    try{
        const userId = req.params.id;

        const userPosts = await postModel.find({ postedBy: userId }).sort({ createdAt: -1});

        if(!userPosts){
            res.status(401).json({
                msg: "User posts not found"
            })
            return
        }

        res.status(200).json({
            msg: `got ${userId}'s posts successfully`,
            myPosts: userPosts
        })
    }
    catch (e) {
        console.error("Error while getting all posts")
        res.status(401).json({
            msg: "Error while getting all posts"
        })
        return
    }
})

export default viewPostHandler;