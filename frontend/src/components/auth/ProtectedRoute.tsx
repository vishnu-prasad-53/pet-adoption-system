import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../hooks/useAuth";

export function ProtectedRoute({ allowedRoles }: { allowedRoles?: string[] }) {
    const { session, isPending } = useAuth();
    const location = useLocation();

    if (isPending) return <div className="p-6">Loading...</div>;
    if (!session?.user) return <Navigate to="/login" state={{ from: location }} replace />;
    if (allowedRoles && !allowedRoles.includes(session.user.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}