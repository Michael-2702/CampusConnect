const Router = require("express")
const userRouter = Router()
const { userModel, postModel } = require("../models/db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("../config")
const { userMiddleware } = require("../middlewares/auth")
const { z } = require("zod")
const { upload } = require("../middlewares/uploads")
const fs = require("fs")
const path = require("path")

// signup
userRouter.post("/signup", async (req, res) => {
    const mySchema = z.object({
        name: z.string(),
        username: z.string(),
        email: z.string().email().refine((val) => val.endsWith('@pvppcoe.ac.in'), {
            message: "Only Emails ending with @pvppcoe.ac.in can login"
        }),
        password: z.string()
                .min(8, "Password Should be of atleast 8 characters")
                .max(100, "Password Should not exceed 100 characters")
                .regex(/[a-z]/, "Password must contain atleast 1 lowercase letter")
                .regex(/[A-Z]/, "Password must contain atleast 1 uppercase letter")
                .regex(/[0-9]/, "Password must contain atleast 1 number")
                .regex(/[^A-Za-z0-9]/, "Password must contain atleast 1 special character"),
        // imagePath: z.string(), 
        department: z.string(),
        graduationYear: z.number()
    }).strict({
       messageg: "Extra Fields not allowed"
    })

    const response = mySchema.safeParse(req.body)

    if(!response.success){
        return res.status(403).json({
            msg: "Incorrect Format",
            error: response.error.errors
        })
    }

    const { name, username, email, password, department, graduationYear} = req.body

    if (!email.endsWith('@pvppcoe.ac.in')) {
        return res.status(403).json({
           msg: "Only Emails ending with @pvppcoe.ac.in can Register"
        });
    }
    

    try{    
        const existingUserEmail = await userModel.findOne({
            email: email
        })

        if(existingUserEmail){
            return res.status(403).json({
                msg: "Email Already Exists"
            })
        }

        const existingUserName = await userModel.findOne({
            username
        })
        
        
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
            profileImagePath: "",
            department,
            graduationYear,
            bio: "",
            posts: [],
            friends: [],
            friendRequests: []
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
    const mySchema = z.object({
        email: z.string().email().refine((val) => val.endsWith('@pvppcoe.ac.in'), {
            message: "Only Emails ending with @pvppcoe.ac.in can login"
        }),
        password: z.string()
                .min(8, "Password Should be of atleast 8 characters")
                .max(100, "Password Should not exceed 100 characters")
                .regex(/[a-z]/, "Password must contain atleast 1 lowercase letter")
                .regex(/[A-Z]/, "Password must contain atleast 1 uppercase letter")
                .regex(/[0-9]/, "Password must contain atleast 1 number")
                .regex(/[^A-Za-z0-9]/, "Password must contain atleast 1 special character")
    }).strict({
       message: "Extra Fields not allowed"
    })

    const response = mySchema.safeParse(req.body)
    
    if(!response.success){
        return res.status(403).json({
            msg: "Incorrect Format",
            error: response.error.errors
        })
    }
    const {email, password} = req.body

    if (!email.endsWith('@pvppcoe.ac.in')) {
        return res.status(403).json({
            msg: "Only Emails ending with @pvppcoe.ac.in can login"
        });
    }

    try{
        const user = await userModel.findOne({ email })

        if(!user){
            return res.status(404).json({
                msg: "Incorrect Email or User Doesn't Exist"
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

// view friends
userRouter.get("/friends", userMiddleware, async (req, res) => {
    const userId = req.userId

    try{
        const findUser = await userModel.findOne({
            _id: userId
        })

        if (!findUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const friends = findUser.friends

        const findFriends = await userModel.find({
            _id: friends
        })
        

        const friendsNames = findFriends.map( user =>  user.name)

        if(findUser){
            res.json({
                friendsCount: findUser.friends.length,
                friends: findUser.friends,
                friendsNames
            })
        }
    }
    catch(e){
        console.log(e);
    }
})

// send a friend request
userRouter.post("/sendFriendRequest", userMiddleware, async (req, res) => {
    const userId = req.userId;
    const friendId = req.body.id;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        const friend = await userModel.findById(friendId);
        if ( !friend) {
          return res.status(404).json({ message: 'friend not found' });
        }
  
      if (user.friends.includes(friendId)) {
        return res.status(400).json({ message: 'Already friends' });
      }
  
      if (friend.friendRequests.includes(userId)) {
        return res.status(400).json({ message: 'Friend request already sent' });
      }
  
      friend.friendRequests.push(userId);
      await friend.save();
  
      res.json({ message: 'Friend request sent successfully' });
    } catch (e) {
      console.error(e);
      
    }
});

// view friend Requests
userRouter.get("/friendRequests", userMiddleware, async (req, res) => {
    const userId = req.userId

    try{
        const findUser = await userModel.findOne({
            _id: userId
        })

        if (!findUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const friendReq = findUser.friendRequests

        const findFriends = await userModel.find({
            _id: friendReq
        })
        // console.log(friendReq)
        // console.log(findFriends);
        // console.log(findFriends.map( user =>  user.name ))

        const friendsNames = findFriends.map( user =>  user.name)
        if(findUser){
            res.json({
                
                friendRequestsCount: findUser.friendRequests.length,
                friendRequests: findUser.friendRequests,
                friendRequestsNames: friendsNames
                
            })
        }
    }
    catch(e){
        console.log(e);
    }
})
  
// accept a friend request
userRouter.post("/acceptFriendRequest", userMiddleware, async (req, res) => {
    const userId = req.userId;
    const friendId = req.body.id;
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const friend = await userModel.findById(friendId);
      if ( !friend) {
        return res.status(404).json({ message: 'friend not found' });
      }
  
      if (!user.friendRequests.includes(friendId)) {
        return res.status(400).json({ message: 'No friend request from this user' });
      }
  
      user.friendRequests = user.friendRequests.filter(id => id.toString() !== friendId);
  
      user.friends.push(friendId);
      friend.friends.push(userId);
  
      await user.save();
      await friend.save();
  
      res.json({ message: 'Friend request accepted', friends: user.friends });
    } catch (e) {
      console.error(e);
      
    }
});
  
// reject a friend request
userRouter.post("/rejectFriendRequest", userMiddleware, async (req, res) => {
    const userId = req.userId;
    const friendId = req.body.id;
    try {
      const user = await userModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (!user.friendRequests.includes(friendId)) {
        return res.status(400).json({ message: 'No friend request from this user' });
      }
  
      user.friendRequests = user.friendRequests.filter(id => id.toString() !== friendId);
      await user.save();
  
      res.json({ message: 'Friend request rejected' });
    } catch (e) {
      console.error(e);
    }
});

// delete a friend
userRouter.delete("/deleteFriend", userMiddleware, async (req, res) => {
    const userId = req.userId;
    const friendId = req.body.id;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        const friend = await userModel.findById(friendId);
        if ( !friend) {
          return res.status(404).json({ message: 'friend not found' });
        }
  
      if (user.friends.includes(friendId)) {
        // return res.status(400).json({ message: 'Already friends' });
        user.friends = user.friends.filter(id => id.toString() !== friendId);
        await user.save();
      }

      if (friend.friends.includes(userId)) {
        // return res.status(400).json({ message: 'Already friends' });
        friend.friends = friend.friends.filter(id => id.toString() !== userId);
        await friend.save();
      }

      res.json({ message: 'Friend delete successfully' });
    } catch (e) {
      console.error(e);
      
    }
});

// set user bio
// userRouter.post("/setBio", userMiddleware, async (req, res) => {
//     const { bio } = req.body
//     const userId = req.userId

//     if (!bio || typeof bio !== 'string') {
//         return res.status(400).json({ msg: "Bio must be a non-empty string" });
//     }

//     if (bio.length > 200) {  
//         return res.status(400).json({
//             msg: "Bio cannot exceed 200 characters"
//         });
//     }

//     try{
//         const findUser = await userModel.findById(userId);

//         if (!findUser) {
//             return res.status(404).json({ msg: 'User not found' });
//         }

//         if (findUser.bio && findUser.bio !== "") {
//             return res.status(400).json({ msg: "Bio is already set. Use the update endpoint to modify it." });
//         }

//         findUser.bio = bio; 
//         await findUser.save();

//         res.status(201).json({
//             msg: "Bio set successfully",
//             bio
//         });
//     }
//     catch(e){
//         console.log(e);
//     }
// })

// update bio
userRouter.put("/updateBio", userMiddleware, async (req, res) => {
    const { bio } = req.body;
    const userId = req.userId;

    if (!bio || typeof bio !== 'string') {
        return res.status(400).json({ msg: "Bio must be a non-empty string" });
    }

    if (bio.length > 200) {  
        return res.status(400).json({
            msg: "Bio cannot exceed 200 characters"
        });
    }

    try {
        const findUser = await userModel.findById(userId);

        if (!findUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // if (!findUser.bio || findUser.bio === "") {
        //     return res.status(400).json({ msg: "Bio is not set. Use the set bio endpoint first." });
        // }

        findUser.bio = bio;
        await findUser.save();

        res.json({
            msg: "Bio updated successfully",
            bio
        });
        
    } catch (e) {
        console.log(e);
        res.status(500).json({
            msg: "An error occurred while updating the bio"
        });
    }
});

userRouter.delete("/deleteBio", userMiddleware, async (req, res) => {
    const userId = req.userId;

    try {
        const findUser = await userModel.findById(userId);

        if (!findUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!findUser.bio || findUser.bio === "") {
            return res.status(400).json({ msg: "Bio is already empty" });
        }

        findUser.bio = "";
        await findUser.save();

        res.json({
            msg: "Bio deleted successfully",
            bio: findUser.bio
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            msg: "An error occurred while updating the bio"
        });
    }
});

// set/upload profile picture
userRouter.post("/uploadProfilePicture", userMiddleware,  upload.single("picture"), async (req, res) => {
    try {
        const userId = req.userId;
        const { text } = req.body;
        const profileImagePath = req.file ? `/uploads/profileImages/${req.file.filename}` : null;

        const user = await userModel.findById(userId)
        
        if(user.profileImagePath === "" || user.profileImagePath === null){
            user.profileImagePath = profileImagePath

            await user.save()

            res.json({
                msg: "Profile Picture uploaded successfully",
                user
            })
        }
        else{
            return res.json({
                msg: "Profile picture is already uploaded, use updateProfilePicture endpoint to update it"
            })
        }
    }
    catch(e){
        console.log(e)
        res.status(500).json({ msg: "Error uploading profile picture", error: e });
    }
})

// update profile picture
userRouter.put("/updateProfilePicture", userMiddleware, upload.single("picture"), async (req, res) => {
    try {
        const userId = req.userId;
        const { text } = req.body;
        const profileImagePath = req.file ? `/uploads/profileImages/${req.file.filename}` : null;

        const user = await userModel.findById(userId)

         // Check if the user exists
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // If the user already has a profile picture, delete the old image file
        if (user.profileImagePath && user.profileImagePath !== "") {
            const oldImagePath = path.join(__dirname, "..", user.profileImagePath); // Construct the old image path
            if (fs.existsSync(oldImagePath)) {
                console.log("deleted previous file")
                fs.unlinkSync(oldImagePath); // Delete the old image file
            }
        }

        // Update the user's profile picture with the new one
        user.profileImagePath = profileImagePath;

        // Save the updated user data
        await user.save();

        await postModel.updateMany(
            { postedBy: userId },
            { $set: { userImagePath: profileImagePath } }
        );

        res.json({
            msg: "Profile Picture updated successfully",
            user
        });
    }
    catch(e){
        console.log(e)
        res.status(500).json({ msg: "Error updating profile picture", error: e });
    }
})

// delete profile picture
userRouter.delete("/deleteProfilePicture", userMiddleware, async (req, res) => {
    try {
        const userId = req.userId;

        // Find the user by ID
        const user = await userModel.findById(userId);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Check if the user has an existing profile picture
        if (!user.profileImagePath || user.profileImagePath === "") {
            return res.status(400).json({ msg: "No profile picture to delete" });
        }

        // Construct the full file path of the current profile picture
        const imagePath = path.join(__dirname, "..", user.profileImagePath);

        // Check if the file exists and delete it
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath); // Delete the profile picture file
        }

        // Remove the profile picture path from the user's profile
        user.profileImagePath = "";

        // Save the updated user profile
        await user.save();

        res.json({
            msg: "Profile picture deleted successfully",
            user
        });
    }
    catch(e){
        console.log(e)
        res.status(500).json({ msg: "Error deleting profile picture", error: e });
    }
})

// view own Profile picture
userRouter.get("/viewOwnProfilePicture", userMiddleware, async (req, res) => {
    const userId = req.userId

    try{
        const user = await userModel.findById(userId)

        const profilePic = user.profileImagePath

        res.json({
            msg: "viewing profile Picture",
            profilePic
        })
    }
    catch(e){
        console.log(e)
        res.status(500).json({
            msg: "error in viewing own profile"
        })
    }
})

// view other's profile picture
userRouter.get("/viewOthersProfilePicture/:userId", userMiddleware, async (req, res) => {
    try{
        const { userId } = req.params

        const user = await userModel.findById(userId)

        const pfp = user.profileImagePath

        res.json({
            msg: "Other user's pfp fetched successfully",
            pfp
        })
    }
    catch(e){
        console.log(e)
        res.status(500).json({ message: "Error fetching user profile", error: error.message });
    }
})

module.exports = {
    userRouter
}