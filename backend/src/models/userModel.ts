import mongoose, { Schema, Document } from "mongoose";

interface IChallengeStatus {
  challengeID: mongoose.Schema.Types.ObjectId;
  status: string; // e.g., "pending", "completed"
}

interface ICreatedChallenge {
  challengeID: mongoose.Schema.Types.ObjectId;
  users: mongoose.Schema.Types.ObjectId[];
  challengeCode: string;
}

interface IUserGroup {
  GID: mongoose.Schema.Types.ObjectId;
  coins: number;
  myChallenges: IChallengeStatus[];
  role: string; // e.g., "admin", "member"
  createdChallenges: ICreatedChallenge[];
}

interface IUser extends Document {
  name: string;
  email: string;
  desc: string;
  profilePicture: string;
  groups: IUserGroup[];
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  desc: { type: String },
  profilePicture: { type: String },
  groups: [
    {
      GID: { type: Schema.Types.ObjectId, ref: "Group" },
      coins: { type: Number, default: 0 },
      myChallenges: [
        {
          challengeID: { type: Schema.Types.ObjectId, ref: "Challenge" },
          status: { type: String, required: true },
        },
      ],
      role: { type: String, required: true, enum: ["admin", "moderator", "user", "guest"] },
      createdChallenges: [
        {
          challengeID: { type: Schema.Types.ObjectId, ref: "Challenge" },
          users: [{ type: Schema.Types.ObjectId, ref: "User" }],
          challengeCode: { type: String, required: true },
        },
      ],
    },
  ],
});



const User = mongoose.model<IUser>("User", UserSchema);

export default User;

