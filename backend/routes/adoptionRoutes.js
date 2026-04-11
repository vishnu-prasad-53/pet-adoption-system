import express from "express";
import { applyAdoption, getAdoptions, updateAdoptionStatus } from "../controllers/adoptionController.js";

const router = express.Router();

router.post("/", applyAdoption);
router.get("/", getAdoptions);
router.put("/:id", updateAdoptionStatus);

export default router;