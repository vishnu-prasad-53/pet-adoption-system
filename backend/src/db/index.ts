import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { ENV } from "../config/env.js";
import * as schema from "./schema/index.js";

const pool = new Pool({
    connectionString: ENV.DATABASE_URL,
});

export const db = drizzle({ client: pool, schema });