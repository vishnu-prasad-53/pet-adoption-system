import { eq, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { pets } from "../db/schema/index.js";
import type { CreatePetInput, UpdatePetInput } from "../schemas/pets.schema.js";

export async function listPetsForShelter(shelterId: string) {
    return db.select().from(pets).where(eq(pets.shelterId, shelterId));
}

export async function getPetById(shelterId: string, petId: string) {
    const [pet] = await db.select().from(pets).where(and(eq(pets.id, petId), eq(pets.shelterId, shelterId)));
    return pet ?? null;
}

export async function createPet(shelterId: string, input: CreatePetInput) {
    const [pet] = await db.insert(pets).values({
        ...input,
        shelterId,
        weightLbs: input.weightLbs,
        adoptionFee: input.adoptionFee,
    }).returning();

    return pet;
}

export async function updatePet(shelterId: string, petId: string, input: UpdatePetInput) {
    const [pet] = await db.update(pets).set({
        ...input,
        weightLbs: input.weightLbs,
        adoptionFee: input.adoptionFee,
        updatedAt: new Date(),
    })
        .where(and(eq(pets.id, petId), eq(pets.shelterId, shelterId)))
        .returning();
    return pet ?? null;
}

export async function deletePet(shelterId: string, petId: string) {
    const [pet] = await db.delete(pets)
        .where(and(eq(pets.id, petId), eq(pets.shelterId, shelterId)))
        .returning();
    return pet ?? null;
}