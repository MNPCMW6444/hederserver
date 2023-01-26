import mongoose from "mongoose";

const MMMModal = new mongoose.Schema(
  {
    name: String,
    tags: String,
    find: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("MMM", MMMModal);
