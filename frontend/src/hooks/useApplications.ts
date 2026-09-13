import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";

export type ApplicationFormData = {
    housingType: "own" | "rent";
    landlordPermission?: boolean;
    hasYard: boolean;
    yardFenced?: boolean;
    otherPets?: string;
    petExperience: string;
    reasonForAdopting: string;
    householdMembers: number;
    hasChildren: boolean;
    hoursAloneDaily: number;
};

export type Application = {
    id: string;
    petId: string;
    applicantId: string;
    shelterId: string;
    status: "submitted" | "under_review" | "interview_scheduled" | "approved" | "rejected" | "withdrawn";
    formData: ApplicationFormData;
    decisionNotes: string | null;
    submittedAt: string;
    reviewedBy: string | null;
    reviewedAt: string | null;
};

export function useCreateApplication() {
    return useMutation({
        mutationFn: (input: { petId: string; formData: ApplicationFormData }) =>
            apiFetch<Application>("/api/applications", { method: "POST", body: JSON.stringify(input) }),
    });
}