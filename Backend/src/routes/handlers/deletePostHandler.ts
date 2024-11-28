import { Request, Response } from "express";
import { postModel, userModel } from "../../models/db";

export const deletePostHandler = async (req: Request, res: Response): Promise<void> => {
    try{
        const userId = req.userId
        const postId = req.params.id

        const userPost = await postModel.findById(postId)

        if(!userPost){
            res.status(401).json({
                msg: "Post not found"
            })
            return;
        }   

        if(userId !== userPost.postedBy?.toString()){
            res.status(401).json({
                msg: "You are not authorized to delete this post"
            })
            return
        }

        // write logic to delete posts from local storage

        await postModel.findByIdAndDelete(postId)
        await userModel.findByIdAndUpdate(userId, { $pull: { postId }})

        res.status(200).json({
            msg: "Post deleted successfully"
        })
    }
    catch(e) {
        console.error("Error while deleting post")
    }
}

export const adminDeletePostHandler = async (req: Request, res: Response): Promise<void> => {
    try{
        
        const postId = req.params.id

        const userPost = await postModel.findById(postId)

        if(!userPost){
            res.status(401).json({
                msg: "Post not found"
            })
            return;
        }

        const userId = userPost.postedBy

        // write logic to delete posts from local storage

        await postModel.findByIdAndDelete(postId)
        await userModel.findByIdAndUpdate(userId, { $pull: { postId }})

        res.status(200).json({
            msg: "Post deleted successfully"
        })
    }
    catch(e) {
        console.error("Error while deleting post")
    }
}