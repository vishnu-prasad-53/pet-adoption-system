import { eq } from "drizzle-orm";
import { db } from "./index.js";
import { species, breeds, petTags, petTagMap, pets, petImages, shelters, users } from "./schema/index.js";

async function seed() {
    const [dog] = await db.insert(species).values({ name: "Dog" }).returning();
    const [cat] = await db.insert(species).values({ name: "Cat" }).returning();
    await db.insert(species).values({ name: "Rabbit" });

    const [labrador] = await db.insert(breeds).values({ speciesId: dog.id, name: "Labrador Retriever" }).returning();
    const [mixedDog] = await db.insert(breeds).values({ speciesId: dog.id, name: "Mixed Breed" }).returning();
    const [domesticShorthair] = await db.insert(breeds).values({ speciesId: cat.id, name: "Domestic Shorthair" }).returning();

    const [seniorTag] = await db.insert(petTags).values({ name: "senior" }).returning();
    const [specialNeedsTag] = await db.insert(petTags).values({ name: "special-needs" }).returning();

    const [testUser] = await db.select().from(users).where(eq(users.email, "[email protected]"));
    if (!testUser) {
        throw new Error("No test user found — sign up via the Day 3/4 curl command first, so there's an owner for the seed shelter.");
    }

    const [shelter] = await db.insert(shelters).values({
        name: "Happy Paws Shelter",
        description: "A shelter for rescued animals",
        email: "happypaws@example.com",
        address: "Mumbai, Maharashtra",
        verificationStatus: "verified",
    }).returning();

    const [buddy] = await db.insert(pets).values({
        shelterId: shelter.id,
        name: "Buddy",
        speciesId: dog.id,
        breedId: labrador.id,
        ageYears: 3,
        gender: "male",
        size: "large",
        weightLbs: 65,
        vaccinated: true,
        houseTrained: true,
        goodWithKids: true,
        goodWithDogs: true,
        energyLevel: "high",
        description: "Buddy loves fetch and long walks.",
        status: "available",
        adoptionFee: 250,
    }).returning();

    const [whiskers] = await db.insert(pets).values({
        shelterId: shelter.id,
        name: "Whiskers",
        speciesId: cat.id,
        breedId: domesticShorthair.id,
        ageYears: 9,
        gender: "female",
        size: "medium",
        vaccinated: true,
        energyLevel: "low",
        description: "A calm senior cat looking for a quiet home.",
        status: "available",
        adoptionFee: 75,
    }).returning();
    await db.insert(petTagMap).values({ petId: whiskers.id, tagId: seniorTag.id });

    const [rex] = await db.insert(pets).values({
        shelterId: shelter.id,
        name: "Rex",
        speciesId: dog.id,
        breedId: mixedDog.id,
        ageYears: 5,
        gender: "male",
        size: "medium",
        vaccinated: true,
        description: "Rex gets around great on three legs and has tons of energy.",
        status: "available",
    }).returning();
    await db.insert(petTagMap).values({ petId: rex.id, tagId: specialNeedsTag.id });

    await db.insert(petImages).values([
        { petId: buddy.id, url: "https://placedog.net/500/400?id=1" },
        { petId: whiskers.id, url: "https://placekitten.com/500/400" },
    ]);

    console.log("Seeded:", shelter.name, "→", [buddy.name, whiskers.name, rex.name]);
}

seed().then(() => process.exit(0)).catch((err) => {
    console.error(err);
    process.exit(1);
});