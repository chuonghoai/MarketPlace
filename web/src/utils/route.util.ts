import { EUserRole, type UserRole } from "../features/user/models/user.model";

export const getDefaultRouteByRole = (role: UserRole): string => {
    if (role === EUserRole.ADMIN || role === EUserRole.STAFF) {
        return "/admin";
    }
    return "/";
};