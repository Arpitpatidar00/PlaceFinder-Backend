import express from "express";
import { adminLogin, verifyAdminToken } from "../controllers/admin/admin-registration.js";
import protectAdminRoute  from "../middleware/adminMiddleware.js";

const router = express.Router();

// Route for admin login
router.post("/login", adminLogin);

// Route for verifying token from URL
router.get('/verify-token/:token', protectAdminRoute, verifyAdminToken);



export default router;
