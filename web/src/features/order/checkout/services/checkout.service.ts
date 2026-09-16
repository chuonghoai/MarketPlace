import type { ApiResponse } from "../../../../core/api/apiResponse";
import { USE_MOCK } from "../../../../core/config/useMock.config";
import type { CheckoutRequestDto, CheckoutResponseDto } from "../dto/checkoutRequest.dto";
import type { PrepareCheckoutPayload } from "../dto/prepareCheckout.dto";
import type { PrepareCheckoutModel } from "../models/checkout.model";
import type { CheckoutResultDto } from "../models/checkoutResult.dto";
import type { CheckoutRepository } from "../repositories/checkout.repository";
import { CheckoutApiRepository } from "../repositories/checkoutApi.repository";
import { CheckoutMockRepository } from "../repositories/checkoutMock.repository";

export class CheckoutService {
    private readonly checkoutRepository: CheckoutRepository;

    constructor(checkoutRepository?: CheckoutRepository) {
        this.checkoutRepository = checkoutRepository || new CheckoutApiRepository();
    }

    async prepareOrder(request: PrepareCheckoutPayload): Promise<ApiResponse<PrepareCheckoutModel>> {
        return this.checkoutRepository.prepareOrder(request);
    }

    async checkoutOrder(request: CheckoutRequestDto): Promise<ApiResponse<CheckoutResponseDto>> {
        return this.checkoutRepository.checkoutOrder(request);
    }

    async getOrderResult(orderId: string): Promise<ApiResponse<CheckoutResultDto>> {
        return this.checkoutRepository.getOrderResult(orderId);
    }
}

export const checkoutService = new CheckoutService(USE_MOCK ? new CheckoutMockRepository() : undefined);