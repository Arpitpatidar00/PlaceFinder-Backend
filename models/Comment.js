import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  placeId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming placeId is an ObjectId
    required: true,
    ref: 'Place', // Reference to the Place model
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming userId is an ObjectId
    required: true,
    ref: 'User', // Reference to the User model
  },
  text: {
    type: String,
    required: true,
    trim: true, // Removes whitespace from both ends
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to current date if not provided
  },
  // __v field is automatically added by Mongoose, no need to declare it
});

// Export the Comment model
const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
