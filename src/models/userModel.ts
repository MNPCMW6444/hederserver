import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    deactivated: { type: Boolean, required: true },
    deleted: { type: Boolean, required: true },
    notifications: { type: Boolean, required: true },
    newsletter: { type: Boolean, required: true },
    neurons: { type: Number, required: true },
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("user", userSchema);
