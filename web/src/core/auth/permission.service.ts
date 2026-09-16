import { ROLE } from "../constants/role.constant";

class PermissionService {
    isAdmin(role?: string): boolean {
        return role === ROLE.ADMIN;
    }
}

export const permissionService = new PermissionService();