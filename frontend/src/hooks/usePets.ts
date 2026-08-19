import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";

export type Pet = {
    id: string;
    shelterId: string;
    name: string;
    speciesId: string;
    breedId: string | null;
    ageYears: number | null;
    ageMonths: number | null;
    gender: "male" | "female";
    size: "small" | "medium" | "large" | "xlarge" | null;
    weightLbs: string | null;
    color: string | null;
    vaccinated: boolean;
    houseTrained: boolean;
    goodWithKids: boolean | null;
    goodWithDogs: boolean | null;
    goodWithCats: boolean | null;
    energyLevel: "low" | "medium" | "high" | null;
    description: string | null;
    status: "available" | "pending" | "adopted" | "fostered" | "medical_hold" | "not_available" | "returned";
    adoptionFee: string | null;
    intakeDate: string;
    createdAt: string;
    updatedAt: string;
};

const PETS_KEY = ["shelter-pets"];

export function usePets() {
    return useQuery({
        queryKey: PETS_KEY,
        queryFn: () => apiFetch<Pet[]>("/api/shelter/pets"),
    });
}

export function useDeletePet() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (petId: string) => apiFetch<void>(`/api/shelter/pets/${petId}`, { method: "DELETE" }),
        onMutate: async (petId) => {
            await queryClient.cancelQueries({ queryKey: PETS_KEY });
            const previous = queryClient.getQueryData<Pet[]>(PETS_KEY);
            queryClient.setQueryData<Pet[]>(PETS_KEY, (old) => old?.filter((p) => p.id !== petId));
            return { previous };
        },
        onError: (_err, _petId, context) => {
            if (context?.previous) queryClient.setQueryData(PETS_KEY, context.previous);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: PETS_KEY }),
    });
}

export function useUpdatePetStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ petId, status }: { petId: string; status: Pet["status"] }) =>
            apiFetch<Pet>(`/api/shelter/pets/${petId}`, {
                method: "PATCH",
                body: JSON.stringify({ status }),
            }),
        onMutate: async ({ petId, status }) => {
            await queryClient.cancelQueries({ queryKey: PETS_KEY });
            const previous = queryClient.getQueryData<Pet[]>(PETS_KEY);
            queryClient.setQueryData<Pet[]>(PETS_KEY, (old) =>
                old?.map((p) => (p.id === petId ? { ...p, status } : p))
            );
            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) queryClient.setQueryData(PETS_KEY, context.previous);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: PETS_KEY }),
    });
}