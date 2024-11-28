import mongoose, { Document, Model, Schema } from 'mongoose';

// User Interface
interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  profileImagePath?: string;
  department: string;
  graduationYear: number;
  bio?: string;
  posts: mongoose.Types.ObjectId[];
  friends: mongoose.Types.ObjectId[];
  friendRequests: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Admin Interface
interface IAdmin extends Document {
  name: string;
  adminId: string;
  password: string;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Post Interface
interface IPost extends Document {
  postedBy: mongoose.Types.ObjectId;
  username: string;
  userImagePath?: string;
  postsImagePath?: string;
  text: string;
  likes: mongoose.Types.ObjectId[];
  reportedBy: mongoose.Types.ObjectId[];
  comments: {
    content: string;
    user: mongoose.Types.ObjectId;
    date: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// OTP Interface
interface IOTP extends Document {
  email: string;
  otp: string;
  createdAt: Date;
}

// User Schema
const userSchema = new Schema<IUser>({
  name: { 
    type: String, 
    required: [true, 'Name is required'] 
  },
  username: { 
    type: String, 
    required: [true, 'Username is required'], 
    unique: true,
    trim: true,
    lowercase: true
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'] 
  },
  profileImagePath: { 
    type: String, 
    default: '' 
  },
  department: { 
    type: String, 
    required: [true, 'Department is required'] 
  },
  graduationYear: { 
    type: Number, 
    required: [true, 'Graduation year is required'],
    min: [2000, 'Graduation year must be after 2000'],
    max: [2100, 'Graduation year must be before 2100']
  },
  bio: { 
    type: String, 
    maxlength: [200, 'Bio cannot exceed 200 characters'] 
  },
  posts: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Post' 
  }],
  friends: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  friendRequests: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Admin Schema
const adminSchema = new Schema<IAdmin>({
  name: { 
    type: String, 
    required: [true, 'Name is required'] 
  },
  adminId: { 
    type: String, 
    required: [true, 'Admin ID is required'], 
    unique: true 
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'] 
  },
  role: { 
    type: String, 
    default: 'admin' 
  }
}, { 
  timestamps: true 
});

// Post Schema
const postSchema = new Schema<IPost>({
  postedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Post must have an author'] 
  },
  username: { 
    type: String, 
    required: [true, 'Username is required'] 
  },
  userImagePath: String,
  postsImagePath: String,
  text: { 
    type: String, 
    maxlength: [200, 'Post text cannot exceed 200 characters'] 
  },
  likes: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  reportedBy: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  comments: [{
    content: { 
      type: String, 
      required: [true, 'Comment content is required'] 
    },
    user: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: [true, 'Comment must have a user'] 
    },
    date: { 
      type: Date, 
      default: Date.now 
    }
  }]
}, { 
  timestamps: true 
});

// OTP Schema
const otpSchema = new Schema<IOTP>({
  email: { 
    type: String, 
    required: [true, 'Email is required'] 
  },
  otp: { 
    type: String, 
    required: [true, 'OTP is required'] 
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 600 // OTP expires after 10 minutes
  }
});

// Create and export models with type
export const userModel = mongoose.model<IUser, Model<IUser>>('User', userSchema);
export const postModel = mongoose.model<IPost, Model<IPost>>('Post', postSchema);
export const adminModel = mongoose.model<IAdmin, Model<IAdmin>>('Admin', adminSchema);
export const otpModel = mongoose.model<IOTP, Model<IOTP>>('OTP', otpSchema);