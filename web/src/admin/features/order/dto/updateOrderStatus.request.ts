import type { EOrderStatus } from "../../../../features/order/enums/orderStatus.enum";

export interface UpdateOrderStatusRequest {
    orderId: string;
    status: EOrderStatus;
    note?: string;      // Nếu hủy đơn hàng (status = CANCELLED), cần cho biết lý do hủy là gì
}
