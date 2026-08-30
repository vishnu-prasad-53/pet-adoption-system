import { and, eq, gte, lte, ilike, inArray, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { pets } from "../db/schema/index.js";
import type { CreatePetInput, UpdatePetInput } from "../schemas/pets.schema.js";
import { petImages } from "../db/schema/index.js";
import { findShelterIdsNearby } from "./shelters.service.js";

export type PetSearchFilters = {
    speciesId?: string;
    breedId?: string;
    gender?: "male" | "female";
    size?: "small" | "medium" | "large" | "xlarge";
    energyLevel?: "low" | "medium" | "high";
    goodWithKids?: boolean;
    goodWithDogs?: boolean;
    goodWithCats?: boolean;
    minAge?: number;
    maxAge?: number;
    search?: string;
    page?: number;
    limit?: number;
    lat?: number;
    lng?: number;
    radiusKm?: number;
};

export async function listPetsForShelter(shelterId: string) {
    return db.select().from(pets).where(eq(pets.shelterId, shelterId));
}

export async function getPetById(shelterId: string, petId: string) {
    const [pet] = await db.select().from(pets).where(and(eq(pets.id, petId), eq(pets.shelterId, shelterId)));
    if (!pet) return null;
    const images = await db.select().from(petImages).where(eq(petImages.petId, petId));
    return { ...pet, images };
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

export async function searchPublicPets(filters: PetSearchFilters) {
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 && filters.limit <= 50 ? filters.limit : 12;
    const offset = (page - 1) * limit;

    const conditions = [eq(pets.status, "available")];
    if (filters.speciesId) conditions.push(eq(pets.speciesId, filters.speciesId));
    if (filters.breedId) conditions.push(eq(pets.breedId, filters.breedId));
    if (filters.gender) conditions.push(eq(pets.gender, filters.gender));
    if (filters.size) conditions.push(eq(pets.size, filters.size));
    if (filters.energyLevel) conditions.push(eq(pets.energyLevel, filters.energyLevel));
    if (filters.goodWithKids) conditions.push(eq(pets.goodWithKids, true));
    if (filters.goodWithDogs) conditions.push(eq(pets.goodWithDogs, true));
    if (filters.goodWithCats) conditions.push(eq(pets.goodWithCats, true));
    if (filters.minAge !== undefined) conditions.push(gte(pets.ageYears, filters.minAge));
    if (filters.maxAge !== undefined) conditions.push(lte(pets.ageYears, filters.maxAge));
    if (filters.search) conditions.push(ilike(pets.name, `%${filters.search}%`));
    if (filters.lat !== undefined && filters.lng !== undefined && filters.radiusKm !== undefined) {
        const nearbyShelterIds = await findShelterIdsNearby(filters.lat, filters.lng, filters.radiusKm);
        if (nearbyShelterIds.length === 0) {
            return { items: [], pagination: { page, limit, total: 0, totalPages: 0 } };
        }
        conditions.push(inArray(pets.shelterId, nearbyShelterIds));
    }

    const where = and(...conditions);

    const [items, totalResult] = await Promise.all([
        db.select().from(pets).where(where).limit(limit).offset(offset),
        db.select({ count: sql<number>`count(*)::int` }).from(pets).where(where),
    ]);

    const petIds = items.map((p) => p.id);
    const images = petIds.length > 0
        ? await db.select().from(petImages).where(inArray(petImages.petId, petIds))
        : [];
    const firstImageByPetId = new Map<string, string>();
    for (const img of images) {
        if (!firstImageByPetId.has(img.petId)) firstImageByPetId.set(img.petId, img.url);
    }

    const total = Number(totalResult[0]?.count ?? 0);

    return {
        items: items.map((pet) => ({ ...pet, thumbnailUrl: firstImageByPetId.get(pet.id) ?? null })),
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
}

export async function getPublicPetById(petId: string) {
    const [pet] = await db.select().from(pets).where(and(eq(pets.id, petId), eq(pets.status, "available")));
    if (!pet) return null;
    const images = await db.select().from(petImages).where(eq(petImages.petId, petId));
    return { ...pet, images };
}