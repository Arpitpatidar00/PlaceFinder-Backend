import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['user', 'driver', 'guide'] },
  profileImage: { type: String }, // Store Base64 string for profile image
  licenseNo: { type: String }, // For drivers
  licenseImage: { type: String }, // Store Base64 string for license image for drivers
  aadharNo: { type: String }, // For guides
  aadharImage: { type: String }, // Store Base64 string for Aadhar image for guides
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
