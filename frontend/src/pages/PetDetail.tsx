import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";
import { useSpecies, useBreeds } from "../hooks/useCatalog";
import { Gallery } from "../components/pets/Gallery";
import { Button } from "../components/ui/button";

type PetImage = { id: string; petId: string; url: string; createdAt: string };
type PetDetail = {
    id: string;
    shelterId: string;
    name: string;
    speciesId: string;
    breedId: string | null;
    ageYears: number | null;
    ageMonths: number | null;
    gender: "male" | "female";
    size: string | null;
    weightLbs: string | null;
    color: string | null;
    vaccinated: boolean;
    houseTrained: boolean;
    goodWithKids: boolean | null;
    goodWithDogs: boolean | null;
    goodWithCats: boolean | null;
    energyLevel: string | null;
    description: string | null;
    adoptionFee: string | null;
    images: PetImage[];
};

type ShelterInfo = { id: string; name: string; phone: string | null; email: string; address: string };

export default function PetDetail() {
    const { id } = useParams();

    const { data: pet, isLoading, error } = useQuery({
        queryKey: ["public-pet", id],
        queryFn: () => apiFetch<PetDetail>(`/api/pets/${id}`),
        retry: false,
    });

    const { data: speciesList } = useSpecies();
    const { data: breedsList } = useBreeds(pet?.speciesId);
    const { data: shelter } = useQuery({
        queryKey: ["public-shelter", pet?.shelterId],
        queryFn: () => apiFetch<ShelterInfo>(`/api/shelters/${pet!.shelterId}`),
        enabled: !!pet?.shelterId,
    });

    if (isLoading) return <p className="p-6 text-muted-foreground">Loading...</p>;

    if (error || !pet) {
        return (
            <div className="p-6 text-center space-y-3">
                <h1 className="text-xl font-semibold">This pet isn't available anymore</h1>
                <p className="text-muted-foreground">They may have already found a home, or the listing was removed.</p>
                <Link to="/" className="text-primary underline">Back to browsing</Link>
            </div>
        );
    }

    const speciesName = speciesList?.find((s) => s.id === pet.speciesId)?.name;
    const breedName = breedsList?.find((b) => b.id === pet.breedId)?.name;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Gallery images={pet.images} petName={pet.name} />

            <div className="space-y-2">
                <h1 className="text-2xl font-semibold">{pet.name}</h1>
                <p className="text-muted-foreground">
                    {[speciesName, breedName].filter(Boolean).join(" · ")}
                    {pet.ageYears != null ? ` · ${pet.ageYears}y ${pet.ageMonths ?? 0}m` : ""}
                    {` · ${pet.gender}`}
                </p>
            </div>

            {pet.description && <p>{pet.description}</p>}

            <dl className="grid grid-cols-2 gap-3 text-sm">
                {pet.size && <><dt className="text-muted-foreground">Size</dt><dd className="capitalize">{pet.size}</dd></>}
                {pet.weightLbs && <><dt className="text-muted-foreground">Weight</dt><dd>{Number(pet.weightLbs)} lbs</dd></>}
                {pet.color && <><dt className="text-muted-foreground">Color</dt><dd>{pet.color}</dd></>}
                {pet.energyLevel && <><dt className="text-muted-foreground">Energy</dt><dd className="capitalize">{pet.energyLevel}</dd></>}
                <dt className="text-muted-foreground">Vaccinated</dt><dd>{pet.vaccinated ? "Yes" : "No"}</dd>
                <dt className="text-muted-foreground">House-trained</dt><dd>{pet.houseTrained ? "Yes" : "No"}</dd>
                {pet.goodWithKids != null && <><dt className="text-muted-foreground">Good with kids</dt><dd>{pet.goodWithKids ? "Yes" : "No"}</dd></>}
                {pet.goodWithDogs != null && <><dt className="text-muted-foreground">Good with dogs</dt><dd>{pet.goodWithDogs ? "Yes" : "No"}</dd></>}
                {pet.goodWithCats != null && <><dt className="text-muted-foreground">Good with cats</dt><dd>{pet.goodWithCats ? "Yes" : "No"}</dd></>}
                {pet.adoptionFee && <><dt className="text-muted-foreground">Adoption fee</dt><dd>${Number(pet.adoptionFee)}</dd></>}
            </dl>

            {shelter && (
                <div className="border rounded-lg p-4 space-y-1">
                    <h2 className="font-medium">{shelter.name}</h2>
                    <p className="text-sm text-muted-foreground">{shelter.address}</p>
                    {shelter.phone && <p className="text-sm text-muted-foreground">{shelter.phone}</p>}
                    <p className="text-sm text-muted-foreground">{shelter.email}</p>
                </div>
            )}

            <Button size="lg" disabled title="Coming in Day 17">Apply to Adopt</Button>
        </div>
    );
}