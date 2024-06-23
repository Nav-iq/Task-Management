import express from "express";
import Feedback from "../models/Feedback.model.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Add feedback to a task
router.post("/", authMiddleware(["User"]), async (req, res) => {
  const { taskId, feedback } = req.body;
  const userId = req.user.id;

  try {
    // Ensure the user hasn't already provided feedback for this task
    const existingFeedback = await Feedback.findOne({ user: userId, task: taskId });
    if (existingFeedback) {
      return res.status(400).json({ message: "You have already provided feedback for this task." });
    }

    const newFeedback = new Feedback({ user: userId, task: taskId, feedback });
    await newFeedback.save();

    res.status(201).json({ message: "Feedback added successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error adding feedback.", error });
  }
});

// Check if feedback is already submitted by the user for a specific task
router.get("/check/:taskId", authMiddleware(["User", "Admin", "Manager"]), async (req, res) => {
  const userId = req.user.id;
  const { taskId } = req.params;

  try {
    const feedback = await Feedback.findOne({ user: userId, task: taskId });
    res.status(200).json({ hasFeedback: !!feedback });
  } catch (error) {
    res.status(500).json({ message: "Error checking feedback status.", error });
  }
});

export default router;
