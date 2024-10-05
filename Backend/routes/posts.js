const Router = require("express")
const { userModel, postModel } = require("../models/db")
const postRouter = Router()
const { userMiddleware } = require("../middlewares/auth")
const { upload } = require("../middlewares/uploads")

// create a post
postRouter.post("/createPost", userMiddleware, upload.single("picture"), async (req, res) => {
    try {
        const userId = req.userId;
        const { text } = req.body;
        const imagePath = req.file ? `/uploads/userPostsImages/${req.file.filename}` : null;

        const newPost = await postModel.create({
            postedBy: userId,
            postsImagePath: imagePath,
            text,
            likes: [],
            comments: []
        })

        await userModel.findByIdAndUpdate(userId, { $push: { posts: newPost._id } });

        res.json({
            msg: "Post uploaded successfully",
            post: newPost
        })
    }
    catch(e){
        console.log(e)
        res.status(500).json({ msg: "Error uploading post", error: e });
    }
})

// delete a post
postRouter.delete("/deletePost/:postId", userMiddleware, async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.userId;

        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.postedBy.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to delete this post" });
        }

        await postModel.findByIdAndDelete(postId);
        await userModel.findByIdAndUpdate(userId, { $pull: { posts: postId } });
        
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting post", error: error.message });
    }
})

// view posts
postRouter.get("/viewPosts", userMiddleware, async (req, res) => {
    try {
        const posts = await postModel.find() 
            
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts", error: error.message });
    }
})

// view my posts
postRouter.get("/myPosts", userMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const posts = await postModel.find({ postedBy: userId })
            

        res.status(200).json({
            message: "Your posts retrieved successfully",
            posts: posts
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching your posts", error: error.message });
    }
});

// View other user's posts
postRouter.get("/userPosts/:userId", userMiddleware, async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        
        const targetUser = await userModel.findById(targetUserId);
        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const posts = await postModel.find({ postedBy: targetUserId })
            .populate('postedBy', 'username')
            .sort('-createdAt');

        res.status(200).json({
            message: `Posts by ${targetUser.username} retrieved successfully`,
            posts: posts
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user's posts", error: error.message });
    }
});

// Like/Unlike a post
postRouter.put("/like/:postId", userMiddleware, async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.userId;

        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const isLiked = post.likes.includes(userId);
        if (isLiked) {
            post.likes = post.likes.filter(id => id.toString() !== userId); // iss se unlike hota hai
        } else {
            post.likes.push(userId);
        }

        await post.save();
        res.json({ 
            message: isLiked ? "Post unliked" : "Post liked", 
            post 
        });
    } catch (error) {
        res.status(500).json({ message: "Error liking/unliking post", error: error.message });
    }
});

// Comment on a post
// postRouter.put("/comment/:postId", userMiddleware, async (req, res) => {
//     try {
//         const postId = req.params.postId;
//         const userId = req.userId;
//         const { content } = req.body;

//         if (!content) {
//             return res.status(400).json({ message: "Comment content is required" });
//         }

//         const post = await postModel.findById(postId);
//         if (!post) {
//             return res.status(404).json({ message: "Post not found" });
//         }

//         post.comments.push({ content, user: userId });
//         await post.save();

//         res.json({ 
//             message: "Comment added successfully", 
//             post 
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Error adding comment", error: error.message });
//     }
// });

module.exports = {
    postRouter
}
