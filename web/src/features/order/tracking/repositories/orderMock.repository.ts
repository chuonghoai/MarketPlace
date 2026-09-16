import type { ApiResponse } from "../../../../core/api/apiResponse";
import { EOrderStatus } from "../../enums/orderStatus.enum";
import { EPaymentMethod } from "../../enums/paymentMethod.enum";
import { EPaymentStatus } from "../../enums/paymentStatus.enum";
import type { OrderStatusChangeRequest } from "../dto/updateOrder.request";
import type { OrderTrackingDetail } from "../model/orderDetail.model";
import type { OrderItemTracking } from "../model/orderItem.model";
import type { OrderTrackingStatusCount } from "../model/orderStatusCount.model";
import type { OrderRepository } from "./order.repository";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockOrderStatusCount: OrderTrackingStatusCount = {
    all: 10,
    pending: 2,
    preparing: 3,
    shipping: 1,
    success: 3,
    cancelled: 1,
};

const mockOrderItems: OrderItemTracking[] = [
    {
        id: "ORD-2026-0001",
        createdAt: new Date("2026-06-04T10:00:00"),
        orderStatus: EOrderStatus.PENDING,
        totalAmount: 2500000,
        totalProductQuantity: 3,
        firstProductImageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
        firstProductName: "Tai nghe chống ồn Sony WH-1000XM4",
        paymentMethod: EPaymentMethod.COD,
        paymentStatus: EPaymentStatus.PENDING,
    },
    {
        id: "ORD-2026-0002",
        createdAt: new Date("2026-06-03T15:30:00"),
        orderStatus: EOrderStatus.PREPARING,
        totalAmount: 150000,
        totalProductQuantity: 1,
        firstProductImageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60",
        firstProductName: "Ốp lưng điện thoại trong suốt cao cấp",
        paymentMethod: EPaymentMethod.MOMO,
        paymentStatus: EPaymentStatus.PAID,
    },
    {
        id: "ORD-2026-0003",
        createdAt: new Date("2026-06-02T09:15:00"),
        orderStatus: EOrderStatus.SHIPPING,
        totalAmount: 3200000,
        totalProductQuantity: 2,
        firstProductImageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
        firstProductName: "Đồng hồ thông minh Apple Watch Series 8",
        paymentMethod: EPaymentMethod.MOMO,
        paymentStatus: EPaymentStatus.PAID,
    },
    {
        id: "ORD-2026-0004",
        createdAt: new Date("2026-05-30T14:20:00"),
        orderStatus: EOrderStatus.SUCCESS,
        totalAmount: 850000,
        totalProductQuantity: 1,
        firstProductImageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?w=500&auto=format&fit=crop&q=60",
        firstProductName: "Balo laptop thời trang chống nước",
        paymentMethod: EPaymentMethod.COD,
        paymentStatus: EPaymentStatus.PAID,
    },
    {
        id: "ORD-2026-0005",
        createdAt: new Date("2026-05-25T11:45:00"),
        orderStatus: EOrderStatus.CANCELLED,
        totalAmount: 450000,
        totalProductQuantity: 2,
        firstProductImageUrl: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=500&auto=format&fit=crop&q=60",
        firstProductName: "Loa bluetooth mini bass mạnh",
        paymentMethod: EPaymentMethod.MOMO,
        paymentStatus: EPaymentStatus.FAILED,
    }
];

const mockOrderDetail: OrderTrackingDetail = {
    id: "ORD-2026-0001",
    createdAt: new Date("2026-06-04T10:00:00"),
    orderStatus: EOrderStatus.PENDING,
    statusHistory: [
        {
            status: EOrderStatus.PENDING,
            timestamp: new Date("2026-06-04T10:00:00"),
            note: "Hệ thống đã ghi nhận đơn hàng. Đang chờ shop xác nhận."
        }
    ],
    buyerName: "Nguyễn Văn A",
    buyerPhone: "0901234567",
    buyerAddress: "123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    items: [
        {
            orderItemId: "1",
            productId: "PROD-001",
            productName: "Tai nghe chống ồn Sony WH-1000XM4",
            productImageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
            price: 2000000,
            originalPrice: 2500000,
            discountPercentage: 20,
            quantity: 1,
            amount: 2000000,
            isReviewed: false,
        },
        {
            orderItemId: "2",
            productId: "PROD-002",
            productName: "Ốp lưng điện thoại trong suốt cao cấp",
            productImageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60",
            price: 250000,
            originalPrice: 250000,
            discountPercentage: 0,
            quantity: 2,
            amount: 500000,
            isReviewed: true
        }
    ],
    subTotal: 2500000,
    shippingFee: 30000,
    discountAmount: 30000,
    totalAmount: 2500000,
    estimatedDeliveryDate: new Date("2026-06-07"),
    paymentMethod: EPaymentMethod.COD,
    paymentStatus: EPaymentStatus.PENDING
};

