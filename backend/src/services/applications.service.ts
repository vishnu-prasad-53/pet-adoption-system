import { eq, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { adoptionApplications, pets } from "../db/schema/index.js";
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
    return db.select().from(adoptionApplications).where(eq(adoptionApplications.applicantId, applicantId));
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
    return db.select().from(adoptionApplications).where(eq(adoptionApplications.shelterId, shelterId));
}

export async function getApplicationForShelter(applicationId: string, shelterId: string) {
    const [application] = await db.select().from(adoptionApplications)
        .where(and(eq(adoptionApplications.id, applicationId), eq(adoptionApplications.shelterId, shelterId)));
    return application ?? null;
}

export async function updateApplicationStatus(
    applicationId: string,
    shelterId: string,
    reviewerId: string,
    input: UpdateApplicationStatusInput
) {
    const [application] = await db.update(adoptionApplications)
        .set({ ...input, reviewedBy: reviewerId, reviewedAt: new Date() })
        .where(and(eq(adoptionApplications.id, applicationId), eq(adoptionApplications.shelterId, shelterId)))
        .returning();
    return application ?? null;
}