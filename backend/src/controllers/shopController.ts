import { Request, Response } from "express";
import ShopItem from "../models/shopItemModel";
import Group from "../models/groupModel";
import User from "../models/userModel";
import Notifications from "../models/notificationModel";
import mongoose from "mongoose";

export const getAllShopItemsByGroupId = async (req: Request, res: Response): Promise<void> => {
  const { groupId } = req.params;
  
  try {
    const group = await Group.findById(groupId).populate("shopItems");
    if (!group) {
      res.status(404).json({ message: "Group not found" });
      return;
    }
    const shopItems = group.shopItems;

    res.status(200).json({ items: shopItems });

    
  } catch (error: any) {
    console.error("Error getting shop items:", error);
    res.status(500).json({ message: "Error getting shop items", error });
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

  export const createShopItem = async (req: Request, res: Response): Promise<void> => {
    const { name, description, price, image, availability,quantity, groupId } = req.body; 
    try {
      // Validate required fields
      if (!name || !description || !price || !availability) {
        res.status(400).json({ message: "Name, description, price and availability are required" });
        return;
      }
      const newShopItem = new ShopItem({
        name,
        description,
        price,
        image,
        availability,
        quantity,
      });
      const savedItem = await newShopItem.save();
      if(!savedItem) {

        res.status(500).json({ message: "Error creating shop item" });
        return;
      }
      const group = await Group.findByIdAndUpdate(
        groupId,
        { $push: { shopItems: savedItem._id } },
        { new: true }
      );
      
      if(!group){
        res.status(404).json({ message: "Group not found" });
        return;
      }


      res.status(201).json({ message: "Shop item created successfully", item: savedItem });
    } catch (error: any) {
      console.error("Error creating shop item:", error);
      res.status(500).json({ message: "Error creating shop item", error });
    }
  };

  export const updateShopItem = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, description, price, image, availability } = req.body;

    try {
      // Validate required fields
      if (!name || !description || !price || !availability) {
        res.status(400).json({ message: "Name, description, price and availability are required" });
        return;
      }

      const updatedItem = await ShopItem.findByIdAndUpdate(
        id,
        {
          name,
          description,
          price,
          image,
          availability
        },
        { new: true }
      );

      if (!updatedItem) {
        res.status(404).json({ message: "Shop item not found" });
        return;
      }

      res.status(200).json({ message: "Shop item updated successfully", item: updatedItem });
    } catch (error: any) {
      console.error("Error updating shop item:", error);
      res.status(500).json({ message: "Error updating shop item", error });
    }
  };

  export const purchaseShopItem = async (req: Request, res: Response): Promise<void> => {
    const { userId, groupId, itemId, quantity } = req.body;

    try {
        // Get the shop item to check price
        const shopItem = await ShopItem.findById(itemId);
        if (!shopItem) {
            res.status(404).json({ success: false, message: "Shop item not found" });
            return;
        }

        // Get user to check coins
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        // Find the specific group in user's groups array
        const userGroup = user.groups.find(g => g.GID.toString() === groupId);
        if (!userGroup) {
            res.status(404).json({ success: false, message: "Group not found for user" });
            return;
        }

        // Calculate total cost
        const totalCost = shopItem.price * quantity;

        // Check if user has enough coins
        if (userGroup.coins < totalCost) {
            res.status(400).json({ success: false, message: "Insufficient coins" });
            return;
        }
        console.log("hello")
        // Update user's coins and add item to purchasedItems
        await User.findOneAndUpdate(
            { 
                _id: userId,
                "groups.GID": groupId 
            },
            {
                $inc: { "groups.$.coins": -totalCost },
                $push: { 
                    purchasedItems: {
                        itemID: itemId,
                        quantity: quantity
                    }
                }
            }
        );
        shopItem.quantity -= quantity;
        shopItem.save();

        // send a notification to the user that they have purchased an item
        const group = await Group.findById(groupId);
        if (!group) {
            res.status(404).json({ success: false, message: "Group not found" });
            return;
        }

        // 1. Send notification to the buyer
        const buyerNotification = new Notifications({
            message: `You've purchased ${quantity} ${quantity > 1 ? 'units' : 'unit'} of "${shopItem.name}" for ${totalCost} coins.`,
            isInvite: false,
            groupID: groupId
        });
        
        const savedBuyerNotification = await buyerNotification.save();
        
        // Add notification to the user's notifications list
        await User.findByIdAndUpdate(userId, {
            $push: { notifications: savedBuyerNotification._id }
        });
         // 2. Find admin users and notify them about the purchase
         const adminUsers = await User.find({
          "groups": {
              $elemMatch: {
                  "GID": groupId,
                  "role": "admin"
              }
          }
      });

      // Create and send notifications to all admins
      for (const admin of adminUsers) {
          // Skip if the buyer is also an admin
          if ((admin._id as mongoose.Types.ObjectId).toString() === userId) continue;
          
          const adminNotification = new Notifications({
              message: `${user.name} has purchased ${quantity} ${quantity > 1 ? 'units' : 'unit'} of "${shopItem.name}" from the group shop.`,
              isInvite: false,
              groupID: groupId
          });
          
          const savedAdminNotification = await adminNotification.save();
          
          // Add notification to the admin's notifications list
          await User.findByIdAndUpdate(admin._id, {
              $push: { notifications: savedAdminNotification._id }
          });
      }


        res.status(200).json({ 
            success: true, 
            message: "Purchase successful",
            remainingCoins: userGroup.coins - totalCost
        });

    } catch (error) {
        console.error("Error purchasing item:", error);
        res.status(500).json({ success: false, message: "Error purchasing item" });
    }
};

export const updateQuantity = async (req: Request, res: Response): Promise<void> => {
  const { id, quantity } = req.body;

  try {
    const updatedItem = await
    ShopItem.findByIdAndUpdate(id, {
      quantity
    }, { new: true });    

    if (!updatedItem) {
      res.status(404).json({ message: "Shop item not found" });
      return;
    }

    res.status(200).json({ message: "Quantity updated successfully", item: updatedItem });
  }
  catch (error: any) {
    console.error("Error updating quantity:", error);
    res.status(500).json({ message: "Error updating quantity", error });
  }
}