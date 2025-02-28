import mongoose, { Schema, Document } from "mongoose";

interface IGroup extends Document {
    name: string;
    users: mongoose.Schema.Types.ObjectId[];
    profilePic: string;
    description: string;
    coin: { name: string; image: string };
    shopItems: mongoose.Schema.Types.ObjectId[];
  }
  
  const GroupSchema = new Schema<IGroup>({
    name: { type: String, required: true },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    profilePic: { type: String },
    description: { type: String },
    coin: {
      name: { type: String, required: true },
      image: { type: String, required: true },
    },
    shopItems: [{ type: Schema.Types.ObjectId, ref: "ShopItem" }],
  });
  
  export default mongoose.model<IGroup>("Group", GroupSchema);
  