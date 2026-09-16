import { apiClient } from "../../../../core/api/apiClient";
import type { ApiResponse } from "../../../../core/api/apiResponse";
import type { CheckoutRequestDto, CheckoutResponseDto } from "../dto/checkoutRequest.dto";
import type { PrepareCheckoutPayload } from "../dto/prepareCheckout.dto";
import type { PrepareCheckoutModel, DraftOrderModel } from "../models/checkout.model";
import type { CheckoutResultDto } from "../models/checkoutResult.dto";
import type { CheckoutRepository } from "./checkout.repository";

export class CheckoutApiRepository implements CheckoutRepository {
    /**
     * POST /orders/prepare
     * @body request: PrepareCheckoutPayload
     * @returns PrepareCheckoutModel
     */
    async prepareOrder(request: PrepareCheckoutPayload): Promise<ApiResponse<PrepareCheckoutModel>> {
        return apiClient.post<ApiResponse<PrepareCheckoutModel>>("/orders/prepare-cart", request);
    }

    /**
     * POST /orders/checkout
     * @body CheckoutRequestDto
     * @returns CheckoutResponseDto
     * 
     * Mô tả:
     *  - Nếu CheckoutRequestDto.paymentMethod là COD 
     *      => paymentRequired = false, orderId = id đơn hàng vừa tạo, payUrl = null
     *  - Nếu CheckoutRequestDto.paymentMethod là MOMO 
     *      => paymentRequired = true, orderId = id đơn hàng vừa tạo, payUrl = url để redirect user thanh toán
     * 
     *  - Trong backend, nếu thanh toán thành công, cần trừ đi các sản phẩm trong giỏ hàng nếu có 
     *    (để handle trường hợp user thanh toán thành công nhưng user chưa xóa sản phẩm trong giỏ hàng)
     */
    async checkoutOrder(request: CheckoutRequestDto): Promise<ApiResponse<CheckoutResponseDto>> {
        return apiClient.post<ApiResponse<CheckoutResponseDto>>("/orders/checkout", request);
    }

    /**
     * GET /checkout/orders/:id/payment-status
     * @param orderId
     * @returns CheckoutResultDto
     */
    async getOrderResult(orderId: string): Promise<ApiResponse<CheckoutResultDto>> {
        return apiClient.get<ApiResponse<CheckoutResultDto>>(`/checkout/orders/${orderId}/payment-status`);
    }

    /**
     * GET /orders/temp/prepare
     * @returns DraftOrderModel[]
     */
    async getDraftOrders(): Promise<ApiResponse<DraftOrderModel[]>> {
        return apiClient.get<ApiResponse<DraftOrderModel[]>>("/orders/temp/prepare");
    }
}