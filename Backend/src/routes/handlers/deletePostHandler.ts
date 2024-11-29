import { Request, Response } from "express";
import { postModel, userModel } from "../../models/db";
import path from "path";
import fs from 'fs';

export const deletePostHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const postId = req.params.postId; // Changed from req.params.id to match JS route
        const userId = req.userId;

        // Find the post by ID
        const userPost = await postModel.findById(postId);
        
        if (!userPost) {
            res.status(404).json({
                msg: "Post not found"
            });
            return;
        }   

        // Ensure that the user deleting the post is the one who created it
        if (userId !== userPost.postedBy.toString()) {
            res.status(403).json({
                msg: "You are not authorized to delete this post"
            });
            return;
        }

        // If post has an image, attempt to delete it
        if (userPost.postsImagePath) {
            const imagePath = path.join(__dirname, "..", userPost.postsImagePath);

            // Check if the file exists and then delete it
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); // Delete the post image file
            }
        }

        // Delete the post from the database
        await postModel.findByIdAndDelete(postId);
        
        // Remove the post from user's posts array
        await userModel.findByIdAndUpdate(userId, { $pull: { posts: postId } });

        res.status(200).json({
            msg: "Post deleted successfully"
        });
    } catch (error) {
        console.error("Error while deleting post:", error);
        res.status(500).json({
            msg: "Error while deleting post",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const adminDeletePostHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const postId = req.params.postId; // Changed from req.params.id to match JS route

        const userPost = await postModel.findById(postId);

        if (!userPost) {
            res.status(404).json({
                msg: "Post not found"
            });
            return;
        }

        const userId = userPost.postedBy;

        // If post has an image, attempt to delete it
        if (userPost.postsImagePath) {
            const imagePath = path.join(__dirname, "..", userPost.postsImagePath);

            // Check if the file exists and then delete it
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); // Delete the post image file
            }
        }

        // Delete the post from the database
        await postModel.findByIdAndDelete(postId);
        
        // Remove the post from user's posts array
        await userModel.findByIdAndUpdate(userId, { $pull: { posts: postId } });

        res.status(200).json({
            msg: "Post deleted successfully"
        });
    } catch (error) {
        console.error("Error while deleting post:", error);
        res.status(500).json({
            msg: "Error while deleting post",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};