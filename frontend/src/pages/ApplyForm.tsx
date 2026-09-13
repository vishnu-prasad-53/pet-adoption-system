import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams, useNavigate } from "react-router";
import { useCreateApplication } from "../hooks/useApplications";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Field, FieldLabel, FieldError } from "../components/ui/field";

const applicationSchema = z.object({
    housingType: z.enum(["own", "rent"]),
    landlordPermission: z.boolean().optional(),
    hasYard: z.boolean(),
    yardFenced: z.boolean().optional(),
    otherPets: z.string().optional(),

    petExperience: z
        .string()
        .min(1, "Please share your experience with pets"),

    reasonForAdopting: z
        .string()
        .min(1, "Please tell us why you'd like to adopt"),

    householdMembers: z
        .number()
        .int()
        .min(1, "Must be at least 1"),

    hasChildren: z.boolean(),

    hoursAloneDaily: z
        .number()
        .min(0)
        .max(24),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

export default function ApplyForm() {
    const { id: petId } = useParams();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);
    const createApplication = useCreateApplication();

    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<ApplicationForm>({
        resolver: zodResolver(applicationSchema),
        defaultValues: { hasYard: false, hasChildren: false },
    });

    const housingType = watch("housingType");
    const hasYard = watch("hasYard");

    const onSubmit = async (values: ApplicationForm) => {
        setServerError(null);
        try {
            await createApplication.mutateAsync({ petId: petId!, formData: values });
            navigate("/dashboard");
        } catch (err) {
            setServerError(err instanceof Error ? err.message : "Something went wrong");
        }
    };

    return (
        <div className="max-w-lg mx-auto space-y-6">
            <h1 className="text-xl font-semibold">Adoption Application</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Field data-invalid={!!errors.housingType}>
                    <FieldLabel>Do you own or rent your home?</FieldLabel>
                    <select {...register("housingType")} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm">
                        <option value="">Select one</option>
                        <option value="own">Own</option>
                        <option value="rent">Rent</option>
                    </select>
                    {errors.housingType && <FieldError>{errors.housingType.message}</FieldError>}
                </Field>

                {housingType === "rent" && (
                    <Field>
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" {...register("landlordPermission")} />
                            My landlord allows pets
                        </label>
                    </Field>
                )}

                <Field>
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" {...register("hasYard")} />
                        I have a yard
                    </label>
                </Field>

                {hasYard && (
                    <Field>
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" {...register("yardFenced")} />
                            It's fenced
                        </label>
                    </Field>
                )}

                <Field>
                    <FieldLabel>Other pets in the home (if any)</FieldLabel>
                    <Input {...register("otherPets")} placeholder="e.g. one older cat" />
                </Field>

                <Field data-invalid={!!errors.petExperience}>
                    <FieldLabel>Your experience with pets</FieldLabel>
                    <textarea {...register("petExperience")} rows={3} className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm" />
                    {errors.petExperience && <FieldError>{errors.petExperience.message}</FieldError>}
                </Field>

                <Field data-invalid={!!errors.reasonForAdopting}>
                    <FieldLabel>Why do you want to adopt this pet?</FieldLabel>
                    <textarea {...register("reasonForAdopting")} rows={3} className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm" />
                    {errors.reasonForAdopting && <FieldError>{errors.reasonForAdopting.message}</FieldError>}
                </Field>

                <div className="grid grid-cols-2 gap-4">
                    <Field data-invalid={!!errors.householdMembers}>
                        <FieldLabel>People in your household</FieldLabel>
                        <Input type="number" min="1" {...register("householdMembers", { valueAsNumber: true })} />
                        {errors.householdMembers && <FieldError>{errors.householdMembers.message}</FieldError>}
                    </Field>
                    <Field data-invalid={!!errors.hoursAloneDaily}>
                        <FieldLabel>Hours the pet would be alone daily</FieldLabel>
                        <Input type="number" min="0" max="24" {...register("hoursAloneDaily", { valueAsNumber: true })} />
                        {errors.hoursAloneDaily && <FieldError>{errors.hoursAloneDaily.message}</FieldError>}
                    </Field>
                </div>

                <Field>
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" {...register("hasChildren")} />
                        There are children in the household
                    </label>
                </Field>

                {serverError && <p className="text-sm text-red-500">{serverError}</p>}

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
            </form>
        </div>
    );
}