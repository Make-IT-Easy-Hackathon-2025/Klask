import mongoose, { Schema, Document } from "mongoose";

interface IChallenge extends Document {
    title: string;
    description: string;
    coinsValue: number;
    users: mongoose.Schema.Types.ObjectId[];
    creator: mongoose.Schema.Types.ObjectId;
    code: string;
  }
  
  const ChallengeSchema = new Schema<IChallenge>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    coinsValue: { type: Number, required: true },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    code: { type: String, required: true },
  });
  
  export default mongoose.model<IChallenge>("Challenge", ChallengeSchema);
  