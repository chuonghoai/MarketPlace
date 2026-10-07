import type { ApiResponse } from "../../../../core/api/apiResponse";
import { EOrderStatus } from "../../enums/orderStatus.enum";
import type { OrderTrackingDetail } from "../model/orderDetail.model";
import type { OrderItemTracking } from "../model/orderItem.model";
import type { OrderTrackingStatusCount } from "../model/orderStatusCount.model";
import type { OrderRepository } from "../repositories/order.repository";
import { OrderApiRepository } from "../repositories/orderApi.repository";
import { OrderMockRepository } from "../repositories/orderMock.repository";
import { USE_MOCK } from "../../../../core/config/useMock.config";
import { apiClient } from "../../../../core/api/apiClient";

export class OrderService {
    private readonly orderRepository: OrderRepository;

    constructor(orderRepository?: OrderRepository) {
        this.orderRepository = orderRepository || new OrderApiRepository();
    }

    async getOrders(status?: EOrderStatus): Promise<ApiResponse<OrderItemTracking[]>> {
        const statusRequest = status ? status : undefined;
        return this.orderRepository.getOrders(statusRequest);
    }

    async getOrderStatusCount(): Promise<ApiResponse<OrderTrackingStatusCount>> {
        return this.orderRepository.getOrderStatusCount();
    }

    async getOrderDetailById(orderId: string): Promise<ApiResponse<OrderTrackingDetail>> {
        return this.orderRepository.getOrderDetailById(orderId);
    }

    // Hủy đơn hàng
    async cancelOrder(orderId: string, note: string): Promise<ApiResponse<OrderTrackingDetail>> {
        const newStatus = EOrderStatus.CANCELLED;
        return this.orderRepository.changeOrderStatus({ orderId, newStatus, note });
    }

    // Yêu cầu đổi trả (UC23)
    async returnOrder(orderId: string, note: string): Promise<ApiResponse<OrderTrackingDetail>> {
        const newStatus = EOrderStatus.RETURNED;
        return this.orderRepository.changeOrderStatus({ orderId, newStatus, note });
    }

    async createReturnRequest(orderId: string, data: {
        type: 'EXCHANGE' | 'RETURN_REFUND';
        title: string;
        reason: string;
        proofImages?: string[];
        proofVideos?: string[];
        bankName?: string;
        bankAccountNumber?: string;
        bankAccountHolder?: string;
    }): Promise<ApiResponse<any>> {
        return apiClient.post(`/orders/tracking/${orderId}/return-request`, data);
    }
}

export const orderService = new OrderService(USE_MOCK ? new OrderMockRepository() : undefined);