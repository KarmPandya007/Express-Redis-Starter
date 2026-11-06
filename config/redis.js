import dotenv from "dotenv";
import Redis from "ioredis";

dotenv.config();

const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

redis.on("error", (error) => {
  console.error("❌ Redis connection error:", error.message);
});

export const invalidateUsersCache = async () => {
  await redis.del("users:all");
};

export default redis;
