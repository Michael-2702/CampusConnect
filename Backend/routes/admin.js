const { Router } = require("express")
const adminRouter = Router()
const { userModel, postModel } = require("../models/db")
const { userMiddleware } = require("../middlewares/auth")