import { pgEnum, pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["adopter", "shelter_staff", "admin"]);

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    phone: text("phone"),
    avatarUrl: text("avatar_url"),
    role: roleEnum("role").notNull().default("adopter"),
    emailVerified: boolean("email_verified").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});