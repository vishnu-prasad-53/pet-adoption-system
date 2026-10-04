import { Link } from "react-router";
import { useMyApplications, type Application } from "../hooks/useApplications";
import { StatusBadge } from "../components/applications/StatusBadge";

const API_URL = "http://localhost:3000";

const STATUS_EXPLANATIONS: Record<Application["status"], string> = {
    submitted: "Received and waiting for the shelter to take a look.",
    under_review: "The shelter is currently reviewing your application.",
    interview_scheduled: "The shelter would like to schedule an interview or meet-and-greet.",
    approved: "Congratulations — your application has been approved!",
    rejected: "This application wasn't approved this time.",
    withdrawn: "You withdrew this application.",
};

export default function MyApplications() {
    const { data: applications, isLoading, isError } = useMyApplications();

    if (isLoading) return <p className="text-muted-foreground">Loading your applications...</p>;
    if (isError) return <p className="text-red-500">Couldn't load your applications.</p>;
    if (!applications || applications.length === 0) {
        return <p className="text-muted-foreground">You haven't applied to adopt any pets yet.</p>;
    }

    return (
        <div className="max-w-2xl space-y-4">
            <h1 className="text-xl font-semibold">My Applications</h1>
            <div className="space-y-3">
                {applications.map((app) => (
                    <div key={app.id} className="border rounded-lg p-4 flex gap-4">
                        <Link to={`/pets/${app.petId}`} className="shrink-0">
                            {app.petThumbnailUrl ? (
                                <img src={`${API_URL}${app.petThumbnailUrl}`} alt={app.petName} className="h-16 w-16 rounded object-cover" />
                            ) : (
                                <div className="h-16 w-16 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">No photo</div>
                            )}
                        </Link>
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                                <Link to={`/pets/${app.petId}`} className="font-medium hover:underline">{app.petName}</Link>
                                <StatusBadge status={app.status} />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Submitted {new Date(app.submittedAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm">{app.decisionNotes || STATUS_EXPLANATIONS[app.status]}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}