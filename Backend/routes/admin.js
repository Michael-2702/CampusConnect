const express = require("express")
const adminRouter = express.Router()
const { userModel, postModel, adminModel } = require("../models/db")
const { userMiddleware } = require("../middlewares/auth")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("../config")
const path = require("path")
const fs = require("fs")

// createAdmin
adminRouter.post("/createAdmin", async (req, res) => {
    const { name, adminId, password } = req.body

    try{
        const admin = await adminModel.findOne({adminId})

        if(!admin){
            const hashedPassword = await bcrypt.hash(password, 4);

            const newAdmin = await adminModel.create({
                name,
                adminId,
                password: hashedPassword
            })
            
            res.json({
                msg: "Admin created Successfully",
                newAdmin
            })
        }
        else{
            console.log(JWT_SECRET)
            res.status(403).json({
                msg: "adminId already Exists"
            })
        }
        
    }
    catch(e){
        console.log(e)
        res.status(500).json({
            msg: "Error creating admin",
            error: e.message
        })
    }
})

// admin login
adminRouter.post("/login", async (req, res) => {
    const { adminId, password } = req.body

    try{
        const admin = await adminModel.findOne({adminId})

        if(!admin){
            res.status(403).json({
                msg: "admin doesnt exist"
            })
        }
        const comparePassword = await bcrypt.compare(password, admin.password)

        if(!comparePassword){
            res.status(403).json({
                msg: "Incorrect Passowrd"
            })
        }

        const token = jwt.sign({
            userId: admin._id
        }, JWT_SECRET)

        res.json({
            msg: "Signed-in Successfullly",
            token
        })

    }
    catch(e){
        console.log(e)
        res.status(500).json({
            msg: "Error logging in admin",
            error: e.message
        })
    }
})

// view admin info
adminRouter.get("/viewAdminInfo", userMiddleware, async (req, res) => {
    const uniqueId = req.userId
    try{
        const admin = await adminModel.findById(uniqueId)

        if(!admin){
            res.status(403).json({
                msg: "admin not found"
            })
        }

        const users = await userModel.find({})
        const userCount = users.length

        const newInfo = {
            ...admin._doc,
            userCount
        }

        res.json({
            msg: "Admin data fetched successfully",
            adminInfo: newInfo
        })
    }
    catch(e){
        console.log(e)
    }
})

// delete a post
adminRouter.delete("/deletePost/:postId", userMiddleware, async (req, res) => {
    try {
        const postId = req.params.postId;
        const uniqueId = req.userId;
        

        // Find the post by ID
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const userId = post.postedBy

        console.log(userId)

        // If post has an image, attempt to delete it
        if (post.postsImagePath) {
            const imagePath = path.join(__dirname, "..", post.postsImagePath);

            // Check if the file exists and then delete it
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); // Delete the post image file
            }
        }

        // Delete the post from the database
        await postModel.findByIdAndDelete(postId);
        await userModel.findByIdAndUpdate(userId, { $pull: { posts: postId } });

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting post", error: error.message });
    }
})

// view posts
adminRouter.get("/viewPosts", userMiddleware, async (req, res) => {
    try {
        const posts = await postModel.find() 
            
        res.status(200).json(posts);
    } catch (error) {
        console.log(e)
        res.status(500).json({ message: "Error fetching posts", error: error.message });
    }
})

// view reported posts
adminRouter.get("/viewReportedPosts", userMiddleware, async (req, res) => {
    try {
        const posts = await postModel.find() 
        
        const reportedPosts = posts.filter(post =>{
            if(post.reportedBy.length > 0){
                if(post !== null){
                    return {
                        ...post._doc,
                        // reportedCount: post.reportedBy.length
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
        res.status(200).json(reportedPostsWithCount);
    } catch (error) {
        console.log(e)
        res.status(500).json({ message: "Error fetching posts", error: error.message });
    }
})

// view other user's profile
adminRouter.get("/viewUserProfile/:userId", userMiddleware, async (req, res) => {
    try{
        const { userId } = req.params

        const user = await userModel.findById(userId)

        res.json({
            msg: "userInfo fetched successfully",
            user
        })
    }
    catch(e){
        console.log(e)
        res.status(500).json({ message: "Error fetching user profile", error: e.message });
    }
})

// view user list
adminRouter.get("/viewAllUsers", userMiddleware, async (req, res) => {
    try{
        const users = await userModel.find({})

        res.json(
            users
        )
    }
    catch(e){
        console.log(e)
        res.status(500).json({ message: "Error fetching user list", error: e.message });
    }
})

// view comments of a specific post
adminRouter.get("/getComments/:postId", userMiddleware, async (req, res) => {
    const { postId } = req.params
    const userId = req.userId

    try {
        const post = await postModel.findById(postId)
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comments = post.comments

        comments.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Fetch user information for each comment
        const processedComments = await Promise.all(comments.map(async (comment) => {
            const commentUser = await userModel.findById(comment.user)
            return {
                ...comment._doc,
                user: {
                    _id: commentUser._id,
                    username: commentUser.username,
                    profileImagePath: commentUser.profileImagePath || ""
                }
            }
        }))

        res.json({
            msg: "Comments fetched Successfully", 
            comments: processedComments, 
        })
    }
    catch(error) {
        console.error("Error getting comments:", error);
        res.status(500).json({ message: "Error getting comments", error: error.message });
    }
})

// delete your comment from a post
adminRouter.delete("/deleteComment/:postId/:commentId", userMiddleware, async (req, res) => {
   
    try{
        const { postId, commentId } = req.params;
        const userId = req.userId;

        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        

        await post.updateOne({
            $pull: { comments: { _id: commentId } }
        });

        res.json({ message: "Comment deleted successfully" });
    }
    catch(e){
        res.status(500).json({ message: "Error deleting comment", e: e.message });
    }
})

module.exports = {
    adminRouter
}