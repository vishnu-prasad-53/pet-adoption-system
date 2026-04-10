import express from "express";
import db from "../config/db.js";

const router = express.Router();

export const createAdminAccount = async () => {
  try {
    const [admin] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      ["admin@adopt.com"]
    );

    if (admin.length === 0) {
      await db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        ["Admin", "admin@adopt.com", "admin123", "admin"]
      );
      console.log("Admin account created");
    }
  } catch (err) {
    console.log("Error creating admin:", err);
  }
};


router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, password, "user"]
    );

    res.status(201).json({ message: "Account created successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = users[0];

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;