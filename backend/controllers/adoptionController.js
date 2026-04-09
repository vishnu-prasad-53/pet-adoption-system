import db from "../config/db.js";

export const applyAdoption = async (req, res) => {
  const { name, email, pet_id } = req.body;
  try {
    await db.query(
      "INSERT INTO adoptions (name, email, pet_id) VALUES (?, ?, ?)",
      [name, email, pet_id]
    );
    res.json({ message: "Application Submitted" });
  } catch (err) {
    res.status(500).json(err);
  }
};