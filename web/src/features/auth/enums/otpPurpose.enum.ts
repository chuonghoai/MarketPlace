export const OtpPurpose = {
    REGISTER: "REGISTER",
    FORGOT_PASSWORD: "FORGOT_PASSWORD",
} as const;

export type OtpPurpose = (typeof OtpPurpose)[keyof typeof OtpPurpose];
