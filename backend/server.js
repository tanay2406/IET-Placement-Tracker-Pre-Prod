require('dotenv').config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const Razorpay = require('razorpay');
const crypto = require('crypto');
const sendSubscriptionEmail = require("./sendEmail");

const app = express();
const PORT = 5000;

// Allow frontend to connect
app.use(cors());

// Allow JSON data
app.use(express.json());
console.log("🔥 THIS SERVER FILE IS RUNNING 🔥");
// razorpay instance
const razorpay = new Razorpay({
  key_id: 'rzp_test_SHKfz1fL2NiSh3',
  key_secret: 'g0Rb9MwFQfbVHxgXrAhYVzBl'
});

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
      "SELECT user_id FROM users WHERE google_id = $1",
      [sub]
    );

    if (existingUser.rows.length > 0) {
      console.log("User already exists");
      return res.json({ message: "User already created" });
    }

    await pool.query(
      `INSERT INTO users
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
})





app.post("/api/makeSubscription", async (req, res) => {
  const {
    sub,
    company_id,
    subscription_type,
    transaction_id,
  } = req.body;

  try {
    const userResult = await pool.query(
      "SELECT user_id,email,name FROM users WHERE google_id = $1",
      [sub]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user_id = userResult.rows[0].user_id;
    const email = userResult.rows[0].email;
    const name = userResult.rows[0].name;
    // 1️⃣ Check if already subscribed
    const existingSubscription = await pool.query(
      `SELECT subscription_id FROM user_subscriptions 
       WHERE user_id = $1 
       AND company_id = $2 
       AND subscription_type = $3`,
      [user_id, company_id, subscription_type]
    );

    if (existingSubscription.rows.length > 0) {
      console.log("User already subscribed to this company");
      return res.json({ message: "Already subscribed" });
    }

    // 2️⃣ Insert new subscription
    await pool.query(
      `INSERT INTO user_subscriptions
      (user_id, company_id, subscription_type, transaction_id)
      VALUES ($1, $2, $3, $4)`,
      [user_id, company_id, subscription_type, transaction_id]
    );

    console.log("Subscription created successfully");
    // 3️⃣ Send confirmation email
    await sendSubscriptionEmail(email, name);
    res.status(201).json({ message: "Subscription successful" });

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// api to check if the person is subscribed or not
app.post("/api/isSubscription", async (req, res) => {
  const { sub, company_id, subscription_type } = req.body;

  try {

    // Step 1: Get user_id from google_id
    const userResult = await pool.query(
      "SELECT user_id FROM users WHERE google_id = $1",
      [sub]
    );

    if (userResult.rows.length === 0) {
      return res.json({ isSubscribed: false });
    }

    const user_id = userResult.rows[0].user_id;

    // Step 2: Check subscription in user_subscriptions table
    const subscriptionResult = await pool.query(
      `SELECT subscription_id ,is_active FROM user_subscriptions 
       WHERE user_id = $1 
       AND company_id = $2 
       AND subscription_type = $3`,
      [user_id, company_id, subscription_type]
    );

    // Step 3: Return true if exists
    if (subscriptionResult.rows.length > 0 && subscriptionResult.rows[0].is_active) {
      return res.json({ isSubscribed: true });
    }

    res.json({ isSubscribed: false });

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/getUserSubscriptions", async (req, res) => {
  const { sub } = req.body;
  // console.log(sub);
  // console.log(typeof(sub));
  try {
    // Get user_id from google_id
    const userResult = await pool.query(
      "SELECT user_id FROM users WHERE google_id = $1",
      [sub]
    );

    if (userResult.rows.length === 0) {
      return res.json({ subscriptions: [] });
    }

    const user_id = userResult.rows[0].user_id;

    // Get all subscriptions for this user
    const subscriptionResult = await pool.query(
      `SELECT company_id, subscription_type
       FROM user_subscriptions
       WHERE user_id = $1`,
      [user_id]
    );

    res.json({
      subscriptions: subscriptionResult.rows
    });

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// for the razor pay order creation
app.post('/api/create-order', async (req, res) => {
  const { company_id, package_type } = req.body;

  if (!company_id || !package_type) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // 1️⃣ Get package from DB
    const result = await pool.query(
      `SELECT package_id, amount, package_type 
       FROM packages 
       WHERE company_id = $1 AND package_type = $2 AND is_active = true`,
      [company_id, package_type]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid package" });
    }

    const packageData = result.rows[0];

    // 2️⃣ Create Razorpay order
    const options = {
      amount: packageData.amount * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    // 3️⃣ Send order details to frontend
    res.json({
      orderId: order.id,
      amount: packageData.amount * 100,
      currency: "INR",
      key: 'rzp_test_SHKfz1fL2NiSh3',
      package_id: packageData.package_id
    });

  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ error: "Order creation failed" });
  }
});


app.post("/api/verify-payment", async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    package_id,
    sub,
    subscription_type,
    company_id
  } = req.body;
console.log("Incoming body:", req.body);
console.log("Google ID received:", sub);
  try {
    // 🔹 Always get user_id first
    const user = await pool.query(
      "SELECT user_id FROM users WHERE google_id = $1",
      [sub]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user_id = user.rows[0].user_id;

    // 🔹 PAID FLOW
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", "g0Rb9MwFQfbVHxgXrAhYVzBl")
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    await pool.query(
      `INSERT INTO user_subscriptions
       (user_id, transaction_id, subscription_type, company_id)
       VALUES ($1, $2, $3, $4)`,
      [user_id, razorpay_payment_id, subscription_type, company_id]
    );

    res.json({ message: "Payment verified & subscription added" });

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});


// test tanay code 
app.post("/api/getUserSubscriptions", async (req, res) => {
  const { sub } = req.body;
  console.log(sub);
  console.log(typeof(sub));
  try {
    // Get user_id from google_id
    const userResult = await pool.query(
      "SELECT user_id FROM users WHERE google_id = $1",
      [sub]
    );

    if (userResult.rows.length === 0) {
      return res.json({ subscriptions: [] });
    }

    const user_id = userResult.rows[0].user_id;

    // Get all subscriptions for this user
    const subscriptionResult = await pool.query(
      `SELECT company_id, subscription_type
       FROM user_subscriptions
       WHERE user_id = $1`,
      [user_id]
    );

    res.json({
      subscriptions: subscriptionResult.rows
    });

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
