import { apiClient } from "../../../../core/api/apiClient";
import type { ApiResponse } from "../../../../core/api/apiResponse";
import type { EOrderStatus } from "../../../../features/order/enums/orderStatus.enum";
import type { OrderItem } from "../model/orderItem.model";
import type { OrderStatusCount } from "../model/orderStatusCount.model";
import type { OrderDetail } from "../model/orderDetail.model";
import type { UpdateOrderStatusRequest } from "../dto/updateOrderStatus.request";
import type { OrderRepository } from "./order.repository";

export class OrderApiRepository implements OrderRepository {
    // Lấy danh sách đơn hàng theo trạng thái
    async getOrdersByStatus(status?: EOrderStatus): Promise<ApiResponse<OrderItem[]>> {
        const params = status ? { status } : undefined;
        return apiClient.get("/admin/order", {
            params
        })
    }

    // Lấy số lượng đơn hàng theo từng trạng thái
    async getOrderStatusCounts(): Promise<ApiResponse<OrderStatusCount>> {
        return apiClient.get("/admin/order/status-count")
    }

    // Lấy chi tiết đơn hàng theo id
    async getOrderDetailById(orderId: string): Promise<ApiResponse<OrderDetail>> {
        return apiClient.get(`/admin/order/${orderId}`);
    }

    // Cập nhật trạng thái đơn hàng
    async updateOrderStatus(request: UpdateOrderStatusRequest): Promise<ApiResponse<OrderDetail>> {
        return apiClient.patch(`/admin/order/${request.orderId}/status`, {
            status: request.status,
            note: request.note
        });
    }
}
