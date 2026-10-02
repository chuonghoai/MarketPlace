// Trạng thái đơn hàng
export const EOrderStatus = {
    PENDING: 'PENDING',
    PREPARING: 'PREPARING',
    SHIPPING: 'SHIPPING',
    DELIVERED: 'DELIVERED',

    SUCCESS: 'SUCCESS',
    CANCELLED: 'CANCELLED',
    RETURNED: 'RETURNED',
} as const;
export type EOrderStatus = typeof EOrderStatus[keyof typeof EOrderStatus];