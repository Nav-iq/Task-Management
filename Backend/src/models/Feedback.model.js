import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    feedback: { type: String, required: true },
  },
  { timestamps: true }
);

FeedbackSchema.index({ user: 1, task: 1 }, { unique: true });

export default mongoose.model("Feedback", FeedbackSchema);
