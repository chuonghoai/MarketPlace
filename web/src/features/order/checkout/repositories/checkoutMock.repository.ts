import type { ApiResponse } from "../../../../core/api/apiResponse";
import type { CheckoutRequestDto, CheckoutResponseDto } from "../dto/checkoutRequest.dto";
import type { PrepareCheckoutPayload } from "../dto/prepareCheckout.dto";
import { EPaymentMethod } from "../../enums/paymentMethod.enum";
import type { PrepareCheckoutModel, DraftOrderModel } from "../models/checkout.model";
import type { CheckoutRepository } from "./checkout.repository";
import type { CheckoutResultDto } from "../models/checkoutResult.dto";
import { EPaymentStatus } from "../../enums/paymentStatus.enum";

export class CheckoutMockRepository implements CheckoutRepository {
    async prepareOrder(request: PrepareCheckoutPayload): Promise<ApiResponse<PrepareCheckoutModel>> {
        // const subTotal = request.items.reduce((sum, item) => sum + 100000 * item.quantity, 0);
        const response: ApiResponse<PrepareCheckoutModel> = {
            success: true,
            message: "Success",
            data: {
                address: request.addressId ? { id: request.addressId } as any : {
                    id: 1,
                    fullName: "Nguyen Van A",
                    phoneNumber: "0123456789",
                    provinceCode: 1,
                    provinceName: "Hà Nội",
                    districtCode: 1,
                    districtName: "Quận Ba Đình",
                    wardCode: 1,
                    wardName: "Phường Phúc Xá",
                    street: "123 Đường ABC",
                    fullAddress: "123 Đường ABC, Phường Phúc Xá, Quận Ba Đình, Hà Nội"
                },
                items: [
                    {
                        product: {
                            id: "1",
                            name: "Product 1",
                            imageUrl: "https://example.com/product1.jpg",
                            price: 100000,
                            originalPrice: 120000,
                            discountPercentage: 0,
                        },
                        quantity: 2,
                        amount: 100000 * 2
                    },
                    {
                        product: {
                            id: "2",
                            name: "Product 1",
                            imageUrl: "https://example.com/product2.jpg",
                            price: 90000,
                            originalPrice: 100000,
                            discountPercentage: 0,

                        },
                        quantity: 1,
                        amount: 90000 * 1
                    },
                ],

                subTotal: 290000,
                shippingFee: 30000,
                totalAmount: 290000 + 30000,

                invalidItems: [],
                prepareTempId: "mock-temp-id",
                discountAmount: 0,
                shippingDiscountAmount: 0,
                appliedVouchers: [],
            },
        };

        return Promise.resolve(response);
    }

    async checkoutOrder(request: CheckoutRequestDto): Promise<ApiResponse<CheckoutResponseDto>> {
        return Promise.resolve({
            success: true,
            message: "Success",
            data: {
                paymentRequired: request.paymentMethod === EPaymentMethod.MOMO,
                orderId: "1",
                payUrl: request.paymentMethod === EPaymentMethod.MOMO ? "https://example.com/pay" : null
            }
        });
    }

    async getOrderResult(orderId: string): Promise<ApiResponse<CheckoutResultDto>> {
        return Promise.resolve({
            success: true,
            message: "Success",
            data: {
                status: {
                    orderId,
                    paymentMethod: EPaymentMethod.COD,
                    paymentStatus: EPaymentStatus.PENDING
                }
            }
        });
    }

    async getDraftOrders(): Promise<ApiResponse<DraftOrderModel[]>> {
        return Promise.resolve({
            success: true,
            message: "Success",
            data: []
        });
    }
}