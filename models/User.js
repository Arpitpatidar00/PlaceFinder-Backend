import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    maxlength: [100, 'Name cannot exceed 100 characters.'] // Maximum length for name
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/.+@.+\..+/, 'Please enter a valid email address.'] // Regex for basic email validation
  },
  password: { 
    type: String, 
    required: true, 
    minlength: [5, 'Password must be at least 5 characters long.'], // Minimum password length
    maxlength: [100, 'Password cannot exceed 100 characters.'] // Maximum length for password
  },
  role: { 
    type: String, 
    required: true, 
    enum: ['user', 'driver', 'guide'] // Enum for user roles
  },
  profileImage: { 
    type: String,
    default: 'default-profile-image-base64-string' // Default placeholder image
  },
  licenseNo: { 
    type: String, 
    validate: {
      validator: (v) => v == null || /^\d{16}$/.test(v), // 16 digit license number
      message: 'License number must be exactly 16 digits.'
    }
  },
  licenseImage: { 
    type: String // Store Base64 string for license image for drivers
  },
  aadharNo: { 
    type: String, 
    validate: {
      validator: (v) => v == null || /^\d{12}$/.test(v), // 12 digit Aadhar number
      message: 'Aadhar number must be exactly 12 digits.'
    }
  },
  aadharImage: { 
    type: String // Store Base64 string for Aadhar image for guides
  },
}, { timestamps: true });

// Password hashing before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Create an index on the email field for faster queries
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

export default User;
