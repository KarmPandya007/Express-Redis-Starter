import {
  getAllUsersFromDB,
  findUserById,
  createUserInDB,
  updateUserInDB,
  deleteUserInDB,
  findUserByEmail,
} from "../models/User.js";
import bcrypt from "bcrypt";
import redis, { invalidateUsersCache } from "../config/redis.js";

export const getUsers = async (req, res) => {
  try {
    const cachedUsers = await redis.get("users:all");
    if (cachedUsers !== null) {
      return res.json(JSON.parse(cachedUsers));
    }

    const users = await getAllUsersFromDB();
    await redis.set("users:all", JSON.stringify(users), "EX", 60);
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create user
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUserInDB(name, email, hashedPassword, role);
    await invalidateUsersCache();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const updatedUser = await updateUserInDB(req.params.id, name, email, role);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    await invalidateUsersCache();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await deleteUserInDB(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    await invalidateUsersCache();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
