import { useNavigate } from "react-router";
import { PetTable } from "../../components/shelter/PetTable";
import { Button } from "../../components/ui/button";

export default function PetsList() {
    const navigate = useNavigate();
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">My Pets</h1>
                <Button onClick={() => navigate("/shelter/pets/new")}>Add Pet</Button>
            </div>
            <PetTable />
        </div>
    );
}