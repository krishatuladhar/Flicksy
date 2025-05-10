import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    profilePicture: {
      type: String,
    },
    bio: {
      type: String,
    },
  },
  { timestamps: true } // _id is auto-generated; timestamps adds createdAt/updatedAt
);

const User = mongoose.model("User", userSchema);
export default User;
