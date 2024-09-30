

import express from 'express';
import { signup, signin, updated,getAllUsers } from '../controllers/authControllers.js';
// Remove upload middleware if not used
// import upload from '../middleware/upload.js';  // Adjust this path according to your structure

const router = express.Router();

// Signup route
router.post('/signup', signup); // Removed upload middleware

// Signin route
router.post('/signin', signin);
router.get('/users', getAllUsers);

// router.put('/profileupdate/:userId',updateUserProfile);
router.put('/profileupdate/:userId', updated);

export default router;

