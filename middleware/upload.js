import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Define the folder for file uploads
const uploadFolder = 'uploads/';

// Ensure the folder exists
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// Set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// Multer middleware
const upload = multer({ storage });

export default upload;
