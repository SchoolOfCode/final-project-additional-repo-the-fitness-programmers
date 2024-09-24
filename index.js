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
  res.send("Hello from the backend!");
});

// API route example
app.get("/api/products", (req, res) => {
  const products = [
    { id: 1, name: "Product 1", price: 10 },
    { id: 2, name: "Product 2", price: 20 },
  ];
  res.json(products);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
