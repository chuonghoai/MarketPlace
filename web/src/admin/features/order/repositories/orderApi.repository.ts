import { apiClient } from "../../../../core/api/apiClient";
import type { ApiResponse } from "../../../../core/api/apiResponse";
import type { EOrderStatus } from "../../../../features/order/enums/orderStatus.enum";
import type { OrderItem } from "../model/orderItem.model";
import type { OrderStatusCount } from "../model/orderStatusCount.model";
import type { OrderDetail } from "../model/orderDetail.model";
import type { UpdateOrderStatusRequest } from "../dto/updateOrderStatus.request";
import type { OrderRepository } from "./order.repository";

export class OrderApiRepository implements OrderRepository {
    /**
     * GET /admin/order
     * @param status - Có thể null
     * @returns OrderItem[]
     * 
     * Mô tả:
     *  - Nếu truyền status -> lọc đơn hàng theo đúng status
     *  - Nếu không có status -> Lọc đơn hàng có status là PENDING, PREPARING, SHIPPING.
     *      Sắp xếp theo thứ tự PENDING -> PREPARING -> SHIPPING và giảm dần theo ngày tạo đơn hàng (createAt)
     */
    async getOrdersByStatus(status?: EOrderStatus): Promise<ApiResponse<OrderItem[]>> {
        const params = status ? { status } : undefined;
        return apiClient.get("/admin/order", {
            params
        })
    }

    /**
     * GET /admin/order/status-count
     * @returns OrderStatusCount
     * 
     * Mô tả:
     *  - Lấy số lượng đơn hàng theo từng trạng thái trong model OrderStatusCount
     *  - trong đó, all = pending + preparing + shipping 
     */
    async getOrderStatusCounts(): Promise<ApiResponse<OrderStatusCount>> {
        return apiClient.get("/admin/order/status-count")
    }

    /**
     * GET /admin/order/:id
     * @param orderId
     * @returns OrderDetail
     */
    async getOrderDetailById(orderId: string): Promise<ApiResponse<OrderDetail>> {
        return apiClient.get(`/admin/order/${orderId}`);
    }

    /**
     * PATCH /admin/order/:id/status
     * @param UpdateOrderStatusRequest
     * @returns OrderDetail
     */
    async updateOrderStatus(request: UpdateOrderStatusRequest): Promise<ApiResponse<OrderDetail>> {
        return apiClient.patch(`/admin/order/${request.orderId}/status`, {
            status: request.status,
            note: request.note
        });
    }
}
