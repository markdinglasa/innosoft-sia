import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks";

export const RequireAuth = ({ allowedRoles }) => {
    const { auth }: any = useAuth();
    const location = useLocation();

    return (
        auth?.roles?.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : auth?.user
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
}

