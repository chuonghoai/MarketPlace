import type { EOrderStatus } from "../../../../features/order/enums/orderStatus.enum";
import type { EPaymentMethod } from "../../../../features/order/enums/paymentMethod.enum";
import type { EPaymentStatus } from "../../../../features/order/enums/paymentStatus.enum";

// Thông tin đơn hàng cho danh sách quản lý
export interface OrderItem {
    id: string;
    createdAt: Date;
    orderStatus: EOrderStatus;

    totalAmount: number;
    totalProductQuantity: number;

    firstProductImageUrl: string;

    buyerName: string;
    buyerAddress: string;
    buyerPhone: string;

    paymentMethod: EPaymentMethod;
    paymentStatus: EPaymentStatus;
}