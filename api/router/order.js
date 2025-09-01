import express from "express";
import { createOrder, getAllOrders } from "../controllers/order.js";
import { authUser } from "../../middleware/authUser.js";

const router = express.Router();

router.get("/", getAllOrders)
router.post("/", authUser, createOrder)

export default router;