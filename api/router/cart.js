import express from "express";
import { cartShippingFee, cartSummary, getCart, updateCart } from "../controllers/cart.js";
import { authUser } from "../../middleware/authUser.js";

const router = express.Router();

router.get("/", authUser, getCart)
router.put("/", authUser, updateCart)
router.get("/summary", authUser, cartSummary)
router.get("/shipping", authUser, cartShippingFee)

export default router;