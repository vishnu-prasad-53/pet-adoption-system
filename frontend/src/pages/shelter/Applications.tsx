import { Link } from "react-router";
import { useShelterApplications } from "../../hooks/useApplications";
import { StatusBadge } from "../../components/applications/StatusBadge";

export default function Applications() {
    const { data: applications, isLoading, isError } = useShelterApplications();

    if (isLoading) return <p className="text-muted-foreground">Loading applications...</p>;
    if (isError) return <p className="text-red-500">Failed to load applications.</p>;
    if (!applications || applications.length === 0) {
        return <p className="text-muted-foreground">No applications yet.</p>;
    }

    return (
        <div className="max-w-3xl space-y-4">
            <h1 className="text-xl font-semibold">Applications</h1>
            <div className="space-y-3">
                {applications.map((app) => (
                    <Link key={app.id} to={`/shelter/applications/${app.id}`} className="block border rounded-lg p-4 hover:bg-muted/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">{app.petName}</p>
                                <p className="text-sm text-muted-foreground">{app.applicantName} · {app.applicantEmail}</p>
                            </div>
                            <StatusBadge status={app.status} />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}