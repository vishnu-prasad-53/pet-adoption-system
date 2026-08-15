import { pgTable, pgEnum, uuid, text, integer, boolean, doublePrecision, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { shelters } from "./shelters.js";

export const genderEnum = pgEnum("gender", ["male", "female"]);
export const sizeEnum = pgEnum("size", ["small", "medium", "large", "xlarge"]);
export const energyLevelEnum = pgEnum("energy_level", ["low", "medium", "high"]);
export const petStatusEnum = pgEnum("pet_status", ["available", "pending", "adopted", "fostered", "medical_hold", "not_available", "returned"]);

export const species = pgTable("species", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
});

export const breeds = pgTable("breeds", {
    id: uuid("id").primaryKey().defaultRandom(),
    speciesId: uuid("species_id").notNull().references(() => species.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
});

export const pets = pgTable("pets", {
    id: uuid("id").primaryKey().defaultRandom(),
    shelterId: uuid("shelter_id").notNull().references(() => shelters.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    speciesId: uuid("species_id").notNull().references(() => species.id, { onDelete: "cascade" }),
    breedId: uuid("breed_id").references(() => breeds.id, { onDelete: "cascade" }),
    ageYears: integer("age_years"),
    ageMonths: integer("age_months"),
    gender: genderEnum("gender").notNull(),
    size: sizeEnum("size"),
    weightLbs: doublePrecision("weight_lbs"),
    color: text("color"),
    vaccinated: boolean("vaccinated").notNull().default(false),
    houseTrained: boolean("house_trained").notNull().default(false),
    goodWithKids: boolean("good_with_kids"),
    goodWithDogs: boolean("good_with_dogs"),
    goodWithCats: boolean("good_with_cats"),
    energyLevel: energyLevelEnum("energy_level"),
    description: text("description"),
    status: petStatusEnum("status").notNull().default("available"),
    adoptionFee: doublePrecision("adoption_fee"),
    intakeDate: timestamp("intake_date").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const petImages = pgTable("pet_images", {
    id: uuid("id").primaryKey().defaultRandom(),
    petId: uuid("pet_id").notNull().references(() => pets.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const petTags = pgTable("pet_tags", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
});

export const petTagMap = pgTable("pet_tag_map", {
    petId: uuid("pet_id").notNull().references(() => pets.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id").notNull().references(() => petTags.id, { onDelete: "cascade" }),
}, (table) => ({
    pk: primaryKey({ columns: [table.petId, table.tagId] }),
}));