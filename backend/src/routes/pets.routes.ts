import { Router } from "express";
import { requireAuth, requireShelterStaff } from "../middleware/auth.middleware.js";
import * as petsController from "../controllers/pets.controller.js";

const router = Router();
router.use(requireAuth, requireShelterStaff);

router.get("/", petsController.listPets);
router.get("/:id", petsController.getPet);
router.post("/", petsController.createPet);
router.patch("/:id", petsController.updatePet);
router.delete("/:id", petsController.deletePet);

export default router;