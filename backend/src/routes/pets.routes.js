import { Router } from "express";
import { requireAuth, requireShelterStaff } from "../middleware/auth.middleware";
import * as petsController from "../controllers/pets.controller";

const router = Router();
router.use(requireAuth, requireShelterStaff);

router.get("/", petsController.listPets);
router.get("/:id", petsController.getPet);
router.post("/", petsController.createPet);
router.patch("/:id", petsController.updatePet);
router.delete("/:id", petsController.deletePet);

export default router;