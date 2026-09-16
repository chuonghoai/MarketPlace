import { apiClient } from "../../../../core/api/apiClient";
import type { ApiResponse } from "../../../../core/api/apiResponse";
import type { EOrderStatus } from "../../enums/orderStatus.enum";
import type { OrderStatusChangeRequest } from "../dto/updateOrder.request";
import type { OrderTrackingDetail } from "../model/orderDetail.model";
import type { OrderItemTracking } from "../model/orderItem.model";
import type { OrderTrackingStatusCount } from "../model/orderStatusCount.model";
import type { OrderRepository } from "./order.repository";

export class OrderApiRepository implements OrderRepository {
    /**
     * GET /orders/tracking
     * @body EOrderStatus
     * @returns OrderItemTracking[]
     * 
     * Mô tả:
     *  - Nếu không truyền status -> trả về order có status: PENDING, PREPARING, SHIPPING
     *  - Ngược lại -> trả về order có status = status được truyền
     * 
     *  - Nếu status là SUCCESS: trả về order SUCCESS và DELIVERED
     *  - Nếu status là CANCELLED: trả về order CANCELLED và RETURNED
     */
    async getOrders(status?: EOrderStatus): Promise<ApiResponse<OrderItemTracking[]>> {
        const params = status ? { status } : undefined;
        return apiClient.get<ApiResponse<OrderItemTracking[]>>("/orders/tracking", { params });
    }

    /**
     * GET /orders/tracking/count
     * @returns OrderTrackingStatusCount
     * 
     * Mô tả:
     *  - Lấy số lượng đơn hàng theo từng trạng thái
     */
    async getOrderStatusCount(): Promise<ApiResponse<OrderTrackingStatusCount>> {
        return apiClient.get<ApiResponse<OrderTrackingStatusCount>>("/orders/tracking/count");
    }

    /**
     * GET /orders/tracking/{orderId}
     * @param orderId - Id của đơn hàng cần lấy chi tiết
     * @returns OrderTrackingDetail
     */
    async getOrderDetailById(orderId: string): Promise<ApiResponse<OrderTrackingDetail>> {
        return apiClient.get<ApiResponse<OrderTrackingDetail>>(`/orders/tracking/${orderId}`);
    }

    /**
     * PATCH /orders/tracking/{orderId}/status
     * @param OrderStatusChangeRequest
     * @returns OrderTrackingDetail
     * 
     * Mô tả:
     *  - Chỉ hủy hoặc yêu cầu trả hàng
     *  - note: Lý do hủy đơn hoặc yêu cầu trả hàng
     */
    async changeOrderStatus(request: OrderStatusChangeRequest): Promise<ApiResponse<OrderTrackingDetail>> {
        return apiClient.patch<ApiResponse<OrderTrackingDetail>>(`/orders/tracking/${request.orderId}/status`, {
            newStatus: request.newStatus,
            note: request.note,
        });
    }
}
