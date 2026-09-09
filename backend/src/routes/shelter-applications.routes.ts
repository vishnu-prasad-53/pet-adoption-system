import { Router } from "express";
import { requireAuth, requireShelterStaff } from "../middleware/auth.middleware.js";
import * as applicationsController from "../controllers/applications.controller.js";

const router = Router();
router.use(requireAuth, requireShelterStaff);

router.get("/", applicationsController.listShelterApplications);
router.get("/:id", applicationsController.getShelterApplication);
router.patch("/:id", applicationsController.updateApplicationStatus);

export default router;