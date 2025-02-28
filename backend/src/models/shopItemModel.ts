import mongoose, { Schema, Document } from "mongoose";

interface IShopItem extends Document {
    name: string;
    description: string;
    price: number;
    image: string;
  }
  
  const ShopItemSchema = new Schema<IShopItem>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
  });
  
  export default mongoose.model<IShopItem>("ShopItem", ShopItemSchema);
  