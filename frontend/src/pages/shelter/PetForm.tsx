import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api";
import { useCreatePet, useUpdatePet, type PetWithImages } from "../../hooks/usePets";
import { useSpecies, useBreeds } from "../../hooks/useCatalog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Field, FieldLabel, FieldError } from "../../components/ui/field";
import { ImageUploader } from "../../components/shelter/ImageUploader";

const optionalNumber = () =>
    z.preprocess((val) => (val === "" || val === undefined ? undefined : Number(val)), z.number().optional());

const petFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    speciesId: z.string().min(1, "Select a species"),
    breedId: z.string().optional(),
    ageYears: optionalNumber(),
    ageMonths: optionalNumber(),
    gender: z.enum(["male", "female"]),
    size: z.enum(["small", "medium", "large", "xlarge"]).optional(),
    weightLbs: optionalNumber(),
    color: z.string().optional(),
    vaccinated: z.boolean(),
    houseTrained: z.boolean(),
    goodWithKids: z.boolean(),
    goodWithDogs: z.boolean(),
    goodWithCats: z.boolean(),
    energyLevel: z.enum(["low", "medium", "high"]).optional(),
    description: z.string().optional(),
    adoptionFee: optionalNumber(),
});

type PetFormInput = z.input<typeof petFormSchema>;
type PetFormValues = z.output<typeof petFormSchema>;

export default function PetForm() {
    const { id } = useParams();
    const isEditing = !!id;
    const navigate = useNavigate();
    const createPet = useCreatePet();
    const updatePet = useUpdatePet();
    const { data: speciesList } = useSpecies();

    const { data: existingPet } = useQuery({
        queryKey: ["pet", id],
        queryFn: () => apiFetch<PetWithImages>(`/api/shelter/pets/${id}`),
        enabled: isEditing,
    });

    const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } =
        useForm<PetFormInput, any, PetFormValues>({
            resolver: zodResolver(petFormSchema),
            defaultValues: {
                vaccinated: false,
                houseTrained: false,
                goodWithKids: false,
                goodWithDogs: false,
                goodWithCats: false,
            },
        });

    useEffect(() => {
        if (existingPet) {
            reset({
                name: existingPet.name,
                speciesId: existingPet.speciesId,
                breedId: existingPet.breedId ?? "",
                ageYears: existingPet.ageYears ?? undefined,
                ageMonths: existingPet.ageMonths ?? undefined,
                gender: existingPet.gender,
                size: existingPet.size ?? undefined,
                weightLbs: existingPet.weightLbs ? Number(existingPet.weightLbs) : undefined,
                color: existingPet.color ?? "",
                vaccinated: existingPet.vaccinated,
                houseTrained: existingPet.houseTrained,
                goodWithKids: existingPet.goodWithKids ?? false,
                goodWithDogs: existingPet.goodWithDogs ?? false,
                goodWithCats: existingPet.goodWithCats ?? false,
                energyLevel: existingPet.energyLevel ?? undefined,
                description: existingPet.description ?? "",
                adoptionFee: existingPet.adoptionFee ? Number(existingPet.adoptionFee) : undefined,
            });
        }
    }, [existingPet, reset]);

    const selectedSpeciesId = watch("speciesId");
    const { data: breedsList } = useBreeds(selectedSpeciesId);

    const onSubmit = async (values: PetFormValues) => {
        const payload = { ...values, breedId: values.breedId || undefined };
        if (isEditing) {
            await updatePet.mutateAsync({ petId: id!, input: payload });
        } else {
            await createPet.mutateAsync(payload);
        }
        navigate("/shelter/pets");
    };

    const selectClass = "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm";

    return (
        <div className="max-w-lg space-y-6">
            <h1 className="text-xl font-semibold">{isEditing ? "Edit Pet" : "Add a Pet"}</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Field data-invalid={!!errors.name}>
                    <FieldLabel>Name</FieldLabel>
                    <Input {...register("name")} />
                    {errors.name && <FieldError>{errors.name.message}</FieldError>}
                </Field>

                <Field data-invalid={!!errors.speciesId}>
                    <FieldLabel>Species</FieldLabel>
                    <select {...register("speciesId")} className={selectClass}>
                        <option value="">Select species</option>
                        {speciesList?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    {errors.speciesId && <FieldError>{errors.speciesId.message}</FieldError>}
                </Field>

                <Field>
                    <FieldLabel>Breed</FieldLabel>
                    <select {...register("breedId")} disabled={!selectedSpeciesId} className={`${selectClass} disabled:opacity-50`}>
                        <option value="">{selectedSpeciesId ? "Select breed (optional)" : "Select a species first"}</option>
                        {breedsList?.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                </Field>

                <div className="grid grid-cols-2 gap-4">
                    <Field><FieldLabel>Age (years)</FieldLabel><Input type="number" min="0" {...register("ageYears")} /></Field>
                    <Field><FieldLabel>Age (months)</FieldLabel><Input type="number" min="0" max="11" {...register("ageMonths")} /></Field>
                </div>

                <Field data-invalid={!!errors.gender}>
                    <FieldLabel>Gender</FieldLabel>
                    <select {...register("gender")} className={selectClass}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </Field>

                <Field>
                    <FieldLabel>Size</FieldLabel>
                    <select {...register("size")} className={selectClass}>
                        <option value="">Not specified</option>
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                        <option value="xlarge">X-Large</option>
                    </select>
                </Field>

                <div className="grid grid-cols-2 gap-4">
                    <Field><FieldLabel>Weight (lbs)</FieldLabel><Input type="number" step="0.1" min="0" {...register("weightLbs")} /></Field>
                    <Field><FieldLabel>Color</FieldLabel><Input {...register("color")} /></Field>
                </div>

                <Field>
                    <FieldLabel>Energy Level</FieldLabel>
                    <select {...register("energyLevel")} className={selectClass}>
                        <option value="">Not specified</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </Field>

                <div className="flex flex-wrap gap-4 text-sm">
                    <label className="flex items-center gap-2"><input type="checkbox" {...register("vaccinated")} /> Vaccinated</label>
                    <label className="flex items-center gap-2"><input type="checkbox" {...register("houseTrained")} /> House-trained</label>
                    <label className="flex items-center gap-2"><input type="checkbox" {...register("goodWithKids")} /> Good with kids</label>
                    <label className="flex items-center gap-2"><input type="checkbox" {...register("goodWithDogs")} /> Good with dogs</label>
                    <label className="flex items-center gap-2"><input type="checkbox" {...register("goodWithCats")} /> Good with cats</label>
                </div>

                <Field><FieldLabel>Adoption Fee ($)</FieldLabel><Input type="number" step="0.01" min="0" {...register("adoptionFee")} /></Field>

                <Field>
                    <FieldLabel>Description</FieldLabel>
                    <textarea {...register("description")} rows={4} className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm" />
                </Field>

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Add Pet"}
                </Button>
            </form>

            {isEditing && id && existingPet && (
                <div className="border-t pt-6">
                    <h2 className="font-medium mb-3">Photos</h2>
                    <ImageUploader petId={id} images={existingPet.images} />
                </div>
            )}
        </div>
    );
}