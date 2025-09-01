import express from "express";
import userRouter from "./user.js";
import zoneRouter from "./zone.js";
import menuRouter from "./menu.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/zone", zoneRouter);
router.use("/menu", menuRouter);

export default router;
