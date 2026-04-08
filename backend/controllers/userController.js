import db from "../config/db.js";

export const registerUser = (req, res) => {
    const { name, email, password } = req.body;

    db.query("INSERT INTO users (name, email, password) VALUES(?, ?, ?)", [name, email, password], (err) => {
        if(err) return res.status(500).json(err);
        res.json({ message: "User registered" });
    });
}

export const loginUser = (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email=? AND password=?", [email, password], (err, result) => {
        if(err) return res.status(500).json(err);
        if(result.length > 0) {
            res.json({ message: "Login success" });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    });
}