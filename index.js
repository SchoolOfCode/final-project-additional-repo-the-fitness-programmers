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
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// Test connection
pool.connect((err) => {
  if (err) {
    console.error("Error connecting to PostgreSQL", err);
  } else {
    console.log("Connected to PostgreSQL");
  }
});

console.log(
  process.env.PGHOST,
  process.env.PGUSER,
  process.env.PGDATABASE,
  process.env.PGPASSWORD,
  process.env.PGPORT
); // Should print your database host

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
        email: "test@test.com",
        bmi: 111,
        age: 32,
        weight: 69,
        activity_level: 1,
        water_intake: 1.5,
        goal: [
          {
            type: "Weight Loss",
            weight: 30,
          },
        ],
        workouts: [
          {
            id: 2,
            type: "Dead Lift",
            sets: 3,
            reps: 10,
            weight: 100,
            duration: 30,
            calories_burnt: 200,
          },
          {
            id: 3,
            type: "Squats",
            sets: 3,
            reps: 12,
            weight: 20,
            duration: 30,
            calories_burnt: 200,
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
