import type { EOrderStatus } from "../../../../features/order/enums/orderStatus.enum";
import type { EPaymentMethod } from "../../../../features/order/enums/paymentMethod.enum";
import type { EPaymentStatus } from "../../../../features/order/enums/paymentStatus.enum";

/**
 * Lịch sử cập nhật trạng thái đơn hàng
 */
export interface OrderStatusHistory {
    status: EOrderStatus;
    timestamp: string;        // Ngày cập nhật
    /**
     * Ghi chú:
     *  - PENDING: Khách hàng đặt hàng
     *  - PREPARING: Shop đã xác nhận đơn
     *  - SHIPPING: Đã giao cho ĐVVC
     *  - DELIVERED: Giao hàng thành công
     *  - SUCCESS: Hoàn tất đơn hàng
     *  - CANCELLED: Đơn hàng đã bị hủy
     *  - RETURNED: Khách hàng đã yêu cầu hoàn trả
     */
    note?: string;
}

/**
 * Chi tiết từng sản phẩm trong đơn hàng
 */
export interface OrderDetailProductItem {
    productId: string;
    productName: string;
    productImageUrl: string;

    price: number;              // Giá lúc mua
    originalPrice: number;      // Giá gốc lúc mua
    discountPercentage: number;

    quantity: number;           // Số lượng mua
    amount: number;             // Tổng tiền (= price * quantity)
}

export interface OrderVoucherItem {
    voucherCode: string;
    discountAmount: number;
    voucherSnapshot: any;
}

/**
 * Chi tiết đơn hàng cho admin quản lý
 */
export interface OrderDetail {
    id: string;
    createdAt: string;
    statusHistory: OrderStatusHistory[];    // Lịch sử trạng thái đơn hàng
    orderStatus: EOrderStatus;

    buyerName: string;
    buyerPhone: string;
    buyerAddress: string;       // Là FullAdress của người mua
    latitude: number;
    longitude: number;

    items: OrderDetailProductItem[];

    subTotal: number;           // Tổng tiền sản phẩm
    shippingFee: number;        // Phí vận chuyển
    discountAmount?: number;    // Số tiền được giảm (sản phẩm)
    shippingDiscountAmount?: number; // Số tiền được giảm (vận chuyển)
    vouchers?: OrderVoucherItem[];
    totalAmount: number;        // Tổng thanh toán (= subTotal + shippingFee - discountAmount)

    paymentMethod: EPaymentMethod;
    paymentStatus: EPaymentStatus;

    cancelReason?: string;      // Lý do hủy đơn nếu EOrderStatus là CANCELLED hoặc RETURNED
}