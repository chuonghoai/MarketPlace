import { EOrderStatus } from "../../enums/orderStatus.enum";

// Yêu cầu cập nhật trạng thái đơn (CANCELLED hoặc RETURNED)
export interface OrderStatusChangeRequest {
    orderId: string;
    newStatus: EOrderStatus;
    note: string;
}