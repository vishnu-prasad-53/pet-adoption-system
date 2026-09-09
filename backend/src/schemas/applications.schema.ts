import { z } from "zod";

export const applicationFormDataSchema = z.object({
    housingType: z.enum(["own", "rent"]),
    landlordPermission: z.boolean().optional(),
    hasYard: z.boolean(),
    yardFenced: z.boolean().optional(),
    otherPets: z.string().optional(),
    petExperience: z.string().min(1, "Please share your experience with pets"),
    reasonForAdopting: z.string().min(1, "Please tell us why you'd like to adopt"),
    householdMembers: z.number().int().min(1),
    hasChildren: z.boolean(),
    hoursAloneDaily: z.number().min(0).max(24),
});

export const createApplicationSchema = z.object({
    petId: z.string().uuid(),
    formData: applicationFormDataSchema,
});

export const updateApplicationStatusSchema = z.object({
    status: z.enum(["under_review", "interview_scheduled", "approved", "rejected"]),
    decisionNotes: z.string().optional(),
});

export type ApplicationFormData = z.infer<typeof applicationFormDataSchema>;
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;