import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { species, breeds } from "../db/schema/index.js";

const router = Router();

router.get("/species", async (_req, res) => {
    res.json(await db.select().from(species));
});

router.get("/breeds", async (req, res) => {
    const speciesId = req.query.speciesId as string | undefined;
    if (speciesId) {
        return res.json(await db.select().from(breeds).where(eq(breeds.speciesId, speciesId)));
    }
    res.json(await db.select().from(breeds));
});

export default router;