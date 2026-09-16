import type { EOrderStatus } from "../../../../features/order/enums/orderStatus.enum";
import type { EPaymentMethod } from "../../../../features/order/enums/paymentMethod.enum";
import type { EPaymentStatus } from "../../../../features/order/enums/paymentStatus.enum";

/**
 * id: orderId
 * createAt: Ngày tạo đơn hàng
 * orderStatus: Trạng thái đơn hàng
 * 
 * totalAmount: Tổng giá trị đơn hàng (tính cả shippingFee, discount...)
 * totalProductQuantity: Tổng số lượng sản phẩm của đơn hàng
 * 
 * firstProductImageUrl: Ảnh của sản phẩm đầu tiên trong đơn hàng (dùng để làm ảnh đại diện của đơn hàng)
 * 
 * paymentMethod: Phương thức thanh toán
 * paymentStatus: Trạng thái thanh toán
 */
export interface OrderItemTracking {
    id: string;
    createdAt: Date;
    orderStatus: EOrderStatus;

    totalAmount: number;
    totalProductQuantity: number;

    firstProductImageUrl: string;
    firstProductName: string;

    paymentMethod: EPaymentMethod;
    paymentStatus: EPaymentStatus;
}