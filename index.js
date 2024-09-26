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
  console.log(userId);
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }
  try {
    // Query user details
    const userResult = await pool.query(
      `SELECT * FROM users WHERE id = $1`,
      [userId]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

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

// Update an existing user's workouts
app.post("/api/user/workouts/:id", async (req, res) => {
  const userId = req.params.id;
  const { type, duration } = req.body;

  try {
    // Insert the new workout into the workouts table
    const query = `INSERT INTO workouts (user_id, type, duration)
       VALUES ($1, $2, $3) RETURNING *`;
    const values = [userId, type, duration];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]); // Return the updated user
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// PUT request to update user data
app.put("/api/user/:id", async (req, res) => {
  const userId = req.params.id;
  const {
    name,
    email,
    bmi,
    age,
    weight,
    activity_level,
    water_intake,
    currentweight,
    targetweight,
    startweight,
    targetcalories,
  } = req.body;

  // Prepare an array of fields to update, only including the ones that are provided
  let updateFields = [];
  let values = [];

  if (name) {
    updateFields.push("name = $" + (updateFields.length + 1));
    values.push(name);
  }
  if (email) {
    updateFields.push("email = $" + (updateFields.length + 1));
    values.push(email);
  }
  if (bmi) {
    updateFields.push("bmi = $" + (updateFields.length + 1));
    values.push(bmi);
  }
  if (age) {
    updateFields.push("age = $" + (updateFields.length + 1));
    values.push(age);
  }
  if (weight) {
    updateFields.push("weight = $" + (updateFields.length + 1));
    values.push(weight);
  }
  if (activity_level) {
    updateFields.push(
      "activity_level = $" + (updateFields.length + 1)
    );
    values.push(activity_level);
  }
  if (water_intake) {
    updateFields.push("water_intake = $" + (updateFields.length + 1));
    values.push(water_intake);
  }
  if (currentweight) {
    updateFields.push(
      "currentweight = $" + (updateFields.length + 1)
    );
    values.push(currentweight);
  }
  if (targetweight) {
    updateFields.push("targetweight = $" + (updateFields.length + 1));
    values.push(targetweight);
  }
  if (startweight) {
    updateFields.push("startweight = $" + (updateFields.length + 1));
    values.push(startweight);
  }
  if (targetcalories) {
    updateFields.push(
      "targetcalories = $" + (updateFields.length + 1)
    );
    values.push(targetcalories);
  }

  // If no fields are provided to update, return an error
  if (updateFields.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  // Add the user ID to the values array
  values.push(userId);

  // Build the update query dynamically
  const query = `
    UPDATE users 
    SET ${updateFields.join(", ")}
    WHERE id = $${values.length}
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update an existing user's target weight
// app.put("/api/user/:id", async (req, res) => {
//   const userId = req.params.id;
//   const { target_weight } = req.body;
//   try {
//     const query = `UPDATE users SET target_weight = $1 WHERE user_id = $2 RETURNING *`;
//     const values = [target_weight, userId];

//     const result = await pool.query(query, values);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(result.rows[0]); // Return the updated user
//   } catch (error) {
//     res.status(500).send("Server Error");
//   }
// });

//Put request for water intake
// app.put("/api/user/:id", async (req, res) => {
//   const userId = req.params.id;
//   const { water_intake, water_intake_goal } = req.body;

//   // Build the query dynamically based on provided fields
//   const fieldsToUpdate = [];
//   const values = [];

//   if (water_intake) {
//     fieldsToUpdate.push(
//       `water_intake = $${fieldsToUpdate.length + 1}`
//     );
//     values.push(water_intake);
//   }

//   if (water_intake_goal) {
//     fieldsToUpdate.push(
//       `water_intake_goal = $${fieldsToUpdate.length + 1}`
//     );
//     values.push(water_intake_goal);
//   }

//   // Ensure there are fields to update
//   if (fieldsToUpdate.length === 0) {
//     return res.status(400).json({ message: "No fields to update" });
//   }

//   // Add the userId as the last value for the WHERE clause
//   values.push(userId);

//   // Build the SQL query
//   const query = `
//     UPDATE users
//     SET ${fieldsToUpdate.join(", ")}
//     WHERE id = $${values.length}
//     RETURNING *`;

//   try {
//     const result = await pool.query(query, values);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(result.rows[0]); // Return the updated user
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
