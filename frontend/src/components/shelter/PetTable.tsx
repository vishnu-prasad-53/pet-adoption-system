import { usePets, useDeletePet, useUpdatePetStatus, type Pet } from "../../hooks/usePets";
import { Button } from "../../components/ui/button";

const STATUS_OPTIONS: Pet["status"][] = [
    "available", "pending", "adopted", "fostered", "medical_hold", "not_available", "returned",
];

export function PetTable() {
    const { data: pets, isLoading, isError } = usePets();
    const deletePet = useDeletePet();
    const updateStatus = useUpdatePetStatus();

    if (isLoading) return <p className="text-muted-foreground">Loading pets...</p>;
    if (isError) return <p className="text-red-500">Failed to load pets.</p>;
    if (!pets || pets.length === 0) return <p className="text-muted-foreground">No pets yet.</p>;

    return (
        <table className="w-full text-sm">
            <thead>
                <tr className="border-b text-left">
                    <th className="p-2">Name</th>
                    <th className="p-2">Gender</th>
                    <th className="p-2">Age</th>
                    <th className="p-2">Status</th>
                    <th className="p-2"></th>
                </tr>
            </thead>
            <tbody>
                {pets.map((pet) => (
                    <tr key={pet.id} className="border-b">
                        <td className="p-2 font-medium">{pet.name}</td>
                        <td className="p-2 capitalize">{pet.gender}</td>
                        <td className="p-2">{pet.ageYears ?? "?"}y {pet.ageMonths ?? 0}m</td>
                        <td className="p-2">
                            <select
                                value={pet.status}
                                onChange={(e) =>
                                    updateStatus.mutate({ petId: pet.id, status: e.target.value as Pet["status"] })
                                }
                                className="rounded border px-2 py-1 text-sm"
                            >
                                {STATUS_OPTIONS.map((s) => (
                                    <option key={s} value={s}>{s.replace("_", " ")}</option>
                                ))}
                            </select>
                        </td>
                        <td className="p-2 text-right">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                    if (confirm(`Delete ${pet.name}? This can't be undone.`)) {
                                        deletePet.mutate(pet.id);
                                    }
                                }}
                            >
                                Delete
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}