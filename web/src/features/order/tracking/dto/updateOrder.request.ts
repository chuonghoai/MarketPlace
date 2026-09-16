import { EOrderStatus } from "../../enums/orderStatus.enum";

/**
 * newStatus: Yêu cầu cập nhật trạng thái mới (chỉ được CANCELLED hoặc RETURNED)
 * note: Lý do hủy đơn hoặc yêu cầu hoàn trả
 */
export interface OrderStatusChangeRequest {
    orderId: string;
    newStatus: EOrderStatus;
    note: string;
}