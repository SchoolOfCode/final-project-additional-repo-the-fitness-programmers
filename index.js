// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // For parsing JSON requests

// Basic route
app.get("/", (req, res) => {
  return res.status(200).send("Hello from the backend!");
});

// API route example
app.get("/api/user", (req, res) => {
  try {
    const user = [
      {
        id: 1,
        name: "Jakub",
        bmi: 23,
        age: 32,
        weight: 69,
        workouts: [
          {
            id: 2,
            type: "Dead Lift",
            sets: 3,
            reps: 10,
            weight: 100,
          },
        ],
      },
    ];
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
