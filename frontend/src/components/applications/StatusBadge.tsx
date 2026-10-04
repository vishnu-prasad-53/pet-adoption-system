import type { Application } from "../../hooks/useApplications";

const STATUS_STYLES: Record<Application["status"], string> = {
    submitted: "bg-blue-100 text-blue-800",
    under_review: "bg-yellow-100 text-yellow-800",
    interview_scheduled: "bg-purple-100 text-purple-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    withdrawn: "bg-gray-100 text-gray-800",
};

const STATUS_LABELS: Record<Application["status"], string> = {
    submitted: "Submitted",
    under_review: "Under Review",
    interview_scheduled: "Interview Scheduled",
    approved: "Approved",
    rejected: "Not Approved",
    withdrawn: "Withdrawn",
};

export function StatusBadge({ status }: { status: Application["status"] }) {
    return (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status]}`}>
            {STATUS_LABELS[status]}
        </span>
    );
}