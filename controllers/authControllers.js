import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/jwtHelper.js";
import { check, validationResult } from 'express-validator';

// Signup
export const signup = async (req, res) => {
  // Input validation
  await check('name').notEmpty().withMessage('Name is required').run(req);
  await check('email').isEmail().withMessage('Valid email is required').run(req);
  await check('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long').run(req);
  await check('role').isIn(['user', 'driver', 'guide']).withMessage('Role must be user, driver, or guide').run(req);
  
  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

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

  try {
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
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Signin
export const signin = async (req, res) => {
  // Input validation
  await check('email').isEmail().withMessage('Valid email is required').run(req);
  await check('password').notEmpty().withMessage('Password is required').run(req);

  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

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
    console.error("Signin error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



export const updated = async (req, res) => {
  const { name, mobileNumber, bio, newPassword, oldPassword, image } = req.body;

  console.log(req.body); // For debugging

  try {
    // Fetch the user by ID
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the password is being updated
    if (newPassword && oldPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Old password is incorrect' });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    // Update user details if provided
    if (name) user.name = name;
    if (mobileNumber) user.mobileNumber = mobileNumber;
    if (bio) user.bio = bio;

    // Handle image update if provided
    if (image) {
      // You might want to validate the image format and size here
      user.profileImage = image; // Assuming image is base64
    }

    // Save the updated user data
    await user.save();

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

