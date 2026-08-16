import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "./index.js";
import { users, shelters, shelterStaff } from "./schema/index.js";

async function fix() {
  const [testUser] = await db.select().from(users).where(eq(users.email, "[email protected]"));
  const [shelter] = await db.select().from(shelters).where(eq(shelters.slug, "sunny-acres-rescue"));
  if (!testUser || !shelter) throw new Error("Run this after Day 7's seed, not before.");

  await db.insert(shelterStaff).values({
    shelterId: shelter.id,
    userId: testUser.id,
    staffRole: "owner",
    joinedAt: new Date(),
  });
  console.log("Linked", testUser.email, "to", shelter.name, "as owner");
}
fix().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });