import express from "express";
import { createCart, getCart, updateCart } from "../controllers/cart.js";
import { authUser } from "../../middleware/authUser.js";

const router = express.Router();

router.post("/", authUser, createCart)
router.get("/", authUser, getCart)
router.put("/", authUser, updateCart)

export default router;