const Router = require("express")
const { userModel, postModel } = require("../models/db");
const { userMiddleware } = require("../middlewares/auth");
const postRouter = Router()

// create a post
postRouter.post("/createPost", userMiddleware, async(req, res) => {
    const text = req.body;
    const image = req.body;
    const userId = req.userId;

    try{
        const user = await userModel.findById(userId);
        if(!user){
            return res.status(404).json({ message: "User not found"});
        }
        const newPost = new postModel.create({
            postedBy: userId,
            text,
            image,
            likes:[]
        });

        user.post.push(newPost._id);
        await user.save();

        res.json({
            message: "Post Created Successfully",
            post: newPost
        });
    }
    catch(e){
        console.error(e);
        res.status(500).json({
            message: "Error Creating Post"
        });
    }
});

// delete a post
postRouter.delete("/deletePost",userMiddleware, async(req, res) => {
    const postId = req.body;
    const userId = req.userId;
    try{
        const post = await postModel.findById(postID);
        if(!post){
            return res.status(404).json({
                message: "Post Not Found"
            });
        }
        if (post.postedBy.toString() !== userId) {
            return res.status(403).json({ 
                message: "Unauthorized to delete this post"
            });
        }
        await postModel.findByIdAndDelete(postId);

        await userModel.findByIdAndUpdate(userId, {
            $pull: { posts: postId }
    });
    res.json({ message: "Post deleted successfully" });
    } 
    catch (e) {
        console.error(e);
        res.status(500).json({ 
            message: "Error deleting post" 
        });
    }
});

// view posts
postRouter.get("/viewPost", userMiddleware, async(req, res) => {
    try {
        const posts = await postModel.find().populate("postedBy", "name");
        res.json(posts);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: "Error fetching posts" 
        });
    }
});


// like on a post
postRouter.put("/like", userMiddleware, async (req, res) => {
    const { postId } = req.body;
    const userId = req.userId;

    try {
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ 
                message: "Post not found" 
            });
        }

        if (post.likes.includes(userId)) {
            return res.status(400).json({ 
                message: "Already liked" 
            });
        }

        post.likes.push(userId);
        await post.save();

        res.json({ 
            message: "Post liked", 
            likesCount: post.likes.length 
        });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: "Error liking post" 
        });
    }
});

// comment on a post
// postRouter.put("/comment", (req, res) => {
    
// })

module.exports = {
    postRouter
}