import mongoose, { Schema, Document } from "mongoose";

interface IChallenge extends Document {
    title: string;
    description: string;
    coinsValue: number;
    code: string;
    users: mongoose.Types.ObjectId[];
  }
  
  const ChallengeSchema = new Schema<IChallenge>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    coinsValue: { type: Number, required: true },
    code: { type: String, required: true },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  });
  
  export default mongoose.model<IChallenge>("Challenge", ChallengeSchema);
  