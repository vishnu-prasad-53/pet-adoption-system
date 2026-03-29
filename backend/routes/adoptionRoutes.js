import express from "express";
import { applyAdoption } from "../controllers/adoptionController.js";

const router = express.Router();

router.post("/", applyAdoption);

export default router;