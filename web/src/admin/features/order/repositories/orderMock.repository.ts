import type { ApiResponse } from "../../../../core/api/apiResponse";
import { EOrderStatus } from "../../../../features/order/enums/orderStatus.enum";
import { EPaymentMethod } from "../../../../features/order/enums/paymentMethod.enum";
import { EPaymentStatus } from "../../../../features/order/enums/paymentStatus.enum";
import type { OrderItem } from "../model/orderItem.model";
import type { OrderStatusCount } from "../model/orderStatusCount.model";
import type { OrderDetail, OrderStatusHistory } from "../model/orderDetail.model";
import type { UpdateOrderStatusRequest } from "../dto/updateOrderStatus.request";
import type { OrderRepository } from "./order.repository";

const mockOrder: OrderItem[] = [
    {
        id: "aaaaa",
        createdAt: new Date(),
        orderStatus: EOrderStatus.PENDING,
        totalAmount: 100000,
        totalProductQuantity: 1,
        firstProductImageUrl: "https://salt.tikicdn.com/ts/tmp/a7/3d/ae/acf43cbb439f0fd6b01ca9338c108c6a.jpg",
        buyerName: "Alice",
        buyerAddress: "Address 1",
        buyerPhone: "1234567890",
        paymentMethod: EPaymentMethod.COD,
        paymentStatus: EPaymentStatus.PENDING
    },
    {
        id: "bbbbb",
        createdAt: new Date(),
        orderStatus: EOrderStatus.PREPARING,
        totalAmount: 100000,
        totalProductQuantity: 1,
        firstProductImageUrl: "https://salt.tikicdn.com/ts/tmp/a7/3d/ae/acf43cbb439f0fd6b01ca9338c108c6a.jpg",
        buyerName: "Bob",
        buyerAddress: "Address 2",
        buyerPhone: "1234567890",
        paymentMethod: EPaymentMethod.MOMO,
        paymentStatus: EPaymentStatus.PAID
    },
    {
        id: "cccccc",
        createdAt: new Date(),
        orderStatus: EOrderStatus.SHIPPING,
        totalAmount: 100000,
        totalProductQuantity: 1,
        firstProductImageUrl: "https://salt.tikicdn.com/ts/tmp/a7/3d/ae/acf43cbb439f0fd6b01ca9338c108c6a.jpg",
        buyerName: "Charlie",
        buyerAddress: "Address 1",
        buyerPhone: "1234567890",
        paymentMethod: EPaymentMethod.COD,
        paymentStatus: EPaymentStatus.PENDING
    },
    {
        id: "ddddd",
        createdAt: new Date(),
        orderStatus: EOrderStatus.SUCCESS,
        totalAmount: 100000,
        totalProductQuantity: 1,
        firstProductImageUrl: "https://salt.tikicdn.com/ts/tmp/a7/3d/ae/acf43cbb439f0fd6b01ca9338c108c6a.jpg",
        buyerName: "Doflamingo",
        buyerAddress: "Address 1",
        buyerPhone: "1234567890",
        paymentMethod: EPaymentMethod.COD,
        paymentStatus: EPaymentStatus.PENDING
    },
    {
        id: "ddddd",
        createdAt: new Date(),
        orderStatus: EOrderStatus.CANCELLED,
        totalAmount: 100000,
        totalProductQuantity: 1,
        firstProductImageUrl: "https://salt.tikicdn.com/ts/tmp/a7/3d/ae/acf43cbb439f0fd6b01ca9338c108c6a.jpg",
        buyerName: "Zoro",
        buyerAddress: "Address 1",
        buyerPhone: "1234567890",
        paymentMethod: EPaymentMethod.COD,
        paymentStatus: EPaymentStatus.PENDING
    }
]

export class OrderMockRepository implements OrderRepository {
    async getOrdersByStatus(status?: EOrderStatus): Promise<ApiResponse<OrderItem[]>> {
        let orders: OrderItem[];
        if (!status)
            orders = mockOrder.filter(order =>
                order.orderStatus === EOrderStatus.PENDING ||
                order.orderStatus === EOrderStatus.PREPARING ||
                order.orderStatus === EOrderStatus.SHIPPING
            )
        else
            orders = mockOrder.filter(order => order.orderStatus === status)

        return Promise.resolve({
            success: true,
            message: "Success",
            data: orders
        })
    }

    async getOrderStatusCounts(): Promise<ApiResponse<OrderStatusCount>> {
        const pending = mockOrder.filter(order => order.orderStatus === EOrderStatus.PENDING).length
        const preparing = mockOrder.filter(order => order.orderStatus === EOrderStatus.PREPARING).length
        const shipping = mockOrder.filter(order => order.orderStatus === EOrderStatus.SHIPPING).length
        const success = mockOrder.filter(order => order.orderStatus === EOrderStatus.SUCCESS).length
        const cancelled = mockOrder.filter(order => order.orderStatus === EOrderStatus.CANCELLED).length
        let statusCount: OrderStatusCount = {
            all: pending + preparing + shipping,
            pending,
            preparing,
            shipping,
            success,
            cancelled
        }
        return Promise.resolve({
            success: true,
            message: "Success",
            data: statusCount
        })
    }

