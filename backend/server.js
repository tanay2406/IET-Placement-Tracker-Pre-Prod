require('dotenv').config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");


const app = express();
const PORT = 5000;

// Allow frontend to connect
app.use(cors());

// Allow JSON data
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// 🔥 Main route — receive data from frontend
app.post("/api/data", async (req, res) => {
  const {
    sub,
    name,
    email,
    mobile_number,
    branch,
    branch_id
  } = req.body;

  try {

    const existingUser = await pool.query(
      "SELECT user_id FROM usersDetails WHERE google_id = $1",
      [sub]
    );

    if (existingUser.rows.length > 0) {
      console.log("User already exists");
      return res.json({ message: "User already created" });
    }

    await pool.query(
      `INSERT INTO usersDetails
      (google_id, name, email, mobile_number, branch, branch_id)
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [sub, name, email, mobile_number, branch, branch_id]
    );

    console.log("New user created");
    res.status(201).json({ message: "User created successfully" });

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});




app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
