import express from "express";
import { createOrder, getAllOrders, getOrderById } from "../controllers/order.js";
import { authUser } from "../../middleware/authUser.js";

const router = express.Router();

router.get("/", getAllOrders)
router.post("/", authUser, createOrder)
router.get("/:orderId", authUser, getOrderById)

export default router;