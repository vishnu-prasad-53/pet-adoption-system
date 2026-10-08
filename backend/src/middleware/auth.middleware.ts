import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";
import { getShelterIdForStaffUser } from "../services/shelters.service.js";


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
    const shelterId = await getShelterIdForStaffUser(req.user.id);
    if (!shelterId) {
        return res.status(403).json({ error: "No shelter associated with this account" });
    }
    req.shelterId = shelterId;
    next();
}