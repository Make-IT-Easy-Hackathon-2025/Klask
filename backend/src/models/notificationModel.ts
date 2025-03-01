import mongoose, { Schema, Document } from "mongoose";

interface INotification extends Document {
  message: string;
  isInvite: boolean;
}

const NotificationSchema = new Schema<INotification>(
  {
    message: { type: String, required: true },
    isInvite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>("Notification", NotificationSchema);