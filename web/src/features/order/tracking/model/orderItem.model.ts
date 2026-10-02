import type { EOrderStatus } from "../../../../features/order/enums/orderStatus.enum";
import type { EPaymentMethod } from "../../../../features/order/enums/paymentMethod.enum";
import type { EPaymentStatus } from "../../../../features/order/enums/paymentStatus.enum";

// Thông tin tóm tắt đơn hàng cho danh sách
export interface OrderItemTracking {
    id: string;
    createdAt: Date;
    orderStatus: EOrderStatus;

    totalAmount: number;
    totalProductQuantity: number;

    firstProductImageUrl: string;
    firstProductName: string;

    paymentMethod: EPaymentMethod;
    paymentStatus: EPaymentStatus;
}