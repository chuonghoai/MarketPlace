/**
 * Pending: Vừa đặt hàng, chờ xác nhận
 * Preparing: Đã xác nhận, đang chuẩn bị đơn hàng
 * Shipping: Đã giao cho đơn vị vận chuyển
 * Delivered: Đã giao
 * Success: Đơn hàng thành công
 * Cancelled: Đơn hàng đã bị hủy
 * Returned: Đơn hàng được yêu cầu hoàn trả
 */
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