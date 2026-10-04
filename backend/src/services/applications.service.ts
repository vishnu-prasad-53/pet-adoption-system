import { eq, and, inArray } from "drizzle-orm";
import { db } from "../db/index.js";
import { adoptionApplications, pets, petImages, users } from "../db/schema/index.js";
import type { CreateApplicationInput, UpdateApplicationStatusInput } from "../schemas/applications.schema.js";

export class ApplicationError extends Error {
    constructor(message: string, public statusCode: number) {
        super(message);
    }
}

export async function createApplication(applicantId: string, input: CreateApplicationInput) {
    const [pet] = await db.select().from(pets).where(eq(pets.id, input.petId));
    if (!pet) throw new ApplicationError("Pet not found", 404);
    if (pet.status !== "available") throw new ApplicationError("This pet is no longer available for adoption", 409);

    const [application] = await db.insert(adoptionApplications).values({
        petId: input.petId,
        applicantId,
        shelterId: pet.shelterId,
        formData: input.formData,
    }).returning();

    return application;
}

export async function listApplicationsForApplicant(applicantId: string) {
    const applications = await db.select({
        id: adoptionApplications.id,
        petId: adoptionApplications.petId,
        applicantId: adoptionApplications.applicantId,
        shelterId: adoptionApplications.shelterId,
        status: adoptionApplications.status,
        formData: adoptionApplications.formData,
        decisionNotes: adoptionApplications.decisionNotes,
        submittedAt: adoptionApplications.submittedAt,
        reviewedAt: adoptionApplications.reviewedAt,
        petName: pets.name,
    })
        .from(adoptionApplications)
        .innerJoin(pets, eq(adoptionApplications.petId, pets.id))
        .where(eq(adoptionApplications.applicantId, applicantId));

    const petIds = applications.map((a) => a.petId);
    const images = petIds.length > 0 ? await db.select().from(petImages).where(inArray(petImages.petId, petIds)) : [];
    const firstImageByPetId = new Map<string, string>();
    for (const img of images) {
        if (!firstImageByPetId.has(img.petId)) firstImageByPetId.set(img.petId, img.url);
    }

    return applications.map((app) => ({ ...app, petThumbnailUrl: firstImageByPetId.get(app.petId) ?? null }));
}

export async function getApplicationForApplicant(applicationId: string, applicantId: string) {
    const [application] = await db.select().from(adoptionApplications)
        .where(and(eq(adoptionApplications.id, applicationId), eq(adoptionApplications.applicantId, applicantId)));
    return application ?? null;
}

export async function withdrawApplication(applicationId: string, applicantId: string) {
    const [application] = await db.update(adoptionApplications)
        .set({ status: "withdrawn" })
        .where(and(eq(adoptionApplications.id, applicationId), eq(adoptionApplications.applicantId, applicantId)))
        .returning();
    return application ?? null;
}

export async function listApplicationsForShelter(shelterId: string) {
    return db.select({
        id: adoptionApplications.id,
        petId: adoptionApplications.petId,
        applicantId: adoptionApplications.applicantId,
        shelterId: adoptionApplications.shelterId,
        status: adoptionApplications.status,
        formData: adoptionApplications.formData,
        decisionNotes: adoptionApplications.decisionNotes,
        submittedAt: adoptionApplications.submittedAt,
        reviewedAt: adoptionApplications.reviewedAt,
        petName: pets.name,
        applicantName: users.name,
        applicantEmail: users.email,
    })
        .from(adoptionApplications)
        .innerJoin(pets, eq(adoptionApplications.petId, pets.id))
        .innerJoin(users, eq(adoptionApplications.applicantId, users.id))
        .where(eq(adoptionApplications.shelterId, shelterId));
}

export async function getApplicationForShelter(applicationId: string, shelterId: string) {
    const [application] = await db.select({
        id: adoptionApplications.id,
        petId: adoptionApplications.petId,
        applicantId: adoptionApplications.applicantId,
        shelterId: adoptionApplications.shelterId,
        status: adoptionApplications.status,
        formData: adoptionApplications.formData,
        decisionNotes: adoptionApplications.decisionNotes,
        submittedAt: adoptionApplications.submittedAt,
        reviewedAt: adoptionApplications.reviewedAt,
        petName: pets.name,
        applicantName: users.name,
        applicantEmail: users.email,
    })
        .from(adoptionApplications)
        .innerJoin(pets, eq(adoptionApplications.petId, pets.id))
        .innerJoin(users, eq(adoptionApplications.applicantId, users.id))
        .where(and(eq(adoptionApplications.id, applicationId), eq(adoptionApplications.shelterId, shelterId)));
    return application ?? null;
}

export async function updateApplicationStatus(
    applicationId: string,
    shelterId: string,
    reviewerId: string,
    input: UpdateApplicationStatusInput
) {
    return db.transaction(async (tx) => {
        const [application] = await tx.update(adoptionApplications)
            .set({ ...input, reviewedBy: reviewerId, reviewedAt: new Date() })
            .where(and(eq(adoptionApplications.id, applicationId), eq(adoptionApplications.shelterId, shelterId)))
            .returning();

        if (!application) {
            throw new ApplicationError("Application not found", 404);
        }

        if (input.status === "approved") {
            await tx.update(pets)
                .set({ status: "pending", updatedAt: new Date() })
                .where(eq(pets.id, application.petId));
        }

        return application;
    });
}