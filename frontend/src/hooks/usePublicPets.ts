import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";

export type PublicPet = {
    id: string;
    name: string;
    speciesId: string;
    breedId: string | null;
    ageYears: number | null;
    ageMonths: number | null;
    gender: "male" | "female";
    size: "small" | "medium" | "large" | "xlarge" | null;
    energyLevel: "low" | "medium" | "high" | null;
    goodWithKids: boolean | null;
    goodWithDogs: boolean | null;
    goodWithCats: boolean | null;
    description: string | null;
    adoptionFee: string | null;
    thumbnailUrl: string | null;
};

export type PetSearchParams = {
    speciesId?: string;
    gender?: string;
    size?: string;
    energyLevel?: string;
    goodWithKids?: boolean;
    goodWithDogs?: boolean;
    goodWithCats?: boolean;
    search?: string;
    page?: number;
    lat?: number;
    lng?: number;
    radiusKm?: number;
};

type PublicPetsResponse = {
    items: PublicPet[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
};

export function usePublicPets(params: PetSearchParams) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "" && value !== false) {
            query.set(key, String(value));
        }
    });

    return useQuery({
        queryKey: ["public-pets", params],
        queryFn: () => apiFetch<PublicPetsResponse>(`/api/pets?${query.toString()}`),
    });
}