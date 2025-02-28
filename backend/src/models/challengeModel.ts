import mongoose, { Schema, Document } from "mongoose";

interface IChallenge extends Document {
    title: string;
    description: string;
    coinsValue: number;
  }
  
  const ChallengeSchema = new Schema<IChallenge>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    coinsValue: { type: Number, required: true },
  });
  
  export default mongoose.model<IChallenge>("Challenge", ChallengeSchema);
  