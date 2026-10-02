import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api";
import { useUpdateApplicationStatus, type ShelterApplication, type ApplicationFormData } from "../../hooks/useApplications";
import { StatusBadge } from "./StatusBadge";
import { Button } from "../ui/button";

export function ReviewPanel() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [notes, setNotes] = useState("");
    const updateStatus = useUpdateApplicationStatus();

    const { data: app, isLoading } = useQuery({
        queryKey: ["shelter-application", id],
        queryFn: () => apiFetch<ShelterApplication>(`/api/shelter/applications/${id}`),
    });

    if (isLoading) return <p className="text-muted-foreground">Loading...</p>;
    if (!app) return <p className="text-red-500">Application not found.</p>;

    const formData = app.formData as ApplicationFormData;
    const isDecided = app.status === "approved" || app.status === "rejected" || app.status === "withdrawn";

    const handleDecision = async (status: "under_review" | "interview_scheduled" | "approved" | "rejected") => {
        await updateStatus.mutateAsync({ applicationId: app.id, status, decisionNotes: notes || undefined });
        navigate("/shelter/applications");
    };

    return (
        <div className="max-w-xl space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">{app.petName} — {app.applicantName}</h1>
                <StatusBadge status={app.status} />
            </div>

            <div className="border rounded-lg p-4 space-y-2 text-sm">
                <p><span className="text-muted-foreground">Applicant:</span> {app.applicantName} ({app.applicantEmail})</p>
                <p><span className="text-muted-foreground">Housing:</span> {formData.housingType}{formData.housingType === "rent" && formData.landlordPermission ? " (landlord allows pets)" : ""}</p>
                <p><span className="text-muted-foreground">Yard:</span> {formData.hasYard ? (formData.yardFenced ? "Yes, fenced" : "Yes, not fenced") : "No"}</p>
                {formData.otherPets && <p><span className="text-muted-foreground">Other pets:</span> {formData.otherPets}</p>}
                <p><span className="text-muted-foreground">Household:</span> {formData.householdMembers} people{formData.hasChildren ? ", including children" : ""}</p>
                <p><span className="text-muted-foreground">Hours alone/day:</span> {formData.hoursAloneDaily}</p>
                <p><span className="text-muted-foreground">Experience:</span> {formData.petExperience}</p>
                <p><span className="text-muted-foreground">Reason:</span> {formData.reasonForAdopting}</p>
            </div>

            {!isDecided && (
                <div className="space-y-3">
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Notes for the applicant (optional)"
                        rows={3}
                        className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm"
                    />
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" onClick={() => handleDecision("under_review")}>Mark Under Review</Button>
                        <Button variant="outline" onClick={() => handleDecision("interview_scheduled")}>Schedule Interview</Button>
                        <Button onClick={() => handleDecision("approved")}>Approve</Button>
                        <Button variant="destructive" onClick={() => handleDecision("rejected")}>Reject</Button>
                    </div>
                </div>
            )}
        </div>
    );
}