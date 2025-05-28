// backend/models/Task.js

// Import Mongoose to define the task schema and interact with MongoDB
const mongoose = require("mongoose");

// Define the schema for a Task document
const taskSchema = new mongoose.Schema(
  {
    // Reference to the user who owns this task
    user: {
      type: mongoose.Schema.Types.ObjectId, // Stores the user's ObjectId
      ref: "User",                          // Reference to the User model
      required: true,                       // Every task must belong to a user
    },

    // Title of the task (required)
    title: {
      type: String,
      required: [true, "Please add a title"], // Custom error message if missing
    },

    // Optional description of the task
    description: {
      type: String,
    },

    // Status of the task with limited allowed values
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"], // Must match one of these
      default: "To Do",                       // Default value if not specified
    },
  },
  {
    // Automatically add `createdAt` and `updatedAt` timestamps to the document
    timestamps: true,
  }
);

// Export the model to use in route controllers (e.g., routes/tasks.js)
module.exports = mongoose.model("Task", taskSchema);