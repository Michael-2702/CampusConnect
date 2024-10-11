const Router = require("express")
const { userModel, postModel } = require("../models/db")
const postRouter = Router()
const { userMiddleware } = require("../middlewares/auth")
const { upload } = require("../middlewares/uploads")
const path = require("path");
const fs = require("fs")

// create a post
postRouter.post("/createPost", userMiddleware, upload.single("picture"), async (req, res) => {
    try {
      const userId = req.userId;
      const text = req.body.text || ""; // Default to an empty string if text is not provided
      const imagePath = req.file ? `/uploads/userPostsImages/${req.file.filename}` : null;
  
      // Validate text length
      if (text.length > 200) {
        return res.status(400).json({
          msg: "Text cannot exceed 200 characters",
        });
      }
  
      // Ensure either text or an image is provided
      if (!text && !req.file) {
        return res.status(400).json({
          msg: "Please provide either text or an image for the post"
        });
      }
  
      // Fetch user information
      const user = await userModel.findById(userId);
      const username = user.username;
      const userImagePath = user.profileImagePath;
  
      // Create a new post
      const newPost = await postModel.create({
        postedBy: userId,
        username,
        userImagePath,
        postsImagePath: imagePath, // Image may or may not be present
        text, // Text can be empty
        likes: [],
        reportedBy: [],
        comments: []
      })
  
      // Update user's posts array
      await userModel.findByIdAndUpdate(userId, { $push: { posts: newPost._id } });
  
      // Respond with success message and the new post
      res.json({
        msg: "Post uploaded successfully",
        post: newPost,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ msg: "Error uploading post", error: e });
    }
});
  

// delete a post
postRouter.delete("/deletePost/:postId", userMiddleware, async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.userId;

        // Find the post by ID
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Ensure that the user deleting the post is the one who created it
        if (post.postedBy.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to delete this post" });
        }

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
postRouter.get("/viewPosts", userMiddleware, async (req, res) => {
    const userId = req.userId
    try {
        const posts = await postModel.find().sort({ createdAt: -1 });

        const processedPosts = posts.map(post => {
            const isReported = post.reportedBy.includes(userId); // to check if the logged in user has reported a certain post or not
            
            return {
                ...post._doc,
                // attach these keys just to avoid complexity in db or model, 
                isReported,
                reportButtonText: isReported ? 'Unreport' : 'Report',
                reportCount: post.reportedBy.length
            };
        });

        
        res.status(200).json(processedPosts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts", error: error.message });
    }
})

// view my posts
postRouter.get("/myPosts", userMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const posts = await postModel.find({ postedBy: userId }).sort({ createdAt: -1 });
            

        res.status(200).json(posts);
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


// Report a post
postRouter.put("/reportPost/:postId", userMiddleware, async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.userId;
        
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        if (!post.reportedBy.includes(userId)) {
            post.reportedBy.push(userId);
            await post.save();
        }
        
        const updatedPost = {
            ...post._doc,
            isReported: true,
            reportButtonText: 'Unreport',
            reportCount: post.reportedBy.length
        };
        
        res.json({ message: 'Post reported successfully', post: updatedPost });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Unreport a post
postRouter.put("/unReportPost/:postId", userMiddleware, async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.userId;
        
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        post.reportedBy = post.reportedBy.filter(reporterId => !reporterId.equals(userId));
        await post.save();
        
        const updatedPost = {
            ...post._doc,
            isReported: false,
            reportButtonText: 'Report',
            reportCount: post.reportedBy.length
        };
        
        res.json({ message: 'Post unreported successfully', post: updatedPost });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Comment on a post
postRouter.put("/comment/:postId", userMiddleware, async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.userId;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Comment content is required" });
        }

        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        post.comments.push({ content, user: userId });
        await post.save();

        const user = await userModel.findById(userId)

        const username = user.username
        const profileImagePath = user.profileImagePath

        const processedComment = {
            content,
            username,
            profileImagePath
        }
        
        res.json({ 
            message: "Comment added successfully", 
            // post,
            // username, 
            // profileImagePath
            processedComment
        });
    } catch (error) {
        res.status(500).json({ message: "Error adding comment", error: error.message });
    }
});

// view comments of a specific post
postRouter.get("/getComments/:postId", userMiddleware, async (req, res) => {
    const { postId } = req.params
    const userId = req.userId

    try{
        const post = await postModel.findById(postId)

        const comments = post.comments

        const user = await userModel.findById(userId)

        const username = user.username
        const profileImagePath = user.profileImagePath

        const processedComments = comments.map(comment => {
            return {
                ...comment._doc,
                username,
                profileImagePath
            }
        })

        res.json({
            msg: "Comments fetched Successfully", 
            processedComments, 
        })
    }
    catch(e){
        res.status(500).json({ message: "Error getting comments", error: error.message });
    }
})

// delete your comment from a post
postRouter.delete("/deleteComment/:postId/:commentId", userMiddleware, async (req, res) => {
   
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

        if (comment.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You can only delete your own comments" });
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

// Update your own comment
postRouter.put("/updateComment/:postId/:commentId", userMiddleware, async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const userId = req.userId;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Updated content is required" });
        }

        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if the comment exists and belongs to the user
        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You can only update your own comments" });
        }

        // Update the comment's content
        comment.content = content;
        await post.save();

        const user = await userModel.findById(userId)
        const username = user.username
        const profileImagePath = user.profileImagePath

        const processedComment = {
            content,
            username,
            profileImagePath
        }

        res.json({ message: "Comment updated successfully", updatedComment: processedComment });
    } catch (error) {
        res.status(500).json({ message: "Error updating comment", error: error.message });
    }
});

module.exports = {
    postRouter
}
