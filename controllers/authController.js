import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUserInDB } from "../models/User.js";
import redis from "ioredis";

const redisClient = new redis(process.env.REDIS_URL);

// Register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    await redisClient.del("users:all") // Clear cache when a new user is created
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await findUserByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUserInDB(name, email, hashedPassword, role);

    const userId = newUser._id || newUser.id;
    const token = jwt.sign(
      { id: userId, role: newUser.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const userId = user._id || user.id;

    const token = jwt.sign(
      { id: userId, role: user.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout
export const logoutUser = async (req, res) => {
  try {
    if (res.clearCookie) {
      res.clearCookie("token");
    }

    res.status(200).json({
      message: "Logout successful. Please remove token on client side.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};