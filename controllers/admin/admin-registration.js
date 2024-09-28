import Admin from "../../models/Adminschema.js";

import bcrypt from "bcryptjs"; // Use this if you installed bcryptjs


import jwt from 'jsonwebtoken';

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find admin by email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    // Construct the userData object to send back to the client
    const user = {
      role: admin.role,
      name: admin.name, // Changed from username to name
      profileImage: admin.profileImage,
    };

    // Send the token and other info back to the client
    res.status(200).json({
      token,
      user, // Sending the userData object in the response
      message: "Admin logged in successfully",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Verify the token
export const verifyAdminToken = (req, res) => {
  res.json({
    verified: true,
    role:"admin",
    expired: false,       
    message: "Token is valid."
  });
};
