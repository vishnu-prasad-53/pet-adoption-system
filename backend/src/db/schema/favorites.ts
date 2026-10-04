import { pgTable, uuid, timestamp, unique } from "drizzle-orm/pg-core";
import { users } from "./auth.js";
import { pets } from "./pets.js";

export const favorites = pgTable("favorites", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    petId: uuid("pet_id").notNull().references(() => pets.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
    unique("favorites_user_pet_unique").on(table.userId, table.petId),
]);