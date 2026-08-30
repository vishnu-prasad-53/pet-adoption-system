import { eq, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { shelters } from "../db/schema/index.js";
import { geocodeAddress } from "../lib/geocoding.js";

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

export async function getShelterForStaffUser(shelterId: string) {
    const [shelter] = await db.select().from(shelters).where(eq(shelters.id, shelterId));
    return shelter ?? null;
}

export async function updateShelterSettings(shelterId: string, input: {
    name?: string; description?: string; phone?: string; email?: string; address?: string;
}) {
    const updates: Record<string, unknown> = { ...input, updatedAt: new Date() };

    if (input.address) {
        const [current] = await db.select({ address: shelters.address }).from(shelters).where(eq(shelters.id, shelterId));
        if (current?.address !== input.address) {
            const coords = await geocodeAddress(input.address);
            if (coords) {
                updates.lat = coords.lat.toString();
                updates.lng = coords.lng.toString();
            }
        }
    }

    const [shelter] = await db.update(shelters).set(updates).where(eq(shelters.id, shelterId)).returning();
    return shelter ?? null;
}

export async function findShelterIdsNearby(lat: number, lng: number, radiusKm: number): Promise<string[]> {
    const result = await db.execute(sql`
    SELECT id FROM shelters
    WHERE lat IS NOT NULL AND lng IS NOT NULL
    AND earth_distance(ll_to_earth(lat, lng), ll_to_earth(${lat}, ${lng})) <= ${radiusKm * 1000}
  `);
    return result.rows.map((row: any) => row.id);
}