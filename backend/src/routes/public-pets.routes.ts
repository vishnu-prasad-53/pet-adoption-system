import { Router } from "express";
import { z } from "zod";
import * as petsService from "../services/pets.service.js";

const router = Router();

const booleanFlag = z.string().optional().transform((v) => v === "true");

const searchQuerySchema = z.object({
    speciesId: z.string().uuid().optional(),
    breedId: z.string().uuid().optional(),
    gender: z.enum(["male", "female"]).optional(),
    size: z.enum(["small", "medium", "large", "xlarge"]).optional(),
    energyLevel: z.enum(["low", "medium", "high"]).optional(),
    goodWithKids: booleanFlag,
    goodWithDogs: booleanFlag,
    goodWithCats: booleanFlag,
    minAge: z.coerce.number().int().min(0).optional(),
    maxAge: z.coerce.number().int().min(0).optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(50).optional(),
    lat: z.coerce.number().optional(),
    lng: z.coerce.number().optional(),
    radiusKm: z.coerce.number().positive().optional(),
});

router.get("/", async (req, res) => {
    const parsed = searchQuerySchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    res.json(await petsService.searchPublicPets(parsed.data));
});

router.get("/:id", async (req, res) => {
    const pet = await petsService.getPublicPetById(req.params.id);
    if (!pet) return res.status(404).json({ error: "Pet not found" });
    res.json(pet);
});

export default router;