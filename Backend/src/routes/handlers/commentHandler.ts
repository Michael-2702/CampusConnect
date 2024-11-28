import { Router, Request, Response } from "express";
import { postModel, userModel } from "../../models/db";
import { mongo } from "mongoose";

const commentHandler: Router = Router();

// upload a comment
commentHandler.put("/:id", async (req: Request, res: Response): Promise<void> => {
    try{
        const { content } = req.body
        const postId = req.params.id
        const userId = req.userId

        const post = await postModel.findById(postId)
        if(!post){
            res.status(401).json({
                msg: "post not found"
            })
            return
        }
        const userIdObject = new mongo.ObjectId(userId?.toString())
      
        post.comments.push({
            content,
            user: userIdObject,
            date: new Date()
        })

        await post.save()

        const user = await userModel.findById(userId)
        if(!user){
            res.status(401).json({
                msg: "User not found"
            })
            return
        }

        res.status(200).json({
            content,
            username: user.username,
            profileImagePath: user.profileImagePath
        })
    }
    catch (e) {
        console.error("Error while uploading a comment", e)
        res.status(401).json({
            msg: "Error while uploading a comment"
        })
        return
    }
})

// get comments of a post
commentHandler.get("/:id", async (req: Request, res: Response): Promise<void> => {
    try{
        const postId = req.params.id
        
        const post = await postModel.findById(postId)
        if(!post){
            res.status(401).json({
                msg: "Post not found"
            })
            return;
        }

        const comments = post.comments

        comments.sort((a, b): number => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        const proccessedComments = await Promise.all(comments.map( async (comment) => {
            const commentUser = await userModel.findById(comment.user)

            if(!commentUser){
                res.status(401).json({
                    msg: "User not found"
                })
                return;
            }
            return {
                content: comment.content,
                date: comment.date,
                user: {
                    id: commentUser._id,
                    username: commentUser.username,
                    profileImagePath: commentUser.profileImagePath
                }
            }
        }))

        res.status(200).json({
            comments: proccessedComments
        })
    }
    catch (e) {
        console.error("Error while uploading a comment", e)
        res.status(401).json({
            msg: "Error while uploading a comment"
        })
        return
    }
})

// update my own comment
commentHandler.put("/:id/:commentId", async (req: Request, res: Response): Promise<void> => {
    try{

    }
    catch (e) {
        console.error("Error while uploading a comment", e)
        res.status(401).json({
            msg: "Error while uploading a comment"
        })
        return
    }
})

// delete my own comment
commentHandler.delete("/:id/:commentId", async (req: Request, res: Response): Promise<void> => {
    try{

    }
    catch (e) {
        console.error("Error while uploading a comment", e)
        res.status(401).json({
            msg: "Error while uploading a comment"
        })
        return
    }
})

// admin - delete comment
commentHandler.delete("/:id/:commentId", async (req: Request, res: Response): Promise<void> => {
    try{

    }
    catch (e) {
        console.error("Error while uploading a comment", e)
        res.status(401).json({
            msg: "Error while uploading a comment"
        })
        return
    }
})

export default commentHandler;