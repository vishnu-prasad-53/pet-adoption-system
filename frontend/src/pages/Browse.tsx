import { useSearchParams } from "react-router";
import { usePublicPets } from "../hooks/usePublicPets";
import { PetCard } from "../components/pets/PetCard";
import { FilterSidebar } from "../components/pets/FilterSidebar";

export default function Browse() {
    const [searchParams, setSearchParams] = useSearchParams();

    const params = {
        speciesId: searchParams.get("speciesId") ?? undefined,
        gender: searchParams.get("gender") ?? undefined,
        size: searchParams.get("size") ?? undefined,
        energyLevel: searchParams.get("energyLevel") ?? undefined,
        goodWithKids: searchParams.get("goodWithKids") === "true",
        goodWithDogs: searchParams.get("goodWithDogs") === "true",
        goodWithCats: searchParams.get("goodWithCats") === "true",
        search: searchParams.get("search") ?? undefined,
        page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    };

    const { data, isLoading, isError } = usePublicPets(params);

    const updateFilter = (key: string, value: string | boolean | undefined) => {
        const next = new URLSearchParams(searchParams);
        if (value === undefined || value === "" || value === false) {
            next.delete(key);
        } else {
            next.set(key, String(value));
        }
        next.delete("page");
        setSearchParams(next);
    };

    const goToPage = (page: number) => {
        const next = new URLSearchParams(searchParams);
        next.set("page", String(page));
        setSearchParams(next);
    };

    return (
        <div className="flex gap-6">
            <FilterSidebar params={params} onChange={updateFilter} />
            <div className="flex-1 space-y-4">
                {isLoading && <p className="text-muted-foreground">Loading pets...</p>}
                {isError && <p className="text-red-500">Failed to load pets.</p>}
                {data && data.items.length === 0 && <p className="text-muted-foreground">No pets match these filters.</p>}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data?.items.map((pet) => <PetCard key={pet.id} pet={pet} />)}
                </div>

                {data && data.pagination.totalPages > 1 && (
                    <div className="flex justify-center gap-2 pt-4">
                        {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => goToPage(p)}
                                className={`px-3 py-1 rounded border text-sm ${p === data.pagination.page ? "bg-primary text-primary-foreground" : ""}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}