import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.middleware.js";
import { getShelterIdForStaffUser } from "../services/shelters.service.js";
import * as messagesService from "../services/messages.service.js";
import { MessagingError } from "../services/messages.service.js";

const router = Router();
router.use(requireAuth);

router.post("/start", async (req, res) => {
    const schema = z.object({ applicationId: z.string().uuid() });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    try {
        const conversation = await messagesService.startConversationForApplication(req.user!.id, parsed.data.applicationId);
        res.status(201).json(conversation);
    } catch (err) {
        if (err instanceof MessagingError) return res.status(err.statusCode).json({ error: err.message });
        throw err;
    }
});

router.get("/", async (req, res) => {
    if (req.user!.role === "shelter_staff") {
        const shelterId = await getShelterIdForStaffUser(req.user!.id);
        if (!shelterId) return res.json([]);
        return res.json(await messagesService.listConversationsForShelter(shelterId));
    }
    res.json(await messagesService.listConversationsForAdopter(req.user!.id));
});

router.get("/:id/messages", async (req, res) => {
    try {
        res.json(await messagesService.listMessages(req.params.id, req.user!.id, req.user!.role));
    } catch (err) {
        if (err instanceof MessagingError) return res.status(err.statusCode).json({ error: err.message });
        throw err;
    }
});

const sendMessageSchema = z.object({ content: z.string().min(1) });

router.post("/:id/messages", async (req, res) => {
    const parsed = sendMessageSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    try {
        const message = await messagesService.sendMessage(req.params.id, req.user!.id, req.user!.role, parsed.data.content);
        res.status(201).json(message);
    } catch (err) {
        if (err instanceof MessagingError) return res.status(err.statusCode).json({ error: err.message });
        throw err;
    }
});

export default router;