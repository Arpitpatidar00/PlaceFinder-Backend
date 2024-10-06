import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/.+@.+\..+/, 'Please enter a valid email address.'] // Regex for basic email validation
  },
  password: { 
    type: String, 
    required: true, 
    minlength: [5, 'Password must be at least 5 characters long.'] // Minimum password length
  },
  role: { 
    type: String, 
    required: true, 
    enum: ['user', 'driver', 'guide'] 
  },
  profileImage: { type: String }, // Store Base64 string for profile image
  licenseNo: { 
    type: String, 
    validate: {
      validator: (v) => v == null || /^\d{16}$/.test(v), // 16 digit license number
      message: 'License number must be exactly 16 digits.'
    }
  },
  licenseImage: { type: String }, // Store Base64 string for license image for drivers
  aadharNo: { 
    type: String, 
    validate: {
      validator: (v) => v == null || /^\d{12}$/.test(v), // 12 digit Aadhar number
      message: 'Aadhar number must be exactly 12 digits.'
    }
  },
  aadharImage: { type: String }, // Store Base64 string for Aadhar image for guides
}, { timestamps: true });

// Create an index on the email field for faster queries
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

export default User;

// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { 
//     type: String, 
//     required: true, 
//     unique: true, 
//     match: [/.+@.+\..+/, 'Please enter a valid email address.'] 
//   },
//   password: { 
//     type: String, 
//     required: true, 
//     minlength: [5, 'Password must be at least 5 characters long.'] 
//   },
//   role: { 
//     type: String, 
//     required: true, 
//     enum: ['user', 'driver', 'guide'], 
//     default: 'user' // Default role
//   },
//   profileImage: { type: String }, // Store URL for profile image
//   licenseNo: { 
//     type: String, 
//     validate: {
//       validator: (v) => v == null || /^\d{16}$/.test(v), 
//       message: 'License number must be exactly 16 digits.'
//     }
//   },
//   licenseImage: { type: String }, // Store URL for license image
//   aadharNo: { 
//     type: String, 
//     validate: {
//       validator: (v) => v == null || /^\d{12}$/.test(v), 
//       message: 'Aadhar number must be exactly 12 digits.'
//     }
//   },
//   aadharImage: { type: String }, // Store URL for Aadhar image
// }, { timestamps: true });

// // Password hashing middleware
// userSchema.pre('save', async function(next) {
//     if (this.isModified('password')) {
//         this.password = await bcrypt.hash(this.password, 10);
//     }
//     next();
// });

// // Create an index on the email field for faster queries
// userSchema.index({ email: 1 });

// const User = mongoose.model('User', userSchema);

// export default User;
