import express from "express";
import { applyAdoption, getAdoptions, updateAdoptionStatus } from "../controllers/adoptionController.js";
import { getUserAdoptions } from "../controllers/adoptionController.js";

const router = express.Router();

router.post("/", applyAdoption);
router.get("/", getAdoptions);
router.put("/:id", updateAdoptionStatus);
router.get("/user/:email", getUserAdoptions);

export default router;