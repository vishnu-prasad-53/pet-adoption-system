import { eq, and, inArray } from "drizzle-orm";
import { db } from "../db/index.js";
import { favorites, pets, petImages } from "../db/schema/index.js";

export async function addFavorite(userId: string, petId: string) {
    const [favorite] = await db.insert(favorites)
        .values({ userId, petId })
        .onConflictDoNothing()
        .returning();

    if (favorite) return favorite;

    const [existing] = await db.select().from(favorites)
        .where(and(eq(favorites.userId, userId), eq(favorites.petId, petId)));
    return existing;
}

export async function removeFavorite(userId: string, petId: string) {
    await db.delete(favorites).where(and(eq(favorites.userId, userId), eq(favorites.petId, petId)));
}

export async function listFavoritesForUser(userId: string) {
    const userFavorites = await db.select({
        id: favorites.id,
        petId: favorites.petId,
        createdAt: favorites.createdAt,
        petName: pets.name,
        petStatus: pets.status,
    })
        .from(favorites)
        .innerJoin(pets, eq(favorites.petId, pets.id))
        .where(eq(favorites.userId, userId));

    const petIds = userFavorites.map((f) => f.petId);
    const images = petIds.length > 0 ? await db.select().from(petImages).where(inArray(petImages.petId, petIds)) : [];
    const firstImageByPetId = new Map<string, string>();
    for (const img of images) {
        if (!firstImageByPetId.has(img.petId)) firstImageByPetId.set(img.petId, img.url);
    }

    return userFavorites.map((f) => ({ ...f, petThumbnailUrl: firstImageByPetId.get(f.petId) ?? null }));
}