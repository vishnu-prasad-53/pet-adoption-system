import db from "../config/db.js";

export const applyAdoption = (req, res) => {
    const { name, email, pet_id } = req.body;

    const sql = `INSERT INTO adoptions (name, email, pet_id) VALUES (?, ?, ?)`;

    db.query(sql, [name, email, pet_id], (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({ message: "Application Submitted" });
    });
}

export const approveAdoption = (req, res) => {
    const { id } = req.params;

    db.query("UPDATE adoptions SET status='approved' WHERE id=?", [id], () => {
        res.json({ message: "Approved" });
    });
}