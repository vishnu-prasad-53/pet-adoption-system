import { Link } from "react-router";
import { useFavorites, useToggleFavorite } from "../hooks/useFavorites";

const API_URL = "http://localhost:3000";

export default function MyFavorites() {
    const { data: favorites, isLoading } = useFavorites();
    const toggleFavorite = useToggleFavorite();

    if (isLoading) return <p className="text-muted-foreground">Loading favorites...</p>;
    if (!favorites || favorites.length === 0) {
        return <p className="text-muted-foreground">You haven't favorited any pets yet.</p>;
    }

    return (
        <div className="max-w-3xl space-y-4">
            <h1 className="text-xl font-semibold">My Favorites</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.map((fav) => (
                    <div key={fav.id} className="border rounded-lg overflow-hidden">
                        <Link to={`/pets/${fav.petId}`}>
                            <div className="aspect-square bg-muted">
                                {fav.petThumbnailUrl ? (
                                    <img src={`${API_URL}${fav.petThumbnailUrl}`} alt={fav.petName} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">No photo</div>
                                )}
                            </div>
                        </Link>
                        <div className="p-3 flex items-center justify-between">
                            <div>
                                <Link to={`/pets/${fav.petId}`} className="font-medium hover:underline">{fav.petName}</Link>
                                {fav.petStatus !== "available" && (
                                    <p className="text-xs text-muted-foreground capitalize">{fav.petStatus.replace("_", " ")}</p>
                                )}
                            </div>
                            <button onClick={() => toggleFavorite.mutate({ petId: fav.petId, isFavorited: true })} className="text-red-500 text-lg" aria-label="Remove from favorites">♥</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}