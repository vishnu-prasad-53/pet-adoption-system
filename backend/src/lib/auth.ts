import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { ENV } from "../config/env.js";
import { db } from "../db/index.js";
import * as schema from "../db/schema/index.js";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
        usePlural: true,
    }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        fields: {
            image: "avatarUrl",
        },
        additionalFields: {
            role: {
                type: "string",
                input: false,
                defaultValue: "adopter",
            },
        },
    },
    secret: ENV.BETTER_AUTH_SECRET,
    baseURL: ENV.BETTER_AUTH_URL,
})