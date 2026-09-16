import { Navigate } from "react-router-dom";
import { userStorageService } from "../../features/user/services/userStorage.service";
import type { UserRole } from "../../features/user/models/user.model";

interface Props {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
    requireAuth?: boolean;
}

function AuthGuard({ children, allowedRoles, requireAuth = true }: Props) {
    const user = userStorageService.getUser();

    if (requireAuth && !user) {
        return <Navigate to="/login" replace />;
    }

    if (user && allowedRoles) {
        if (!allowedRoles.includes(user.role)) {
            return <Navigate to="/login?reason=unauthorized" replace />;
        }
    }

    return <>{children}</>;
}

export default AuthGuard;