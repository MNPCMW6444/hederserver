import mongoose from "mongoose";

const testTutorial = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    isTestTutorialDone: { type: Boolean, required: true }
  },
  {
    timestamps: true,
  }
);


export default mongoose.model("testTutorial", testTutorial);
