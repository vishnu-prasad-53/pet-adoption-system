import { useSpecies } from "../../hooks/useCatalog";

type FilterSidebarProps = {
    params: {
        speciesId?: string;
        gender?: string;
        size?: string;
        energyLevel?: string;
        goodWithKids?: boolean;
        goodWithDogs?: boolean;
        goodWithCats?: boolean;
        search?: string;
        lat?: number;
        lng?: number;
        radiusKm?: number;
    };
    onChange: (key: string, value: string | boolean | number | undefined) => void;
};

export function FilterSidebar({ params, onChange }: FilterSidebarProps) {
    const { data: speciesList } = useSpecies();
    const selectClass = "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm mt-1";

    return (
        <aside className="w-56 shrink-0 space-y-4">
            <div>
                <label className="text-sm font-medium">Search</label>
                <input
                    type="text"
                    value={params.search ?? ""}
                    onChange={(e) => onChange("search", e.target.value)}
                    placeholder="Pet name..."
                    className={selectClass}
                />
            </div>

            <div>
                <label className="text-sm font-medium">Species</label>
                <select value={params.speciesId ?? ""} onChange={(e) => onChange("speciesId", e.target.value || undefined)} className={selectClass}>
                    <option value="">Any</option>
                    {speciesList?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>

            <div>
                <label className="text-sm font-medium">Gender</label>
                <select value={params.gender ?? ""} onChange={(e) => onChange("gender", e.target.value || undefined)} className={selectClass}>
                    <option value="">Any</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>

            <div>
                <label className="text-sm font-medium">Size</label>
                <select value={params.size ?? ""} onChange={(e) => onChange("size", e.target.value || undefined)} className={selectClass}>
                    <option value="">Any</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="xlarge">X-Large</option>
                </select>
            </div>

            <div>
                <label className="text-sm font-medium">Energy Level</label>
                <select value={params.energyLevel ?? ""} onChange={(e) => onChange("energyLevel", e.target.value || undefined)} className={selectClass}>
                    <option value="">Any</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>

            <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={!!params.goodWithKids} onChange={(e) => onChange("goodWithKids", e.target.checked)} />
                    Good with kids
                </label>
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={!!params.goodWithDogs} onChange={(e) => onChange("goodWithDogs", e.target.checked)} />
                    Good with dogs
                </label>
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={!!params.goodWithCats} onChange={(e) => onChange("goodWithCats", e.target.checked)} />
                    Good with cats
                </label>
            </div>

            <div className="space-y-2 pt-2 border-t">
                <button
                    type="button"
                    onClick={() => {
                        if (!navigator.geolocation) {
                            alert("Geolocation isn't supported in this browser");
                            return;
                        }
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                onChange("lat", position.coords.latitude);
                                onChange("lng", position.coords.longitude);
                                onChange("radiusKm", 50);
                            },
                            () => alert("Couldn't get your location — check browser permissions")
                        );
                    }}
                    className="w-full h-8 rounded-lg border text-sm hover:bg-muted"
                >
                    Near Me
                </button>
                {params.lat !== undefined && (
                    <select
                        value={params.radiusKm ?? 50}
                        onChange={(e) => onChange("radiusKm", Number(e.target.value))}
                        className={selectClass}
                    >
                        <option value={10}>Within 10 km</option>
                        <option value={50}>Within 50 km</option>
                        <option value={100}>Within 100 km</option>
                    </select>
                )}
            </div>
        </aside>
    );
}