import express from "express";
import { createZone, editZone, getAllZones } from "../controllers/zone.js";

const router = express.Router();

router.post("/", createZone);
router.get("/", getAllZones);
router.put("/:zoneId", editZone);

export default router;
