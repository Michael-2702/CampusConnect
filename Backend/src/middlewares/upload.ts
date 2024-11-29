import multer from 'multer';
import path from 'path';
import express, { Request } from 'express';

const app = express();
app.use(express.urlencoded({ extended: false })); // helps in parsing form data
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from the 'uploads' directory

// Define a type for the file to improve type safety
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

const storage = multer.diskStorage({
  destination: function (req: Request, file: MulterFile, cb: (error: Error | null, destination: string) => void) {
      if (req.route?.path === "/createPost") {
          // Post images should go in 'uploads/userPostsImages'
          cb(null, './uploads/userPostsImages');
      } else {
          // Profile images should go in 'uploads/profileImages'
          cb(null, './uploads/profileImages');
      }
  },
  filename: function (req: Request, file: MulterFile, cb: (error: Error | null, filename: string) => void) {
      cb(null, `${Date.now()}-${file.originalname}`); 
  }
});
  
const upload = multer({ storage: storage });

export { upload };