import { useState } from "react";

type PetImage = { id: string; petId: string; url: string; createdAt: string };

const API_URL = "http://localhost:3000";

export function Gallery({ images, petName }: { images: PetImage[]; petName: string }) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (images.length === 0) {
        return (
            <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                No photos yet
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted">
                <img src={`${API_URL}${images[activeIndex].url}`} alt={petName} className="h-full w-full object-cover" />
            </div>
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                    {images.map((img, i) => (
                        <button
                            key={img.id}
                            onClick={() => setActiveIndex(i)}
                            className={`shrink-0 rounded overflow-hidden border-2 ${i === activeIndex ? "border-primary" : "border-transparent"}`}
                        >
                            <img src={`${API_URL}${img.url}`} alt="" className="h-16 w-16 object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}