import type { OrderRepository } from "../repositories/order.repository";
import type { OrderItem } from "../model/orderItem.model";
import type { EOrderStatus } from "../../../../features/order/enums/orderStatus.enum";
import type { ApiResponse } from "../../../../core/api/apiResponse";
import { OrderMockRepository } from "../repositories/orderMock.repository";
import { OrderApiRepository } from "../repositories/orderApi.repository";
import { USE_MOCK } from "../../../../core/config/useMock.config";
import type { OrderStatusCount } from "../model/orderStatusCount.model";
import type { OrderDetail } from "../model/orderDetail.model";
import type { UpdateOrderStatusRequest } from "../dto/updateOrderStatus.request";
import { apiClient } from "../../../../core/api/apiClient";

export class OrderService {
    private readonly orderRepository: OrderRepository;

    constructor(orderRepository?: OrderRepository) {
        this.orderRepository = orderRepository || new OrderApiRepository();
    }

    getOrdersByStatus(status?: EOrderStatus): Promise<ApiResponse<OrderItem[]>> {
        return this.orderRepository.getOrdersByStatus(status);
    }

    getOrderStatusCount(): Promise<ApiResponse<OrderStatusCount>> {
        return this.orderRepository.getOrderStatusCounts();
    }

    getOrderDetail(id: string): Promise<ApiResponse<OrderDetail>> {
        return this.orderRepository.getOrderDetailById(id);
    }

    updateOrderStatus(request: UpdateOrderStatusRequest): Promise<ApiResponse<OrderDetail>> {
        return this.orderRepository.updateOrderStatus(request);
    }

    // Xử lý đổi trả, hoàn tiền (UC23)

    getReturnRequests(page = 1, limit = 20, status?: string): Promise<ApiResponse<any>> {
        const query = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (status) query.append('status', status);
        return apiClient.get(`/admin/order/return-requests?${query.toString()}`);
    }

    processExchange(id: string, data: { shippingAddress?: string; adminNote?: string }): Promise<ApiResponse<any>> {
        return apiClient.patch(`/admin/order/return-requests/${id}/exchange`, data);
    }

    processPickup(id: string, step: 'PICKING_UP' | 'RECEIVED', note?: string): Promise<ApiResponse<any>> {
        return apiClient.patch(`/admin/order/return-requests/${id}/pickup`, { step, note });
    }

    processRefund(id: string, note?: string, refundProofUrl?: string): Promise<ApiResponse<any>> {
        return apiClient.patch(`/admin/order/return-requests/${id}/refund`, { note, refundProofUrl });
    }
}

export const orderService = new OrderService(USE_MOCK ? new OrderMockRepository() : undefined);