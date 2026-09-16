export const EPaymentStatus = {
    PENDING: 'PENDING',
    PAID: 'PAID',
    FAILED: 'FAILED',
} as const;
export type EPaymentStatus = typeof EPaymentStatus[keyof typeof EPaymentStatus];