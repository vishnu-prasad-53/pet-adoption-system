import { pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["adopter", "shelter_staff", "admin"]);

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    phone: text("phone"),
    avatarUrl: text("avatar_url"),
    role: roleEnum("role").notNull().default("adopter"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});