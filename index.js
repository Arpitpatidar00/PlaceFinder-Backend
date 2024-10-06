import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import authRoutes from "./routes/auth.js";
import reviewRoutes from "./routes/Rating.js";
import Search from "./routes/SearchImage.js";
import commentsRouter from "./routes/CommentRoute.js";
import UserExprence from "./routes/UserExprence.js";
import Guide from "./routes/Guideresponse.js";
import Driver from "./routes/DriverRoute.js";
import Feedback from "./routes/Feedback.js";
import Video from "./controllers/VideosController.js";
import adminRoutes from "./routes/AdminRoute.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB database connected");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });

// // Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);
app.use("/api", reviewRoutes);
app.use("/add", Search);
app.use("/comments", commentsRouter);
app.use("/upload", UserExprence);
app.use("/guide", Guide);
app.use("/driver", Driver);
app.use("/Feedback", Feedback);
app.use("/video", Video);
app.use("/api/admin", adminRoutes);

// Start the server
app.listen(PORT, () => {
  console.log("Server listening on PORT ", PORT);
});
