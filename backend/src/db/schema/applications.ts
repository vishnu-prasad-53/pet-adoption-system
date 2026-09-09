import { pgTable, pgEnum, uuid, jsonb, text, timestamp } from "drizzle-orm/pg-core";
import { pets } from "./pets.js";
import { shelters } from "./shelters.js";
import { users } from "./auth.js";

export const applicationStatusEnum = pgEnum("application_status", [
    "submitted", "under_review", "interview_scheduled", "approved", "rejected", "withdrawn",
]);

export const adoptionApplications = pgTable("adoption_applications", {
    id: uuid("id").primaryKey().defaultRandom(),
    petId: uuid("pet_id").notNull().references(() => pets.id, { onDelete: "cascade" }),
    applicantId: uuid("applicant_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    shelterId: uuid("shelter_id").notNull().references(() => shelters.id, { onDelete: "cascade" }),
    status: applicationStatusEnum("status").notNull().default("submitted"),
    formData: jsonb("form_data").notNull(),
    decisionNotes: text("decision_notes"),
    submittedAt: timestamp("submitted_at").notNull().defaultNow(),
    reviewedBy: uuid("reviewed_by").references(() => users.id),
    reviewedAt: timestamp("reviewed_at"),
});