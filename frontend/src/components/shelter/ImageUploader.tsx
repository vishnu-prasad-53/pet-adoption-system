import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PetImage } from "../../hooks/usePets";

const API_URL = "http://localhost:3000";

export function ImageUploader({ petId, images }: { petId: string; images: PetImage[] }) {
    const [error, setError] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const upload = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("petId", petId);

            const res = await fetch(`${API_URL}/api/shelter/uploads`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Upload failed");
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pet", petId] }),
        onError: (err: Error) => setError(err.message),
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 8 * 1024 * 1024) {
            setError("File is too large (max 8MB)");
            return;
        }
        upload.mutate(file);
        e.target.value = "";
    };

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-3">
                {images.map((img) => (
                    <img key={img.id} src={`${API_URL}${img.url}`} alt="" className="h-24 w-24 rounded object-cover border" />
                ))}
            </div>
            <div>
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} disabled={upload.isPending} />
                {upload.isPending && <p className="text-sm text-muted-foreground">Uploading...</p>}
                {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
        </div>
    );
}