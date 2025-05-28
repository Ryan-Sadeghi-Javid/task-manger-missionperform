// backend/server.js

// Load environment variables from .env file (must come first)
require("dotenv").config();

// Import required modules
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

// Import route modules
const taskRoutes = require("./routes/tasks");
const authRoutes = require("./routes/auth");
const aiRoutes = require("./routes/ai");

// Connect to MongoDB using Mongoose
connectDB();

// Initialize the Express app
const app = express();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Mount route handlers
app.use("/tasks", taskRoutes);  // Task CRUD endpoints
app.use("/auth", authRoutes);   // Login and registration
app.use("/ai", aiRoutes);       // OpenAI-powered endpoints

// Define the port (from .env or fallback to 5000)
const PORT = process.env.PORT || 5000;

// Start the server and log a message
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));