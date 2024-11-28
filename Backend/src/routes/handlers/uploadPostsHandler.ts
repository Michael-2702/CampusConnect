import { Request, Response } from "express";
import { postModel, userModel } from "../../models/db";


export const uploadPostsHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { postsImagePath, text } = req.body

        if(!postsImagePath && !text) {
            res.status(401).json({
                msg: "Please upload a text content or a picture or both"
            })
            return;
        }

        const userId = req.userId;

        const user = await userModel.findById(userId);

        if(!user){
            res.status(401).json({
                msg: "User not found"
            })
            return;
        }

        const newPost = await postModel.create({
            postedBy: userId,
            username: user.username,
            userImagePath: user.profileImagePath,
            postsImagePath,
            text,
            likes: [],
            reportedBy: [],
            comments: []
        })

        await userModel.findByIdAndUpdate(userId, { $push: { posts: newPost._id } })

        res.status(200).json({
            msg: "Post uploaded successfully",
            post: newPost
        })
    }
    catch(e) {
        console.error("Error while uploading a post")
        res.status(401).json({
            msg:"Error while uploading a post"
        })
        return;
    }
}