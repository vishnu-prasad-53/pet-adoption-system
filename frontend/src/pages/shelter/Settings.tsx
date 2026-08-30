import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Field, FieldLabel, FieldError } from "../../components/ui/field";

const settingsSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email("Enter a valid email"),
    address: z.string().min(1, "Address is required"),
});
type SettingsForm = z.infer<typeof settingsSchema>;
type ShelterSettings = SettingsForm & { id: string; lat: string | null; lng: string | null };

export default function Settings() {
    const queryClient = useQueryClient();
    const [savedMessage, setSavedMessage] = useState(false);

    const { data: shelter } = useQuery({
        queryKey: ["shelter-settings"],
        queryFn: () => apiFetch<ShelterSettings>("/api/shelter/settings"),
    });

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<SettingsForm>({
        resolver: zodResolver(settingsSchema),
    });

    useEffect(() => {
        if (shelter) {
            reset({
                name: shelter.name,
                description: shelter.description ?? "",
                phone: shelter.phone ?? "",
                email: shelter.email,
                address: shelter.address,
            });
        }
    }, [shelter, reset]);

    const onSubmit = async (values: SettingsForm) => {
        await apiFetch("/api/shelter/settings", { method: "PATCH", body: JSON.stringify(values) });
        queryClient.invalidateQueries({ queryKey: ["shelter-settings"] });
        setSavedMessage(true);
        setTimeout(() => setSavedMessage(false), 3000);
    };

    return (
        <div className="max-w-lg space-y-6">
            <h1 className="text-xl font-semibold">Shelter Settings</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Field data-invalid={!!errors.name}>
                    <FieldLabel>Shelter Name</FieldLabel>
                    <Input {...register("name")} />
                    {errors.name && <FieldError>{errors.name.message}</FieldError>}
                </Field>
                <Field>
                    <FieldLabel>Description</FieldLabel>
                    <textarea {...register("description")} rows={3} className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm" />
                </Field>
                <Field><FieldLabel>Phone</FieldLabel><Input {...register("phone")} /></Field>
                <Field data-invalid={!!errors.email}>
                    <FieldLabel>Email</FieldLabel>
                    <Input type="email" {...register("email")} />
                    {errors.email && <FieldError>{errors.email.message}</FieldError>}
                </Field>
                <Field data-invalid={!!errors.address}>
                    <FieldLabel>Address</FieldLabel>
                    <Input {...register("address")} placeholder="Full street address" />
                    {errors.address && <FieldError>{errors.address.message}</FieldError>}
                    <p className="text-xs text-muted-foreground">Changing the address automatically looks up its coordinates for location search.</p>
                </Field>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save"}</Button>
                {savedMessage && <p className="text-sm text-green-600">Saved!</p>}
            </form>
        </div>
    );
}