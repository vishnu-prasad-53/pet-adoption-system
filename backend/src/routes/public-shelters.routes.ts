import { Router } from "express";
import { getPublicShelterById } from "../services/shelters.service.js";

const router = Router();

router.get("/:id", async (req, res) => {
    const shelter = await getPublicShelterById(req.params.id);
    if (!shelter) return res.status(404).json({ error: "Shelter not found" });
    res.json(shelter);
});

export default router;