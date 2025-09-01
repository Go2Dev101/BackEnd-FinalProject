import express from "express";
import { createUser, editUser, loginUser } from "../controllers/user.js";

const router = express.Router();

router.post("/signup", createUser);
router.post("/:userId", editUser);
router.post("/login", loginUser);

export default router;
