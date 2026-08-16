import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { requireAuth, requireRole } from "./middleware/auth.middleware.js";
import petsRouter from "./routes/pets.routes.js";

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
app.use("/api/shelter/pets", petsRouter);

app.get("/", (_req, res) => {
    res.status(200).json({ success: true, message: "Pet Adoption API running" });
});

app.get("/api/me", requireAuth, (req, res) => {
    res.json({ user: req.user });
});

app.get("/api/admin-only", requireAuth, requireRole("admin"), (req, res) => {
    res.json({ message: "Admin" });
});

export default app;