const mockOrderDetailPreparing: OrderTrackingDetail = {
    ...mockOrderDetail,
    id: "ORD-2026-0002",
    createdAt: new Date("2026-06-03T15:30:00"),
    orderStatus: EOrderStatus.PREPARING,
    statusHistory: [
        {
            status: EOrderStatus.PENDING,
            timestamp: new Date("2026-06-03T15:30:00"),
            note: "Hệ thống đã ghi nhận đơn hàng."
        },
        {
            status: EOrderStatus.PREPARING,
            timestamp: new Date("2026-06-03T16:00:00"),
            note: "Shop đang chuẩn bị hàng."
        }
    ],
    items: [
        {
            orderItemId: "3",
            productId: "PROD-003",
            productName: "Giày chạy bộ thể thao siêu nhẹ",
            productImageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60",
            price: 150000,
            originalPrice: 200000,
            discountPercentage: 25,
            quantity: 1,
            amount: 150000
        }
    ],
    subTotal: 150000,
    totalAmount: 150000,
    paymentMethod: EPaymentMethod.MOMO,
    paymentStatus: EPaymentStatus.PAID
};

const mockOrderDetailShipping: OrderTrackingDetail = {
    ...mockOrderDetail,
    id: "ORD-2026-0003",
    createdAt: new Date("2026-06-02T09:15:00"),
    orderStatus: EOrderStatus.SHIPPING,
    statusHistory: [
        {
            status: EOrderStatus.PENDING,
            timestamp: new Date("2026-06-02T09:15:00"),
        },
        {
            status: EOrderStatus.PREPARING,
            timestamp: new Date("2026-06-02T10:00:00"),
        },
        {
            status: EOrderStatus.SHIPPING,
            timestamp: new Date("2026-06-03T08:30:00"),
            note: "Đơn hàng đã được giao cho đơn vị vận chuyển J&T Express."
        }
    ],
    paymentMethod: EPaymentMethod.MOMO,
    paymentStatus: EPaymentStatus.PAID
};

const mockOrderDetailSuccess: OrderTrackingDetail = {
    ...mockOrderDetail,
    id: "ORD-2026-0004",
    createdAt: new Date("2026-05-30T14:20:00"),
    orderStatus: EOrderStatus.SUCCESS,
    statusHistory: [
        {
            status: EOrderStatus.PENDING,
            timestamp: new Date("2026-05-30T14:20:00"),
        },
        {
            status: EOrderStatus.PREPARING,
            timestamp: new Date("2026-05-30T15:00:00"),
        },
        {
            status: EOrderStatus.SHIPPING,
            timestamp: new Date("2026-05-31T09:00:00"),
        },
        {
            status: EOrderStatus.DELIVERED,
            timestamp: new Date("2026-06-01T14:30:00"),
            note: "Giao hàng thành công."
        },
        {
            status: EOrderStatus.SUCCESS,
            timestamp: new Date("2026-06-01T15:00:00"),
            note: "Đơn hàng đã hoàn tất."
        }
    ],
    paymentMethod: EPaymentMethod.COD,
    paymentStatus: EPaymentStatus.PAID
};

const mockOrderDetailCancelled: OrderTrackingDetail = {
    ...mockOrderDetail,
    id: "ORD-2026-0005",
    createdAt: new Date("2026-05-25T11:45:00"),
    orderStatus: EOrderStatus.CANCELLED,
    statusHistory: [
        {
            status: EOrderStatus.PENDING,
            timestamp: new Date("2026-05-25T11:45:00"),
        },
        {
            status: EOrderStatus.CANCELLED,
            timestamp: new Date("2026-05-25T14:00:00"),
            note: "Đơn hàng đã bị hủy."
        }
    ],
    cancelReason: "Khách hàng đổi ý, không muốn mua nữa",
    paymentMethod: EPaymentMethod.MOMO,
    paymentStatus: EPaymentStatus.FAILED
};

const getMockOrderDetail = (id: string) => {
    if (id === 'ORD-2026-0001') return mockOrderDetail;
    if (id === 'ORD-2026-0002') return mockOrderDetailPreparing;
    if (id === 'ORD-2026-0003') return mockOrderDetailShipping;
    if (id === 'ORD-2026-0004') return mockOrderDetailSuccess;
    if (id === 'ORD-2026-0005') return mockOrderDetailCancelled;
    return mockOrderDetail;
};

export class OrderMockRepository implements OrderRepository {
    async getOrders(status?: EOrderStatus): Promise<ApiResponse<OrderItemTracking[]>> {
        await delay(500);

        let filteredItems = mockOrderItems;
        if (status) {
            filteredItems = mockOrderItems.filter(item => item.orderStatus === status);
        }

        return {
            success: true,
            data: filteredItems,
            message: "Lấy danh sách đơn hàng thành công",
        };
    }

    async getOrderStatusCount(): Promise<ApiResponse<OrderTrackingStatusCount>> {
        await delay(300);
        return {
            success: true,
            data: mockOrderStatusCount,
            message: "Lấy thống kê đơn hàng thành công",
        };
    }

    async getOrderDetailById(orderId: string): Promise<ApiResponse<OrderTrackingDetail>> {
        await delay(500);
        const detail = getMockOrderDetail(orderId);

        return {
            success: true,
            data: detail,
            message: "Lấy chi tiết đơn hàng thành công",
        };
    }

    async changeOrderStatus(request: OrderStatusChangeRequest): Promise<ApiResponse<OrderTrackingDetail>> {
        await delay(600);

        const detail = { ...getMockOrderDetail(request.orderId) };
        detail.orderStatus = request.newStatus;
        detail.cancelReason = request.note;

        detail.statusHistory = [
            ...detail.statusHistory,
            {
                status: request.newStatus,
                timestamp: new Date(),
                note: request.note,
            }
        ];

        return {
            success: true,
            data: detail,
            message: "Cập nhật trạng thái đơn hàng thành công",
        };
    }
}
