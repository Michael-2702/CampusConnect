const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    imagePath: {type: String, required: false},
    department: {type: String, required: true},
    graduationYear: {type: Number, required: true},
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'postsModel'
    }]
}, { timestamps: true })

const postsSchema = new Schema({
    postedBy: {type: mongoose.Schema.Types.ObjectId, ref:'userModel'},
    text: String,
    image: String,
    likes: [{type: mongoose.Schema.Types.ObjectId, ref:'userModel'}],
    comments: [{
        content: String,
        user: {type: mongoose.Schema.Types.ObjectId, ref:'userModel'},
        date: {type: Date, default: Date.now}
    }]
}, { timestamps: true })

const userModel = mongoose.model('users', userSchema)
const postModel = mongoose.model('posts', postsSchema)

module.exports = {
    userModel,
    postModel
}