export const EUserRole = {
    ADMIN: "ADMIN",
    STAFF: "STAFF",
    USER: "USER"
} as const;
export type UserRole = (typeof EUserRole)[keyof typeof EUserRole];

export interface User {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
    avatarUrl?: string;
}