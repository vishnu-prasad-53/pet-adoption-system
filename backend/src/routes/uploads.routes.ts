import { Router } from "express";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { pets, petImages } from "../db/schema/index.js";
import { requireAuth, requireShelterStaff } from "../middleware/auth.middleware.js";
import { upload } from "../lib/storage.js";

const router = Router();
router.use(requireAuth, requireShelterStaff);

const uploadFieldsSchema = z.object({
    petId: z.string().uuid()
});

router.post("/", (req, res, next) => {
    upload.single("file")(req, res, (err) => {
        if (err) return res.status(400).json({ error: err.message });
        next();
    });
}, async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const parsed = uploadFieldsSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
    }
    const { petId } = parsed.data;

    const [pet] = await db.select().from(pets)
        .where(and(eq(pets.id, petId), eq(pets.shelterId, req.shelterId!)));
    if (!pet) {
        return res.status(404).json({ error: "Pet not found" });
    }

    const url = `/uploads/${req.file.filename}`;
    const [image] = await db.insert(petImages).values({
        petId,
        url,
    }).returning();

    res.status(201).json(image);
});

export default router;