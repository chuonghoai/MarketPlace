import type { ApiResponse } from "../../../../core/api/apiResponse";
import type { CheckoutRequestDto, CheckoutResponseDto } from "../dto/checkoutRequest.dto";
import type { PrepareCheckoutPayload } from "../dto/prepareCheckout.dto";
import type { PrepareCheckoutModel, DraftOrderModel } from "../models/checkout.model";
import type { CheckoutResultDto } from "../models/checkoutResult.dto";

export interface CheckoutRepository {
    prepareOrder(request: PrepareCheckoutPayload): Promise<ApiResponse<PrepareCheckoutModel>>;

    checkoutOrder(request: CheckoutRequestDto): Promise<ApiResponse<CheckoutResponseDto>>;

    getOrderResult(orderId: string): Promise<ApiResponse<CheckoutResultDto>>;

    getDraftOrders(): Promise<ApiResponse<DraftOrderModel[]>>;
}