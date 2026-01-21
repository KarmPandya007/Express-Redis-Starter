import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import { rateLimit } from "express-rate-limit";

import peopleRoutes from "./routes/PeopleRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// --------------------
// Global Middleware
// --------------------

app.use(errorHandler);
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// --------------------
// Rate Limiters
// --------------------

// Auth limiter (strict)
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // 10 requests per IP
  message: "Too many attempts, try again later.",
});

// API limiter (moderate)
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 200, // 200 requests per IP
  message: "Too many requests, slow down.",
});

// --------------------
// Routes
// --------------------
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server running successfully 🚀",
  });
});

// Auth routes → strict limit
app.use("/api/auth", authLimiter, authRoutes);

// Non-auth API routes → moderate limit
app.use("/api/people", apiLimiter, peopleRoutes);

// --------------------
// Start Server
// --------------------
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
