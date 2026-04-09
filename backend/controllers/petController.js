import db from "../config/db.js";

export const getPets = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM pets");
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const addPet = async (req, res) => {
  const { name, age, breed } = req.body;
  try {
    await db.query("INSERT INTO pets (name, age, breed) VALUES (?, ?, ?)", [name, age, breed]);
    res.json({ message: "Pet added successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
};