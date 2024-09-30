

import express from 'express';
import { signup, signin, updated } from '../controllers/authControllers.js';
// Remove upload middleware if not used
// import upload from '../middleware/upload.js';  // Adjust this path according to your structure

const router = express.Router();

// Signup route
router.post('/signup', signup); // Removed upload middleware

// Signin route
router.post('/signin', signin);
// router.put('/profileupdate/:userId',updateUserProfile);
router.put('/profileupdate/:id',updated)

export default router;

