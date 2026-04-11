import express from "express";
import { getPets, addPet, deletePet, updatePet } from "../controllers/petController.js";

const router = express.Router();

router.get("/", getPets);
router.post("/", addPet);
router.delete("/:id", deletePet);
router.put("/:id", updatePet); 

export default router;