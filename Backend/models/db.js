const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    profileImagePath: {type: String, required: false, default: ""},
    department: {type: String, required: true},
    graduationYear: {type: Number, required: true},
    bio: {type: String, maxlength: 200},
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'postsModel'
    }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel'
    }],
    friendRequests: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }],
}, { timestamps: true })

const adminSchema = new Schema({
    name: { type: String, required: true },
    adminId: { type: String, required: true, unique: true }, 
    password: { type: String, required: true },
    role: { type: String, default: 'admin' } 
}, { timestamps: true });

const postsSchema = new Schema({
    postedBy: {type: mongoose.Schema.Types.ObjectId, ref:'userModel'},
    username: {type: String},
    userImagePath: String,
    postsImagePath: String,
    text: {type: String, maxlength: 200},
    likes: [{type: mongoose.Schema.Types.ObjectId, ref:'userModel'}],
    isReported: {type: Boolean},
    reportedBy: [{type: mongoose.Schema.Types.ObjectId, ref:'userModel'}],
    reportedByUsername: [{type: String, unique: true}],
    isReportedByUser: {type: Boolean}
    // comments: [{
    //     content: String,
    //     user: {type: mongoose.Schema.Types.ObjectId, ref:'userModel'},
    //     date: {type: Date, default: Date.now}
    // }]
}, { timestamps: true })

const userModel = mongoose.model('users', userSchema)
const postModel = mongoose.model('posts', postsSchema)
const adminModel = mongoose.model('admins', adminSchema)

module.exports = {
    userModel,
    postModel,
    adminModel
}