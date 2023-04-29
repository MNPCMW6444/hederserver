import mongoose from "mongoose";

const tutorialCompletenessModal = new mongoose.Schema(
  {
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "tutorialCompleteness",
  tutorialCompletenessModal
);
