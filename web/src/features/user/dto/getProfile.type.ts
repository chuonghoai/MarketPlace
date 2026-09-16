export type UserProfileResponse = {
    id: string;
    email: string;
    fullName: string;
    phone: string;
    avatarUrl: string;
    gender: "male" | "female" | "other";
    dateOfBirth: string;
    createdAt: string;
};
