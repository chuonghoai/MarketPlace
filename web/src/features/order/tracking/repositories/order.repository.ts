import type { ApiResponse } from "../../../../core/api/apiResponse";
import type { EOrderStatus } from "../../enums/orderStatus.enum";
import type { OrderStatusChangeRequest } from "../dto/updateOrder.request";
import type { OrderTrackingDetail } from "../model/orderDetail.model";
import type { OrderItemTracking } from "../model/orderItem.model";
import type { OrderTrackingStatusCount } from "../model/orderStatusCount.model";

export interface OrderRepository {
    getOrders(status?: EOrderStatus): Promise<ApiResponse<OrderItemTracking[]>>;
    getOrderStatusCount(): Promise<ApiResponse<OrderTrackingStatusCount>>;

    getOrderDetailById(orderId: string): Promise<ApiResponse<OrderTrackingDetail>>;

    changeOrderStatus(request: OrderStatusChangeRequest): Promise<ApiResponse<OrderTrackingDetail>>;
}