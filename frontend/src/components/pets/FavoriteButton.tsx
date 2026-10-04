import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useIsFavorited, useToggleFavorite } from "../../hooks/useFavorites";

export function FavoriteButton({ petId }: { petId: string }) {
    const { session } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isFavorited = useIsFavorited(petId);
    const toggleFavorite = useToggleFavorite();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!session?.user) {
            navigate("/login", { state: { from: location } });
            return;
        }
        toggleFavorite.mutate({ petId, isFavorited });
    };

    return (
        <button
            onClick={handleClick}
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center text-lg"
        >
            <span className={isFavorited ? "text-red-500" : "text-muted-foreground"}>
                {isFavorited ? "♥" : "♡"}
            </span>
        </button>
    );
}