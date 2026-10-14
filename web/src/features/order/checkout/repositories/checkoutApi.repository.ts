import { apiClient } from "../../../../core/api/apiClient";
import type { ApiResponse } from "../../../../core/api/apiResponse";
import type { CheckoutRequestDto, CheckoutResponseDto } from "../dto/checkoutRequest.dto";
import type { PrepareCheckoutPayload } from "../dto/prepareCheckout.dto";
import type { PrepareCheckoutModel, DraftOrderModel } from "../models/checkout.model";
import type { CheckoutResultDto } from "../models/checkoutResult.dto";
import type { CheckoutRepository } from "./checkout.repository";

export class CheckoutApiRepository implements CheckoutRepository {
    // Chuẩn bị thông tin đơn hàng
    async prepareOrder(request: PrepareCheckoutPayload): Promise<ApiResponse<PrepareCheckoutModel>> {
        return apiClient.post<ApiResponse<PrepareCheckoutModel>>("/orders/prepare-cart", request);
    }

    // Đặt hàng và xử lý thanh toán
    async checkoutOrder(request: CheckoutRequestDto): Promise<ApiResponse<CheckoutResponseDto>> {
        return apiClient.post<ApiResponse<CheckoutResponseDto>>("/orders/checkout", request);
    }

    // Lấy trạng thái thanh toán đơn hàng
    async getOrderResult(orderId: string): Promise<ApiResponse<CheckoutResultDto>> {
        return apiClient.get<ApiResponse<CheckoutResultDto>>(`/checkout/orders/${orderId}/payment-status`);
    }

    // Lấy danh sách đơn nháp
    async getDraftOrders(): Promise<ApiResponse<DraftOrderModel[]>> {
        return apiClient.get<ApiResponse<DraftOrderModel[]>>("/orders/temp/prepare");
    }
}