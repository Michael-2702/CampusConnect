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

        res.json({
            msg: "Admin data fetched successfully",
            adminInfo: admin
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
        res.status(500).json({ message: "Error fetching user profile", error: error.message });
    }
})

module.exports = {
    adminRouter
}