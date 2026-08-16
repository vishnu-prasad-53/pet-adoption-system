import type { Request, Response } from "express";
import { createPetSchema, updatePetSchema } from "../schemas/pets.schema.js";
import * as petsService from "../services/pets.service.js";

export async function listPets(req: Request, res: Response) {
    res.json(await petsService.listPetsForShelter(req.shelterId!));
}

export async function getPet(req: Request, res: Response) {
    const pet = await petsService.getPetById(req.shelterId!, String(req.params.id));

    if (!pet) return res.status(404).json({ error: "Pet not found" });
    
    res.json(pet);
}

export async function createPet(req: Request, res: Response) {
    const parsed = createPetSchema.safeParse(req.body);

    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    
    res.status(201).json(await petsService.createPet(req.shelterId!, parsed.data));
}

export async function updatePet(req: Request, res: Response) {
    const parsed = updatePetSchema.safeParse(req.body);
    
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    
    const pet = await petsService.updatePet(req.shelterId!, String(req.params.id), parsed.data);
    
    if (!pet) return res.status(404).json({ error: "Pet not found" });
    
    res.json(pet);
}

export async function deletePet(req: Request, res: Response) {
    const pet = await petsService.deletePet(req.shelterId!, String(req.params.id));
    
    if (!pet) return res.status(404).json({ error: "Pet not found" });
    
    res.status(204).send();
}