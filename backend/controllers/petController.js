import db from "../config/db.js";

export const getPets = async (req, res) => {
  try {
    const [result] = await db.query("SELECT pet_id AS id, name, age, breed, image FROM pets");
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const addPet = async (req, res) => {
  const { name, age, breed, role } = req.body;
  const image = req.file ? req.file.filename : null;

  if (role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    await db.query(
      "INSERT INTO pets (name, age, breed, image) VALUES (?, ?, ?, ?)",
      [name, age, breed, image]
    );
    res.json({ message: "Pet added successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deletePet = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM pets WHERE pet_id = ?", [id]);
    res.json({ message: "Pet deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updatePet = async (req, res) => {
  const { id } = req.params;
  const { name, age, breed, image } = req.body;

  try {
    await db.query(
      "UPDATE pets SET name=?, age=?, breed=?, image=? WHERE pet_id=?",
      [name, age, breed, image, id]
    );

    res.json({ message: "Pet updated successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
};