import express from "express";
import cookieParser from "cookie-parser";

// Modules & Controllers
import { register, login, logout } from "./modules/auth.js";
import { verifyToken } from "./middleware/verifyToken.js";
import { startCleanupTask } from "./lib/cleanUp.js";
import { toggleLike, toggleMark, recordShare, recordDownload } from "./modules/socials.js";
import { toggleFollow } from "./modules/follow.js";
import { addComment, toggleBlock, reportSource } from "./modules/interactions.js";
import { logActivity } from "./modules/activity.js";
import { 
  searchSources, 
  saveDesignPoster, 
  createSource, 
  getSources, 
  getSource, 
  updateSource, 
  trashSource, 
  hardDeleteSource 
} from "./modules/source.js";
import { getProfile, updateProfile, updatePassword } from "./modules/user.js";
import { upload } from "./lib/cloudinary.js";
import cors from "cors"; // 1. Import the package



const app = express();


// Enable CORS so your frontend (5173) can talk to your backend (3000)
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "https://pink-ocean-qlq2.vercel.app",
    "https://pink-ocean-ka4z.vercel.app" // Add this one from your screenshot!
  ],
  credentials: true, 
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
// Middleware
app.use(express.json());
app.use(cookieParser());

// --- ROOT & AUTH ---
app.get("/", (_req, res) => res.send("hello pink ocean"));
app.post("/register", register);
app.post("/login", login);
app.post("/logout", logout);

// --- USER & PROFILE ROUTES ---
// Public: View a user's wall
app.get("/users/:username", getProfile); 
// Protected: Edit bio, profile pic, or username
app.put("/users/profile", verifyToken, updateProfile); 
// Protected: Change password (PATCH is best for single-field updates)
app.patch("/users/password", verifyToken, updatePassword); 

// --- SOURCE (CONTENT) ROUTES ---
// Public: Feed and Search
app.get("/sources/search", searchSources);
app.get("/sources", getSources);
app.get("/sources/:id", getSource);

// Protected: Creating & Designing
app.post("/sources", verifyToken, createSource);
app.post("/sources/design", verifyToken, saveDesignPoster);

// Protected: Management (Edit, Trash, Delete)
app.put("/sources/:id", verifyToken, updateSource);
app.patch("/sources/trash/:id", verifyToken, trashSource); 
app.delete("/sources/permanent/:id", verifyToken, hardDeleteSource);

// --- SOCIAL & INTERACTION ROUTES ---
app.post("/social/like", verifyToken, toggleLike);
app.post("/social/mark", verifyToken, toggleMark);
app.post("/social/follow", verifyToken, toggleFollow);
app.post("/comments", verifyToken, addComment);

// Public Tracking (Shared/Downloads)
app.post("/social/share", recordShare); 
app.post("/social/download", recordDownload);

// --- MEDIA & SAFETY ---
app.post("/upload", verifyToken, upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).send("Upload failed");
    res.json({ url: req.file.path });
});

app.post("/safety/block", verifyToken, toggleBlock);
app.post("/safety/report", verifyToken, reportSource);

// --- ACTIVITY (ML TRACKING) ---
app.post("/activity/log", logActivity);

// --- SERVER START ---
const PORT = process.env.PORT || 3000;

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`🌊 Pink Ocean API running on port ${PORT}`);
  startCleanupTask();
});