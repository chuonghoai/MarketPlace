export type UpdateProfileRequest = {
    fullName?: string;
    phone?: string;
    gender?: "male" | "female" | "other";
    dateOfBirth?: string;
};
