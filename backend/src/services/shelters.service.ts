import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { shelters } from "../db/schema/index.js";

export async function getPublicShelterById(shelterId: string) {
    const [shelter] = await db.select({
        id: shelters.id,
        name: shelters.name,
        slug: shelters.slug,
        description: shelters.description,
        phone: shelters.phone,
        email: shelters.email,
        logoUrl: shelters.logoUrl,
        address: shelters.address,
    }).from(shelters).where(eq(shelters.id, shelterId));
    return shelter ?? null;
}