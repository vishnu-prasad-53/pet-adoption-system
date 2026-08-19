import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000",
    fetchOptions: {
        credentials: "include",
    },
    plugins: [
        inferAdditionalFields({
            user: {
                role: {
                    type: "string",
                },
            },
        }),
    ],
});

export const { useSession, signIn, signUp, signOut } = authClient;