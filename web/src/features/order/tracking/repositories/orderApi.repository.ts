import { apiClient } from "../../../../core/api/apiClient";
import type { ApiResponse } from "../../../../core/api/apiResponse";
import type { EOrderStatus } from "../../enums/orderStatus.enum";
import type { OrderStatusChangeRequest } from "../dto/updateOrder.request";
import type { OrderTrackingDetail } from "../model/orderDetail.model";
import type { OrderItemTracking } from "../model/orderItem.model";
import type { OrderTrackingStatusCount } from "../model/orderStatusCount.model";
import type { OrderRepository } from "./order.repository";

export class OrderApiRepository implements OrderRepository {
    // Lấy danh sách đơn hàng theo trạng thái
    async getOrders(status?: EOrderStatus): Promise<ApiResponse<OrderItemTracking[]>> {
        const params = status ? { status } : undefined;
        return apiClient.get<ApiResponse<OrderItemTracking[]>>("/orders/tracking", { params });
    }

    // Đếm số lượng đơn hàng theo từng trạng thái
    async getOrderStatusCount(): Promise<ApiResponse<OrderTrackingStatusCount>> {
        return apiClient.get<ApiResponse<OrderTrackingStatusCount>>("/orders/tracking/count");
    }

    // Lấy chi tiết đơn hàng
    async getOrderDetailById(orderId: string): Promise<ApiResponse<OrderTrackingDetail>> {
        return apiClient.get<ApiResponse<OrderTrackingDetail>>(`/orders/tracking/${orderId}`);
    }

    // Cập nhật trạng thái đơn (Hủy hoặc Trả hàng)
    async changeOrderStatus(request: OrderStatusChangeRequest): Promise<ApiResponse<OrderTrackingDetail>> {
        return apiClient.patch<ApiResponse<OrderTrackingDetail>>(`/orders/tracking/${request.orderId}/status`, {
            newStatus: request.newStatus,
            note: request.note,
        });
    }
}
