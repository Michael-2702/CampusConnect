import { Request, Response } from "express"
import { postModel, userModel } from "../../models/db"

export const getCommentHandler = async (req: Request, res: Response): Promise<void> => {
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
}