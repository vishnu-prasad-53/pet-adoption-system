import { pgTable, uuid, text, timestamp, unique } from "drizzle-orm/pg-core";
import { users } from "./auth.js";
import { shelters } from "./shelters.js";
import { adoptionApplications } from "./applications.js";

export const conversations = pgTable("conversations", {
    id: uuid("id").primaryKey().defaultRandom(),
    applicationId: uuid("application_id").references(() => adoptionApplications.id, { onDelete: "set null" }),
    shelterId: uuid("shelter_id").notNull().references(() => shelters.id, { onDelete: "cascade" }),
    adopterId: uuid("adopter_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
    unique("conversations_shelter_adopter_application_unique").on(table.shelterId, table.adopterId, table.applicationId),
]);

export const messages = pgTable("messages", {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
    senderId: uuid("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    readAt: timestamp("read_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});