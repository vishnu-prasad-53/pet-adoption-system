import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export type ApplicationWithPet = Application & {
  petName: string;
  petThumbnailUrl: string | null;
};

export type ShelterApplication = ApplicationWithPet & { applicantName: string; applicantEmail: string };

export function useCreateApplication() {
  return useMutation({
    mutationFn: (input: { petId: string; formData: ApplicationFormData }) =>
      apiFetch<Application>("/api/applications", { method: "POST", body: JSON.stringify(input) }),
  });
}

export function useMyApplications() {
  return useQuery({
    queryKey: ["my-applications"],
    queryFn: () => apiFetch<ApplicationWithPet[]>("/api/applications/mine"),
  });
}


export function useShelterApplications() {
  return useQuery({
    queryKey: ["shelter-applications"],
    queryFn: () => apiFetch<ShelterApplication[]>("/api/shelter/applications"),
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, status, decisionNotes }: { applicationId: string; status: string; decisionNotes?: string }) =>
      apiFetch<Application>(`/api/shelter/applications/${applicationId}`, {
        method: "PATCH",
        body: JSON.stringify({ status, decisionNotes }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shelter-applications"] });
      queryClient.invalidateQueries({ queryKey: ["shelter-pets"] }); // approving changes pet status too — Day 10's list needs to know
    },
  });
}