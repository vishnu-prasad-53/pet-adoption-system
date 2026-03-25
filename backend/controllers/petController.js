import db from "../config/db.js";

export const getPets = (req, res) => {
  db.query("SELECT * FROM pets", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

export const addPet = (req, res) => {
  const { name, age, breed } = req.body;

  const sql = "INSERT INTO pets (name, age, breed) VALUES (?, ?, ?)";
  db.query(sql, [name, age, breed], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Pet added successfully" });
  });
};