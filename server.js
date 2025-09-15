import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import limiter from "./middleware/rateLimiter.js";
import { centralizedError } from "./middleware/centralizedError.js";
import { connectMongo } from "./config/mongo.js";
import apiRoutes from "./api/router/router.js";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Trust first proxy if behind a proxy
app.set("trust proxy", 1);

// Security middleware
app.use(helmet());

// CORS configuration
const corsOption = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "https://front-end-final-project-cyan.vercel.app",
    
  ],
  credentials: true, // ✅ allow cookies to be sent
};
app.use(cors(corsOption));

// Apply rate limiting middleware to all requests
app.use(limiter);

// Middleware to parse JSON bodies and cookies
app.use(express.json());
app.use(cookieParser());

// API routes
app.use("/api", apiRoutes);

// catch-all route for undefined routes
app.use((req, res, next) => {
  const error = new Error("Not found...");
  error.status = 404;
  next(error);
});

// centralized error handling middleware
app.use(centralizedError);

const PORT = process.env.PORT || 3000;
// Connect to MongoDB and start the server
(async () => {
  try {
    await connectMongo();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} ✅`);
    });
  } catch (err) {
    console.error("‼️ Startup error:", err);
    process.exit(1);
  }
})();

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("💥 Unhandled Rejection:", err.message);
  process.exit(1);
});
