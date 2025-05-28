// backend/routes/ai.js

// Import Express to define the router
const express = require("express");

// Import the OpenAI SDK
const { OpenAI } = require("openai");

// Create a new Express router instance
const router = express.Router();

// Initialize OpenAI with your API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /ai/generate-description
// This route accepts a task title and returns a generated description
router.post("/generate-description", async (req, res) => {
  const { title } = req.body;

  // Validate that a title was provided
  if (!title) return res.status(400).json({ message: "Title is required" });

  try {
    // Create a chat completion request to OpenAI's GPT model
    const chat = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Model to use
      messages: [
        {
          role: "user",
          content: `Write a helpful task description for: "${title}"`,
        },
      ],
    });

    // Extract and clean the generated description from the response
    const description = chat.choices[0].message.content.trim();

    // Send the generated description back to the client
    res.json({ description });
  } catch (err) {
    // Log any OpenAI errors and return a generic error message
    console.error("OpenAI error:", err.message);
    res.status(500).json({ message: "AI generation failed" });
  }
});

// Export the router to be used in server.js
module.exports = router;