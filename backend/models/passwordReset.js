import mongoose, { Schema } from "mongoose";

const passwordResetSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const PasswordReset = mongoose.model("PasswordReset", passwordResetSchema);
export default PasswordReset;
