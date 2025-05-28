// backend/middleware/authMiddleware.js

// Import the JWT library to verify JSON Web Tokens
const jwt = require("jsonwebtoken");

// Import the User model to retrieve user details from the database
const User = require("../models/User");

// Middleware function to protect routes by verifying JWTs
const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token from the Authorization header
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using the JWT secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the authenticated user to the request object (excluding password)
      req.user = await User.findById(decoded.id).select("-password");

      // Proceed to the next middleware or route handler
      next();
    } catch (err) {
      // Log and return an error if token verification fails
      console.error("Token verification failed:", err);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    // Return an error if no token is provided
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Export the middleware function for use in protected routes
module.exports = { protect };