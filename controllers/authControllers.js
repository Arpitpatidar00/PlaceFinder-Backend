import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/jwtHelper.js";

// Signup
export const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      profileImage,
      licenseNo,
      licenseImage,
      aadharNo,
      aadharImage,
    } = req.body;
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      profileImage, // Base64 string for profile image
      licenseNo,
      licenseImage, // Base64 string for license image
      aadharNo,
      aadharImage, // Base64 string for Aadhar image
    });

    await newUser.save();

    // Generate token with userId and role
    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({ token, user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Signin
export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token with userId and role
    const token = generateToken(user._id, user.role);

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
