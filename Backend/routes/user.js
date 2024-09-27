const Router = require("express")
const userRouter = Router()
const { userModel, postModel } = require("../models/db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("../config")
const { userMiddleware } = require("../middlewares/auth")

// signup
userRouter.post("/signup", async (req, res) => {
    const { name, username, email, password, imagePath, department, graduationYear} = req.body

    try{    
        const existingUserEmail = await userModel.findOne({
            email: email
        })

        const existingUserName = await userModel.findOne({
            username
        })
        
        if(existingUserEmail){
            return res.status(403).json({
                msg: "Email Already Exists"
            })
        }
        if(existingUserName){
            return res.status(403).json({
                msg: "Username Already Exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 3)
        await userModel.create({
            name,
            username,
            email, 
            password: hashedPassword, 
            imagePath,
            department,
            graduationYear,
            posts: []
        })

        res.json({
            msg: "Signed up Successfully"
        })
    }
    catch(e){
        console.log(e);
        res.json({
            msg: "there's an error"
        })
    }
})

// signin
userRouter.post("/signin", async (req, res) => {
    const {email, password} = req.body

    try{
        const user = await userModel.findOne({ email })

        if(!user){
            return res.status(404).json({
                msg: "Incorrect Email or User Doesn't Exist, Please signup first"
            })
        }
        
        const checkPassword = await bcrypt.compare(password, user.password)
        if(checkPassword){
            const token = jwt.sign({
                userId: user._id
            }, JWT_SECRET)
            
            res.json({
                msg: "signed in successfully",
                token
            })
        }
        else{
            res.json({
                msg: "Incorrect Password"
            })
        }
    }
    catch(e){
        console.log(e);
        res.json({
            msg: "there's an error"
        })
    }
})

// view own profile
userRouter.get("/viewProfile", userMiddleware, async (req, res) => {
    const userId = req.userId
    try{
        const findUser = await userModel.findOne({
            _id: userId
        })
        if(findUser){
            res.json({
                userInfo: findUser
            })
        }
        else{
            res.status(403).json({
                msg: "something went wrong"
            })
        }
    }
    catch(e){
        console.log(e);
        
    }
   
})

// view other people's profile
userRouter.get("/viewOtherProfile/:id", userMiddleware, async (req, res) => {
    const { id } = req.params
    const userId = req.userId
    try{
        const user = await userModel.findById(id)

        
        if(user){
            if(userId == user._id){ 
                return res.json({
                    msg: "this is your own profile",
                    userInfo: user
                })
            }
    
            res.json({
                userInfo: user
            })
        }
        else{
            res.status(404).json({
                msg: "user doesn't exist"
            })
        }
    }
    catch(e){
        console.log(e)
    }
})


module.exports = {
    userRouter
}