import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";
import { useAuth } from "./useAuth";

export type FavoriteWithPet = {
    id: string;
    petId: string;
    createdAt: string;
    petName: string;
    petStatus: string;
    petThumbnailUrl: string | null;
};

export function useFavorites() {
    const { session } = useAuth();
    return useQuery({
        queryKey: ["favorites"],
        queryFn: () => apiFetch<FavoriteWithPet[]>("/api/favorites"),
        enabled: !!session?.user,
    });
}

export function useIsFavorited(petId: string) {
    const { data: favorites } = useFavorites();
    return favorites?.some((f) => f.petId === petId) ?? false;
}

export function useToggleFavorite() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ petId, isFavorited }: {
            petId: string;
            isFavorited: boolean;
        }): Promise<void> => {
            if (isFavorited) {
                await apiFetch<void>(`/api/favorites/${petId}`, { method: "DELETE" });
            } else {
                await apiFetch<FavoriteWithPet>("/api/favorites", { method: "POST", body: JSON.stringify({ petId }) });
            }
        },

        onMutate: async ({ petId, isFavorited }) => {
            await queryClient.cancelQueries({ queryKey: ["favorites"] });
            const previous = queryClient.getQueryData<FavoriteWithPet[]>(["favorites"]);
            queryClient.setQueryData<FavoriteWithPet[]>(["favorites"], (old) => {
                if (!old) return old;
                if (isFavorited) return old.filter((f) => f.petId !== petId);
                return [...old, { id: `optimistic-${petId}`, petId, createdAt: new Date().toISOString(), petName: "", petStatus: "available", petThumbnailUrl: null }];
            });
            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) queryClient.setQueryData(["favorites"], context.previous);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
    });
}