import { z } from "zod";

export const createPetSchema = z.object({
    name: z.string().min(1),
    speciesId: z.string().uuid(),
    breedId: z.string().uuid().optional(),
    ageYears: z.number().int().min(0).optional(),
    ageMonths: z.number().int().min(0).max(11).optional(),
    gender: z.enum(["male", "female"]),
    size: z.enum(["small", "medium", "large", "xlarge"]).optional(),
    weightLbs: z.number().positive().optional(),
    color: z.string().optional(),
    vaccinated: z.boolean().default(false),
    houseTrained: z.boolean().default(false),
    goodWithKids: z.boolean().optional(),
    goodWithDogs: z.boolean().optional(),
    goodWithCats: z.boolean().optional(),
    energyLevel: z.enum(["low", "medium", "high"]).optional(),
    description: z.string().optional(),
    adoptionFee: z.number().nonnegative().optional(),
});

export const updatePetSchema = createPetSchema.partial();

export type CreatePetInput = z.infer<typeof createPetSchema>;
export type UpdatePetInput = z.infer<typeof updatePetSchema>;