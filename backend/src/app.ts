import express from "express";

const app = express();

app.get("/", (_req, res) => {
    res.status(200).json({ success: true, message: "Pet Adoption API running" });
});

export default app;