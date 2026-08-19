import { PetTable } from "../../components/shelter/PetTable";

export default function PetsList() {
    return (
        <div className="space-y-4">
            <h1 className="text-xl font-semibold">My Pets</h1>
            <PetTable />
        </div>
    );
}