import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireShelterStaff } from "../middleware/auth.middleware.js";
import * as sheltersService from "../services/shelters.service.js";

const router = Router();
router.use(requireAuth, requireShelterStaff);

const updateSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    address: z.string().min(1).optional(),
});

router.get("/", async (req, res) => {
    const shelter = await sheltersService.getShelterForStaffUser(req.shelterId!);
    if (!shelter) return res.status(404).json({ error: "Shelter not found" });
    res.json(shelter);
});

router.patch("/", async (req, res) => {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const shelter = await sheltersService.updateShelterSettings(req.shelterId!, parsed.data);
    if (!shelter) return res.status(404).json({ error: "Shelter not found" });
    res.json(shelter);
});

export default router;