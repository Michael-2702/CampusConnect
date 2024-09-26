const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("../config")

function userMiddleware(req, res, next){
    const token = req.headers.authorization

    if(!token){
        res.status(403).json({
            msg: "token is missing"
        })
    }

    const decoded = jwt.verify(token, JWT_SECRET)

    if(decoded){
        req.userId = decoded.userId
        next()
    }
    else{
        res.status(403).json({
            msg: "You are not signed in"
        })
    }
}
