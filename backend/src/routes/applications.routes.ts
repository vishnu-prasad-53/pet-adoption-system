import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import * as applicationsController from "../controllers/applications.controller.js";

const router = Router();
router.use(requireAuth);

router.post("/", applicationsController.createApplication);
router.get("/mine", applicationsController.listMyApplications);
router.get("/mine/:id", applicationsController.getMyApplication);
router.patch("/:id/withdraw", applicationsController.withdrawApplication);

export default router;