import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import redis from "./config/redis.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Express-Redis-BullMQ Tutorial" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Start server after connecting to database
const startServer = async () => {
  await connectDB();
  await redis.ping();
  console.log("✅ Connected to Redis");
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("❌ Server startup error:", error.message);
  process.exit(1);
});
