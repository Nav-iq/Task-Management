import express from "express";
import Task from "../models/Task.model.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import User from "../models/User.model.js";
import sendEmail from "../services/emailService.js";

const router = express.Router();

// get all tasks, accessible by all authenticated users
router.get("/", authMiddleware(["Admin", "Manager", "User"]), async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// create a new task, accessible only by Admins
router.post("/", authMiddleware(["Admin"]), async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.json({ message: "Task created" });
  } catch (error) {
    res.status(500).json({ message: "Error creating task" });
  }
});

// update a task, accessible only by Admins
router.put("/:id", authMiddleware(["Admin", "Manager"]), async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Get the email of the user who is updating the task
    const senderEmail = req.user.email;
    const senderName = req.user.username;
    const role = req.user.role;

    // Get all users' emails
    const users = await User.find({});
    const recipientEmails = users.map((user) => user.email);

    const emailSubject = "Task Updated";
    const emailText = `Task "${task.title}" has been updated by ${senderName}.`;
    const emailHtml = `
    <p><strong>Role:</strong> ${role}</p>
    <p><strong>Task:</strong> ${task.title}</p>
    <p><strong>Updated by:</strong> ${senderName}</p>
  `;

    // Send email to all users
    sendEmail(senderEmail, recipientEmails.join(","), emailSubject, emailText, emailHtml);

    res.json({ message: "Task updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
});

// delete a task, accessible only by Admins
router.delete("/:id", authMiddleware(["Admin"]), async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task" });
  }
});

export default router;
