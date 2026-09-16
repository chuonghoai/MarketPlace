export const EPaymentMethod = {
    COD: "COD",
    MOMO: "MOMO",
    VNPAY: "VNPAY",
    PAYPAL: "PAYPAL"
} as const;
export type EPaymentMethod = (typeof EPaymentMethod)[keyof typeof EPaymentMethod];