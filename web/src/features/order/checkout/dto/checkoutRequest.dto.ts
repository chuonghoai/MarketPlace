import type { EPaymentMethod } from "../../enums/paymentMethod.enum";

// Mua sản phẩm theo productId và số lượng
export interface CheckoutItemRequest {
    productId: string;
    quantity: number;
}

// Request đặt đơn hàng
export interface CheckoutRequestDto {
    items: CheckoutItemRequest[];

    addressId: number;

    paymentMethod: EPaymentMethod;

    voucherCodes?: string[];

    useWallet?: boolean;
}

// Response đặt đơn hàng
export interface CheckoutResponseDto {
    paymentRequired: boolean,
    orderId: string,
    payUrl: string | null
}