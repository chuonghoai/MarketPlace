import { useState, useCallback } from "react";
import { checkoutService } from "../../features/order/checkout/services/checkout.service";
import type { PrepareCheckoutModel } from "../../features/order/checkout/models/checkout.model";
import type { PrepareCheckoutPayload } from "../../features/order/checkout/dto/prepareCheckout.dto";
import type { CheckoutRequestDto, CheckoutResponseDto } from "../../features/order/checkout/dto/checkoutRequest.dto";

export const useCheckoutStore = () => {
    const [data, setData] = useState<PrepareCheckoutModel | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);

    const fetchPrepareOrder = useCallback(async (payload: PrepareCheckoutPayload) => {
        setLoading(true);
        setError(null);
        try {
            const response = await checkoutService.prepareOrder(payload);
            if (response.success && response.data) {
                setData(response.data);
            } else {
                setError(response.message || "Không thể chuẩn bị đơn hàng.");
            }
        } catch (err) {
            setError("Đã xảy ra lỗi hệ thống khi xử lý đơn hàng.");
        } finally {
            setLoading(false);
        }
    }, []);

    const submitCheckout = useCallback(async (request: CheckoutRequestDto): Promise<CheckoutResponseDto | null> => {
        setIsCheckingOut(true);
        setError(null);
        try {
            const response = await checkoutService.checkoutOrder(request);
            if (response.success && response.data) {
                return response.data;
            } else {
                setError(response.message || "Không thể đặt hàng.");
                return null;
            }
        } catch (err) {
            setError("Đã xảy ra lỗi hệ thống khi đặt hàng.");
            return null;
        } finally {
            setIsCheckingOut(false);
        }
    }, []);

    return {
        data,
        loading,
        error,
        setData,
        fetchPrepareOrder,
        
        isCheckingOut,
        submitCheckout,
    };
};