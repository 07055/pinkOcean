import multer from "multer";
import path from "path";

// For now, this saves files to a folder called "uploads" on your computer
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

export const upload = multer({ storage });