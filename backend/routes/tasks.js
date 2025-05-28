// backend/routes/tasks.js

// Import dependencies
const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { protect } = require("../middleware/authMiddleware");

// @route   POST /tasks
// @desc    Create a new task for the logged-in user
// @access  Private
router.post("/", protect, async (req, res) => {
  const { title, description, status } = req.body;

  // Validate required field
  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    // Create a new task document associated with the current user
    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      status,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /tasks
// @desc    Retrieve all tasks for the logged-in user
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    // Find all tasks by the user's ID, sorted by most recent
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /tasks/:id
// @desc    Retrieve a specific task by ID (owned by the user)
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    // Find task by ID and ensure it belongs to the current user
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /tasks/:id
// @desc    Update an existing task
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    // Find the task and confirm it belongs to the logged-in user
    let task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) return res.status(404).json({ message: "Task not found" });

    // Update fields only if they are provided (nullish coalescing)
    const { title, description, status } = req.body;
    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /tasks/:id
// @desc    Delete a task owned by the user
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    // Find and delete the task by ID if it belongs to the user
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Export the router to be used in server.js
module.exports = router;