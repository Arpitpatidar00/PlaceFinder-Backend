import express from "express";
import Comment from "../models/Comment.js";
import User from "../models/User.js"; // Assuming you have a User model

const router = express.Router();

// GET all comments with user data
router.get("/", async (req, res) => {
  const { placeId } = req.query; // Get placeId from query parameters

  try {
    // Fetch comments that match the provided placeId
    const comments = await Comment.find({ placeId });
    
    // Fetch user details based on userId
    const commentsWithUserDetails = await Promise.all(
      comments.map(async (comment) => {
        const user = await User.findById(comment.userId); // Assuming userId is an ObjectId
        return {
          ...comment.toObject(),
          user: {
            id: user._id,
            name: user.name, // Use 'name' from the user schema
            profileImage: user.profileImage || 'defaultImage.jpg', // Default image fallback
          },
        };
      })
    );

    res.json(commentsWithUserDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new comment
router.post("/", async (req, res) => {
  const { placeId, userId, text } = req.body; // Expect only these fields

  if (!placeId || !userId || !text) {
    return res.status(400).json({ message: "placeId, userId, and text are required" });
  }

  try {
    const comment = new Comment({
      placeId,
      userId,
      text,
    });

    const newComment = await comment.save();
    
    // Fetch user details for the new comment
    const user = await User.findById(userId);
    const commentWithUserDetails = {
      ...newComment.toObject(),
      user: {
        id: user._id,
        name: user.name,
        profileImage: user.profileImage || 'defaultImage.jpg', // Default image fallback
      },
    };

    res.status(201).json(commentWithUserDetails); // Return the complete comment object
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a comment by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedComment = await Comment.findByIdAndDelete(id);

    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({ message: "Comment deleted", deletedComment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/all", async (req, res) => {

  try {
    // Fetch comments and populate user details in a single query
    const comments = await Comment.find()
     

    // Map comments to include user details along with fallback for profile image
    const commentsWithUserDetails = comments.map((comment) => ({
      ...comment.toObject(),
      user: {
        id: comment.userId._id,
        name: comment.userId.name,
        profileImage: comment.userId.profileImage || 'defaultImage.jpg', // Default image fallback
      },
    }));

    res.json(commentsWithUserDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
