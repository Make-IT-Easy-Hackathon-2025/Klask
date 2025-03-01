import mongoose, { Schema, Document } from "mongoose";

interface IShopItem extends Document {
    name: string;
    description: string;
    price: number;
    image: string;
    availability: string;
    quantity: number;
  }
  
  const ShopItemSchema = new Schema<IShopItem>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    availability: { type: String, required: true, enum: ["in stock", "out of stock","limited"] },
    quantity: { type: Number, default: 0 },
  });
  
  export default mongoose.model<IShopItem>("ShopItem", ShopItemSchema);
  