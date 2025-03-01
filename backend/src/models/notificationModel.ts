import mongoose, { Schema, Document } from "mongoose";

interface INotification extends Document {
  message: string;
  isInvite: boolean;
  groupID: mongoose.Types.ObjectId;
}

const NotificationSchema = new Schema<INotification>(
  {
    message: { type: String, required: true },
    isInvite: { type: Boolean, default: false },
    groupID: { type: Schema.Types.ObjectId, ref: "Group" }, 
  },
  { timestamps: true }
);

export default mongoose.model<INotification>("Notification", NotificationSchema);