import { EUserRole, type UserRole } from "../features/user/models/user.model";

export const getDefaultRouteByRole = (role: UserRole): string => {
    if (role === EUserRole.ADMIN) {
        return "/admin";
    }
    if (role === EUserRole.STAFF) {
        return "/admin/orders";
    }
    return "/";
};