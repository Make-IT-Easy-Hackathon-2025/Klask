import express from "express";
import { getAllShopItemsByGroupId, createShopItem, getShopItemById } from "../controllers/shopController";

const router = express.Router();

router.get("/items/:groupId", getAllShopItemsByGroupId);
router.get("/:id", getShopItemById);
router.post("/add-item", createShopItem);

export default router;