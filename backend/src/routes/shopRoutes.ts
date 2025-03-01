import express from "express";
import { getAllShopItemsByGroupId, createShopItem, getShopItemById, updateShopItem, purchaseShopItem } from "../controllers/shopController";

const router = express.Router();

router.get("/items/:groupId", getAllShopItemsByGroupId);
router.get("/:id", getShopItemById);
router.post("/add-item", createShopItem);
router.post("/update/:id", updateShopItem);
router.post("/purchase", purchaseShopItem);

export default router;