import { Request, Response } from "express";
import ShopItem from "../models/shopItemModel";

export const getAllShopItemsByGroupId = async (req: Request, res: Response): Promise<void> => {
  const { groupId } = req.params;
  
  try {
    const shopItems = await ShopItem.find({ groupId });
    res.status(200).json({ message: "Shop items retrieved successfully", items: shopItems });
  } catch (error: any) {
    console.error("Error getting shop items:", error);
    res.status(500).json({ message: "Error getting shop items", error });
  }
};

export const createShopItem = async (req: Request, res: Response): Promise<void> => {
  const { name, description, price, imageUrl, groupId, quantity } = req.body;
  
  try {
    // Validate required fields
    if (!name || !price || !groupId) {
      res.status(400).json({ message: "Name, price, and groupId are required" });
      return;
    }
    
    const newShopItem = new ShopItem({
      name,
      description: description || "",
      price,
      imageUrl: imageUrl || "",
      groupId,
      quantity: quantity || 0,
      createdAt: new Date(),
    });
    
    const savedItem = await newShopItem.save();
    res.status(201).json({ message: "Shop item created successfully", item: savedItem });
  } catch (error: any) {
    console.error("Error creating shop item:", error);
    res.status(500).json({ message: "Error creating shop item", error });
  }
};

// Add this function to your existing shopController.ts

export const getShopItemById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    try {
      const shopItem = await ShopItem.findById(id);
      if (!shopItem) {
        res.status(404).json({ message: "Shop item not found" });
        return;
      }
      res.status(200).json({ message: "Shop item found", item: shopItem });
    } catch (error: any) {
      console.error("Error getting shop item:", error);
      res.status(500).json({ message: "Error getting shop item", error });
    }
  };