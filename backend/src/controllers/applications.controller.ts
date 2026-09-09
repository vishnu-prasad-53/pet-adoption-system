import type { Request, Response } from "express";
import { createApplicationSchema, updateApplicationStatusSchema } from "../schemas/applications.schema.js";
import * as applicationsService from "../services/applications.service.js";
import { ApplicationError } from "../services/applications.service.js";

type ApplicationParams = {
    id: string;
};

export async function createApplication(req: Request, res: Response) {
    const parsed = createApplicationSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    try {
        const application = await applicationsService.createApplication(req.user!.id, parsed.data);
        res.status(201).json(application);
    } catch (err) {
        if (err instanceof ApplicationError) return res.status(err.statusCode).json({ error: err.message });
        throw err; 
    }
}

export async function listMyApplications(req: Request, res: Response) {
    res.json(await applicationsService.listApplicationsForApplicant(req.user!.id));
}

export async function getMyApplication(req: Request<ApplicationParams>, res: Response) {
    const application = await applicationsService.getApplicationForApplicant(req.params.id, req.user!.id);
    if (!application) return res.status(404).json({ error: "Application not found" });
    res.json(application);
}

export async function withdrawApplication(req: Request<ApplicationParams>, res: Response) {
    const application = await applicationsService.withdrawApplication(req.params.id, req.user!.id);
    if (!application) return res.status(404).json({ error: "Application not found" });
    res.json(application);
}

export async function listShelterApplications(req: Request, res: Response) {
    res.json(await applicationsService.listApplicationsForShelter(req.shelterId!));
}

export async function getShelterApplication(req: Request<ApplicationParams>, res: Response) {
    const application = await applicationsService.getApplicationForShelter(req.params.id, req.shelterId!);
    if (!application) return res.status(404).json({ error: "Application not found" });
    res.json(application);
}

export async function updateApplicationStatus(req: Request<ApplicationParams>, res: Response) {
    const parsed = updateApplicationStatusSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const application = await applicationsService.updateApplicationStatus(
        req.params.id, req.shelterId!, req.user!.id, parsed.data
    );
    if (!application) return res.status(404).json({ error: "Application not found" });
    res.json(application);
}