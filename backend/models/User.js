// backend/models/User.js

// Import Mongoose to define schemas and interact with MongoDB
const mongoose = require("mongoose");

// Import bcrypt for secure password hashing
const bcrypt = require("bcryptjs");

// Define the schema for a User document
const userSchema = new mongoose.Schema({
  // Unique username for login
  username: {
    type: String,
    required: true,   // Must be provided
    unique: true      // Cannot be duplicated
  },

  // Password field (will be hashed before storing)
  password: {
    type: String,
    required: true
  }
});

// Pre-save middleware to hash the password before saving to the database
userSchema.pre("save", async function (next) {
  // Only hash the password if it's new or has been modified
  if (!this.isModified("password")) return next();

  // Generate a salt and hash the password with it
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next(); // Proceed to save
});

// Instance method to compare entered password with the stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export the User model to be used in auth routes
module.exports = mongoose.model("User", userSchema);