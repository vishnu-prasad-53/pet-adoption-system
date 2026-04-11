import db from "../config/db.js";

export const applyAdoption = async (req, res) => {
  const { name, email, pet_id } = req.body;

  try {
    await db.query(
      "INSERT INTO adoptions (name, email, pet_id, status) VALUES (?, ?, ?, ?)",
      [name, email, pet_id, "pending"]
    );

    res.json({ message: "Application submitted!" });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getAdoptions = async (req, res) => {
  try {
    const [data] = await db.query(`
      SELECT 
        a.adoption_id AS id,
        a.name,
        a.email,
        a.status,
        p.name AS pet_name,
        p.image
      FROM adoptions a
      JOIN pets p ON a.pet_id = p.pet_id
    `);

    res.json(data);
  } catch (err) {
    console.error("Adoption fetch error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const updateAdoptionStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db.query(
      "UPDATE adoptions SET status = ? WHERE id = ?",
      [status, id]
    );

    res.json({ message: `Application ${status}` });
  } catch (err) {
    res.status(500).json(err);
  }
};