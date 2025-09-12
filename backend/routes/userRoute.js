import express from "express";
import {
  changePassword,
  deleteUser,
  forgotPassword,
  getAllUsers,
  loginUser,
  logoutUser,
  registerUser,
  updateProfile,
  verification,
  verifyOTP,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { userSchema, validateUser } from "../validators/userValidate.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

// 🧾 Auth routes
router.post("/register", validateUser(userSchema), registerUser);
router.post("/login", loginUser);
router.post("/logout", isAuthenticated, logoutUser);

// ✅ Profile
router.route("/profile/update").put(isAuthenticated, singleUpload, updateProfile);

// 🗑️ Delete Account, Blogs collegati all'utente e foto profilo e thumbnail
router.route("/profile/delete").delete(isAuthenticated, deleteUser);

// 🔐 Email Verification & Password
router.post("/verify", verification);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp/:email", verifyOTP);
router.post("/change-password/:email", changePassword);

// 👥 Admin or general info
router.get("/all-users", getAllUsers);

export default router;
