import express from "express";
import {
  createUser,
  editUser,
  getUserProfile,
  loginUser,
  logoutUser,
} from "../controllers/user.js";
import { authUser } from "../../middleware/authUser.js";

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", loginUser);
router.post("/logout", authUser, logoutUser);
router.post("/:userId", authUser, editUser);
router.get("/profile", authUser, getUserProfile);

export default router;
