import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.middleware.js";
import * as favoritesService from "../services/favorites.service.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
    res.json(await favoritesService.listFavoritesForUser(req.user!.id));
});

const addFavoriteSchema = z.object({ petId: z.string().uuid() });

router.post("/", async (req, res) => {
    const parsed = addFavoriteSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const favorite = await favoritesService.addFavorite(req.user!.id, parsed.data.petId);
    res.status(201).json(favorite);
});

router.delete("/:petId", async (req, res) => {
    await favoritesService.removeFavorite(req.user!.id, req.params.petId);
    res.status(204).send();
});

export default router;