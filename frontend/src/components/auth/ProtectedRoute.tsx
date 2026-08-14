import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../hooks/useAuth";

export function ProtectedRoute({ allowedRoles }: { allowedRoles?: string[] }) {
    const { session, isPending } = useAuth();

    if(isPending) return <div className="p-6">Loading...</div>;
    if(!session?.user) return <Navigate to="/login" replace />
    if(allowedRoles && !allowedRoles.includes(session.user.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}