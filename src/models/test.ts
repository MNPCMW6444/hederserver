import mongoose from "mongoose";

const test = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true },
    attentionScore: {
      type: Number,
      required: true,
    },
    memoryScore: {
      type: Number,
      required: true,
    },
    flexabilityScore: {
      type: Number,
      required: true,
    },
    creativityScore: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("test", test);
