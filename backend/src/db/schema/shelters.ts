import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { users } from "./auth.js";

export const shelterVerificationEnum = pgEnum("shelter_verification_status", ["pending", "verified", "rejected"]);
export const shelterStaffRoleEnum = pgEnum("shelter_staff_role", ["owner", "manager", "staff"]);

export const shelters = pgTable("shelters", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    phone: text("phone"),
    email: text("email").notNull().unique(),
    logoUrl: text("logo_url"),
    address: text("address").notNull(),
    verificationStatus: shelterVerificationEnum("verification_status").notNull().default("pending"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const shelterStaff = pgTable("shelter_staff", {
    id: uuid("id").primaryKey().defaultRandom(),
    shelterId: uuid("shelter_id").notNull().references(() => shelters.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    staffRole: shelterStaffRoleEnum("staff_role").notNull().default("staff"),
    invitedAt: timestamp("invited_at").notNull().defaultNow(),
    joinedAt: timestamp("joined_at"),
});