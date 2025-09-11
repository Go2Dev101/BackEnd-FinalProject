import express from "express";
import {
  createMenu,
  deleteMenu,
  editMenu,
  getAllMenus,
  getMenuById,
  getMenuBySlug,
  popularMenu,
} from "../controllers/menu.js";

const router = express.Router();

router.post("/", createMenu);
router.get("/", getAllMenus);
router.get("/popular", popularMenu);
// router.get("/:menuId", getMenuById);
router.get("/:slug", getMenuBySlug);
router.put("/:menuId", editMenu);
router.delete("/:menuId", deleteMenu);

export default router;
