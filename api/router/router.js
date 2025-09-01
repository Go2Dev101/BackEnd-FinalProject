import express from "express";
import userRouter from "./user.js";
import zoneRouter from "./zone.js";
import menuRouter from "./menu.js";
import cartRouter from "./cart.js";
import orderRouter from "./order.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/zone", zoneRouter);
router.use("/menu", menuRouter);
router.use("/cart", cartRouter);
router.use("/order", orderRouter);

export default router;
