// backend/config/db.js

// Import the Mongoose ODM library to interface with MongoDB
const mongoose = require("mongoose");

// Asynchronous function to establish a connection to the MongoDB database
const connectDB = async () => {
  try {
    // Attempt to connect using the MongoDB URI stored in environment variables
    await mongoose.connect(process.env.MONGO_URI);

    // Log a success message if the connection is established
    console.log("MongoDB connected successfully.");
  } catch (error) {
    // Log the error message if the connection fails
    console.error("MongoDB connection failed:", error.message);

    // Exit the Node.js process with failure (code 1)
    process.exit(1);
  }
};

// Export the connection function so it can be used in server.js
module.exports = connectDB;