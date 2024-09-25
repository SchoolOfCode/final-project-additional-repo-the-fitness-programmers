// index.js
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // For parsing JSON requests

// PostgreSQL connection pool setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // If self-signed certificates are used
  },
});

// Test connection
pool.connect((err) => {
  if (err) {
    console.error("Error connecting to PostgreSQL", err);
  } else {
    console.log("Connected to PostgreSQL");
  }
});

// Basic route
app.get("/", (req, res) => {
  return res.status(200).send("Hello from the backend!");
});

// GET route to fetch all users
app.get("/api/user/:id", async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }
  try {
    // Query user details
    const userResult = await pool.query(
      `SELECT * FROM users WHERE id = $1`,
      [userId]
    );
    const user = userResult.rows[0];

    // Query goals related to the user
    const goalsResult = await pool.query(
      `SELECT * FROM goals WHERE user_id = $1`,
      [userId]
    );
    const goals = goalsResult.rows;

    // Query workouts related to the user
    const workoutsResult = await pool.query(
      `SELECT * FROM workouts WHERE user_id = $1`,
      [userId]
    );
    const workouts = workoutsResult.rows;

    return res.status(200).json({ user, goals, workouts });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
