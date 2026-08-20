import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";

export type Species = { id: string; name: string };
export type Breed = { id: string; speciesId: string; name: string };

export function useSpecies() {
    return useQuery({
        queryKey: ["species"],
        queryFn: () => apiFetch<Species[]>("/api/catalog/species"),
    });
}

export function useBreeds(speciesId: string | undefined) {
    return useQuery({
        queryKey: ["breeds", speciesId],
        queryFn: () => apiFetch<Breed[]>(`/api/catalog/breeds?speciesId=${speciesId}`),
        enabled: !!speciesId,
    });
}