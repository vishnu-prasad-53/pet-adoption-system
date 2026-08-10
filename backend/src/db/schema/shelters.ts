import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { users } from "./auth.js";

export const shelters = pgTable("shelters", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    address: text("address").notNull(),
    phone: text("phone"),
    email: text("email").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const shelterStaff = pgTable("shelter_staff", {
    id: serial("id").primaryKey(),
    shelterId: integer("shelter_id").notNull().references(() => shelters.id, { onDelete: "cascade" }),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});