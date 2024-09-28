
// import express from "express";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import bodyParser from "body-parser";

// import authRoutes from "./routes/auth.js";
// import reviewRoutes from "./routes/Rating.js";
// import Search from "./routes/SearchImage.js";
// import commentsRouter from "./routes/CommentRoute.js";
// import UserExprence from "./routes/UserExprence.js";
// import Guide from "./routes/Guideresponse.js";
// import Driver from "./routes/DriverRoute.js";
// import Feedback from './routes/Feedback.js'
// import Video from "./controllers/VideosController.js";
// import adminRoutes from "./routes/AdminRoute.js"
// import path from 'path';
// import { fileURLToPath } from 'url';

// dotenv.config();
// const app = express();
// const PORT = process.env.PORT || 8000;

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URL)
//   .then(() => {
//     console.log('MongoDB database connected');
//   })
//   .catch((error) => {
//     console.error('MongoDB connection failed:', error);
//   });


// // // Middleware
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// app.use(cors());


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());

// // Routes
// app.use("/auth", authRoutes);
// app.use("/api", reviewRoutes);
// app.use("/add", Search);
// app.use("/comments", commentsRouter);
// app.use("/upload", UserExprence);
// app.use("/guide", Guide);
// app.use("/driver", Driver);
// app.use("/Feedback", Feedback);
// app.use("/video", Video);
// app.use("/api/admin", adminRoutes);


// // Start the server
// app.listen(PORT, () => {
//   console.log("Server listening on PORT ", PORT);
// });
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import compression from "compression"; // New import for compression
import rateLimit from "express-rate-limit"; // New import for rate limiting
import cluster from "cluster"; // New import for clustering
import os from "os"; // New import for getting CPU cores

import authRoutes from "./routes/auth.js";
import reviewRoutes from "./routes/Rating.js";
import Search from "./routes/SearchImage.js";
import commentsRouter from "./routes/CommentRoute.js";
import UserExprence from "./routes/UserExprence.js";
import Guide from "./routes/Guideresponse.js";
import Driver from "./routes/DriverRoute.js";
import Feedback from './routes/Feedback.js';
import Video from "./controllers/VideosController.js";
import adminRoutes from "./routes/AdminRoute.js";
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Set up clustering
if (cluster.isMaster) {
  const numCPUs = os.cpus().length; // Get the number of CPU cores
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork(); // Fork a new worker for each core
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  const app = express();
  const PORT = process.env.PORT || 8000;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Connect to MongoDB with pooling options
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Other options can be added here as needed
  })
    .then(() => {
      console.log('MongoDB database connected');
    })
    .catch((error) => {
      console.error('MongoDB connection failed:', error);
    });

  // Middleware
  app.use(compression()); // Enable compression
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Rate limiting middleware
  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100 // Limit each IP to 100 requests per windowMs
  });
  app.use(limiter); // Apply rate limiting

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

  // Centralized error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT} - Worker ${process.pid}`);
  });
}
