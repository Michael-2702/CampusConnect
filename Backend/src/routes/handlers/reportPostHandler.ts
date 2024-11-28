import express, { Express, Router, Request, Response } from "express";
import { postModel, userModel } from "../../models/db";
import { mongo } from "mongoose";


const reportPostHandler: Router = express();

// report/un-report a post
reportPostHandler.put("/:id", async (req: Request, res: Response): Promise<void> => {
    try{
        const postId = req.params.id
        const userId = req.userId

        const post = await postModel.findById(postId)
        if(!post){
            res.status(401).json({
                msg: "Post not found"
            })
            return
        }

        const userObjectId = new mongo.ObjectId(userId as string)

        const isReported = post.reportedBy.includes(userObjectId)
        if(!isReported){

            post.reportedBy.push(userObjectId);
            console.log("hi")
            await post.save()
            console.log("hello")
            const updatedPost = {
                ...post?.toObject(),
                isReported: true,
                reportButtonText: 'Unreport',
                reportCount: post.reportedBy.length
            };
            console.log("hey")
            res.status(200).json({
                updatedPost
            })
            return
        }
        else {

            post.reportedBy = post.reportedBy.filter(reporterId => !reporterId.equals(userObjectId));
            await post.save();
            
            const updatedPost = {
                ...post?.toObject(),
                isReported: false,
                reportButtonText: 'Report',
                reportCount: post.reportedBy.length
            };

            res.status(200).json({
                updatedPost
            })
            return
        }
    }
    catch(e) {
        console.error("Error while reporting a post", e)
        res.status(401).json({
            msg: "Error while reporting a post"
        })
        return
    }
})


// view reported posts
reportPostHandler.get("/", async (req: Request, res: Response): Promise<void> => {
    try{
        const posts = await postModel.find()

        const reportedPosts = posts.filter(post =>{
            if(post.reportedBy.length > 0){
                if(post !== null){
                    return {
                        ...post.toObject()
                    }
                }
            }
        })

        const reportedPostsWithCount = reportedPosts.map(post =>{
            if(post.reportedBy.length > 0){
                if(post !== null){
                    return {
                        ...post._doc,
                        reportCount: post.reportedBy.length
                    }
                }
            }
        })

        res.status(200).json({
            reportedPostsWithCount
        })
    }
    catch(e) {
        console.error("Error while fetching reported posts", e)
        res.status(401).json({
            msg: "Error while fetching reported posts"
        })
        return
    }
})

export default reportPostHandler;