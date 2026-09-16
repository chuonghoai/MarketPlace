import type { ApiResponse } from "../../../../core/api/apiResponse";
import { EOrderStatus } from "../../enums/orderStatus.enum";
import type { OrderTrackingDetail } from "../model/orderDetail.model";
import type { OrderItemTracking } from "../model/orderItem.model";
import type { OrderTrackingStatusCount } from "../model/orderStatusCount.model";
import type { OrderRepository } from "../repositories/order.repository";
import { OrderApiRepository } from "../repositories/orderApi.repository";
import { OrderMockRepository } from "../repositories/orderMock.repository";
import { USE_MOCK } from "../../../../core/config/useMock.config";

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

    /**
     * Hủy đơn hàng
     */
    async cancelOrder(orderId: string, note: string): Promise<ApiResponse<OrderTrackingDetail>> {
        const newStatus = EOrderStatus.CANCELLED;
        return this.orderRepository.changeOrderStatus({ orderId, newStatus, note });
    }

    /**
     * Yêu cầu trả hàng
     */
    async returnOrder(orderId: string, note: string): Promise<ApiResponse<OrderTrackingDetail>> {
        const newStatus = EOrderStatus.RETURNED;
        return this.orderRepository.changeOrderStatus({ orderId, newStatus, note });
    }
}

export const orderService = new OrderService(USE_MOCK ? new OrderMockRepository() : undefined);