    async getOrderDetailById(orderId: string): Promise<ApiResponse<OrderDetail>> {
        const orderInfo = mockOrder.find(o => o.id === orderId) || mockOrder[0];

        const mockStatusHistory: OrderStatusHistory[] = [
            { status: EOrderStatus.PENDING, timestamp: new Date(orderInfo.createdAt.getTime()).toISOString(), note: "Khách hàng đặt hàng" }
        ];

        if (orderInfo.orderStatus === EOrderStatus.PREPARING ||
            orderInfo.orderStatus === EOrderStatus.SHIPPING ||
            orderInfo.orderStatus === EOrderStatus.DELIVERED ||
            orderInfo.orderStatus === EOrderStatus.SUCCESS) {
            mockStatusHistory.push({ status: EOrderStatus.PREPARING, timestamp: new Date(orderInfo.createdAt.getTime() + 1000 * 60 * 60).toISOString(), note: "Shop đã xác nhận đơn" });
        }

        if (orderInfo.orderStatus === EOrderStatus.SHIPPING ||
            orderInfo.orderStatus === EOrderStatus.DELIVERED ||
            orderInfo.orderStatus === EOrderStatus.SUCCESS) {
            mockStatusHistory.push({ status: EOrderStatus.SHIPPING, timestamp: new Date(orderInfo.createdAt.getTime() + 1000 * 60 * 60 * 24).toISOString(), note: "Đã giao cho ĐVVC" });
        }

        if (orderInfo.orderStatus === EOrderStatus.DELIVERED ||
            orderInfo.orderStatus === EOrderStatus.SUCCESS) {
            mockStatusHistory.push({ status: EOrderStatus.DELIVERED, timestamp: new Date(orderInfo.createdAt.getTime() + 1000 * 60 * 60 * 48).toISOString(), note: "Giao hàng thành công" });
        }

        if (orderInfo.orderStatus === EOrderStatus.SUCCESS) {
            mockStatusHistory.push({ status: EOrderStatus.SUCCESS, timestamp: new Date(orderInfo.createdAt.getTime() + 1000 * 60 * 60 * 72).toISOString(), note: "Hoàn tất đơn hàng" });
        }

        if (orderInfo.orderStatus === EOrderStatus.CANCELLED) {
            mockStatusHistory.push({ status: EOrderStatus.CANCELLED, timestamp: new Date(orderInfo.createdAt.getTime() + 1000 * 60 * 30).toISOString(), note: "Đơn hàng đã bị hủy" });
        }

        if (orderInfo.orderStatus === EOrderStatus.RETURNED) {
            mockStatusHistory.push({ status: EOrderStatus.RETURNED, timestamp: new Date(orderInfo.createdAt.getTime() + 1000 * 60 * 60 * 24 * 3).toISOString(), note: "Khách hàng đã yêu cầu hoàn trả" });
        }

        const mockDetail: OrderDetail = {
            id: orderInfo.id,
            createdAt: orderInfo.createdAt.toISOString(),
            statusHistory: mockStatusHistory,
            orderStatus: orderInfo.orderStatus,
            buyerName: orderInfo.buyerName,
            buyerPhone: orderInfo.buyerPhone,
            buyerAddress: orderInfo.buyerAddress,
            latitude: 10.762622,
            longitude: 106.660172,
            items: [
                {
                    productId: "p1",
                    productName: "Sản phẩm Demo 1",
                    productImageUrl: orderInfo.firstProductImageUrl,
                    price: 50000,
                    originalPrice: 60000,
                    discountPercentage: 16.67,
                    quantity: 1,
                    amount: 50000
                },
                {
                    productId: "p2",
                    productName: "Sản phẩm Demo 2",
                    productImageUrl: orderInfo.firstProductImageUrl,
                    price: 50000,
                    originalPrice: 50000,
                    discountPercentage: 0,
                    quantity: 1,
                    amount: 50000
                }
            ],
            subTotal: 100000,
            shippingFee: 20000,
            discountAmount: 10000,
            totalAmount: 110000,
            paymentMethod: orderInfo.paymentMethod,
            paymentStatus: orderInfo.paymentStatus
        };

        return Promise.resolve({
            success: true,
            message: "Success",
            data: mockDetail
        });
    }

    async updateOrderStatus(request: UpdateOrderStatusRequest): Promise<ApiResponse<OrderDetail>> {
        const orderIndex = mockOrder.findIndex(o => o.id === request.orderId);
        if (orderIndex !== -1) {
            mockOrder[orderIndex].orderStatus = request.status;
        }

        return this.getOrderDetailById(request.orderId);
    }
}