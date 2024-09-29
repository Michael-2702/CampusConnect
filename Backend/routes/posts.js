const Router = require("express")
const { userModel, postModel } = require("../models/db")
const postRouter = Router()

// create a post
postRouter.post("/createPost", (req, res) => {
    
})

// delete a post
postRouter.delete("/deletePost", (req, res) => {
    
})

// view posts
postRouter.get("/deletePost", (req, res) => {
    
})

// like on a post
postRouter.put("/like", (req, res) => {
    
})

// comment on a post
postRouter.put("/comment", (req, res) => {
    
})

module.exports = {
    postRouter
}