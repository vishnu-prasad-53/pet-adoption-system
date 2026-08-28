import { Link } from "react-router";
import type { PublicPet } from "../../hooks/usePublicPets";

const API_URL = "http://localhost:3000";

export function PetCard({ pet }: { pet: PublicPet }) {
    return (
        <Link to={`/pets/${pet.id}`} className="block rounded-lg border overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-square bg-muted">
                {pet.thumbnailUrl ? (
                    <img src={`${API_URL}${pet.thumbnailUrl}`} alt={pet.name} className="h-full w-full object-cover" />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">No photo</div>
                )}
            </div>
            <div className="p-3">
                <h3 className="font-medium">{pet.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">
                    {pet.gender}{pet.ageYears != null ? ` · ${pet.ageYears}y` : ""}
                </p>
            </div>
        </Link>
    );
}