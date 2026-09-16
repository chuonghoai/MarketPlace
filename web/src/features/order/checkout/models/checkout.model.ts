import type { ProductItem } from "../../../products/models/product.model";

/**
 * Các sản phẩm được chọn để chuẩn bị tạo đơn hàng
 */
type CheckoutItem = {
    product: {
        id: ProductItem["id"];
        name: ProductItem["name"];
        imageUrl: ProductItem["imageUrl"];
        price: ProductItem["price"];
        originalPrice: ProductItem["originalPrice"];
        discountPercentage: ProductItem["discountPercentage"];
    };
    quantity: number;
    amount: number;     // = quantity * amount
}

/**
 * Địa chỉ mặc định của người dùng
 * Nếu user chưa có địa chỉ, trả về null
 */
export type Address = {
    id: number;

    fullName: string;
    phoneNumber: string;

    provinceCode: number;
    provinceName: string;   // Ví dụ: TPHCM

    districtCode: number;
    districtName: string;   // Ví dụ: Quận 1

    wardCode: number;
    wardName: string;       // Ví dụ: Phường Bến Thành

    street: string;         // Ví dụ: Số 227 Nguyễn Văn Cừ

    latitude: number;   // Vĩ độ, kinh độ dùng để tính khoảng cách đến shop -> tính shipping fee
    longitude: number;

    fullAddress: string;    // Chuỗi hoàn chính: Số 227 Nguyễn Văn Cừ, Phường Bến Thành, Quận 1, TPHCM

    isDefault?: boolean;    // true nếu đây là địa chỉ mặc định
}

/**
 * Sản phẩm không khả dụng
 * Ví dụ: Sản phẩm hết hàng, sản phẩm không tồn tại...
 * Có thể trả về null nếu toàn bộ đều hợp lệ
 */
type InvalidItem = {
    productId: string;
    reason: string;
};

export interface AppliedVoucher {
    voucherCode: string;
    voucherType: string;
    discountValue: number;
}

export interface PrepareCheckoutModel {
    prepareTempId: string;
    address: Address | null;   // Địa chỉ giao hàng

    items: CheckoutItem[];  // Danh sách product muốn mua

    subTotal: number;   // Tổng tiền sản phẩm
    shippingFee: number;    // Phí vận chuyển: Backend dựa vào tọa độ của address, dùng google map để tính giá tiền
    discountAmount: number; // Số tiền được giảm (sản phẩm)
    shippingDiscountAmount: number; // Số tiền được giảm (vận chuyển)
    appliedVouchers: AppliedVoucher[]; // Danh sách voucher được áp dụng
    totalAmount: number;    // = subTotal + shippingFee - discountAmount - shippingDiscountAmount

    invalidItems: InvalidItem[];    // Các sản phẩm không khả dụng
}

export interface DraftOrderModel {
    prepareTempId: string;
    createdAt: string;
    updatedAt: string;
    expiredAt: string;
    numberOfItems: number;
    totalQuantity: number;
    estimatedTotalPrice: number;
    firstProductThumbnail: string | null;
    productNamesSummary: string | null;
    status: string;
}