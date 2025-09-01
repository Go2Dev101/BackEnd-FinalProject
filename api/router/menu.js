import express from "express";
import { createMenu, deleteMenu, editMenu, getAllMenus } from "../controllers/menu.js";

const router = express.Router();

router.post("/", createMenu);
router.get("/", getAllMenus);
router.put("/:menuId", editMenu);
router.delete("/:menuId", deleteMenu);

export default router;
