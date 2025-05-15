import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Register
export const register = async (req, res, next) => {
  const { username, password, profilePicture, bio } = req.body;

  if (!username || !password) {
    return next("Username and password are required");
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return next("Username already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      profilePicture,
      bio,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    console.error(err);
    next("Registration failed");
  }
};

// Login
export const login = async (req, res, next) => {
  
  const { username, password } = req.body;

  if (!username || !password) return next("All fields are required");

  try {
    const user = await User.findOne({ username }).select("+password");
    if (!user) return next("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next("Invalid credentials");

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
      token,
    });
  } catch (err) {
    console.error(err);
    next("Login failed");
  }
};
