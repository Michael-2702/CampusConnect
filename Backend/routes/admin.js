const express = require("express")
const adminRouter = express.Router()
const { userModel, postModel, adminModel } = require("../models/db")
const { userMiddleware } = require("../middlewares/auth")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("../config")


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

module.exports = {
    adminRouter
}