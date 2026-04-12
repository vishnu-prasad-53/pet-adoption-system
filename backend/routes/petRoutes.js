import express from "express";
import { getPets, addPet, deletePet, updatePet } from "../controllers/petController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getPets);
router.post("/", upload.single("image"), addPet);
router.delete("/:id", deletePet);
router.put("/:id", updatePet); 

export default router;