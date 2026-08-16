import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { shelterStaff } from "../db/schema/index.js";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    if (!session)
        return res.status(401).json({ error: "Unauthorized" });

    req.user = session.user;
    next();
};

export function requireRole(...allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !allowedRoles.includes(req.user.role))
            return res.status(403).json({ error: "Forbidden" });

        next();
    };
};

export async function requireShelterStaff(req: Request, res: Response, next: NextFunction) {
    if (!req.user || req.user.role !== "shelter_staff") {
        return res.status(403).json({ error: "Forbidden" });
    }

    const [staffRow] = await db.select().from(shelterStaff).where(eq(shelterStaff.userId, req.user.id)).limit(1);

    if (!staffRow) {
        return res.status(403).json({ error: "No shelter associated with this account" });
    }

    req.shelterId = staffRow.shelterId;
    next();
}