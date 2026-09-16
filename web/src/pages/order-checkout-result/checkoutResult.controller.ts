import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { checkoutService } from "../../features/order/checkout/services/checkout.service";
import type { CheckoutResultDto } from "../../features/order/checkout/models/checkoutResult.dto";
import { resolveOrderIdFromUrl } from "./helpers/resolveOrderId.helper";

export const useCheckoutResultController = () => {
    const [searchParams] = useSearchParams();
    const orderId = resolveOrderIdFromUrl(searchParams);

    const [result, setResult] = useState<CheckoutResultDto | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrderResult = async () => {
            if (!orderId) {
                setIsLoading(false);
                setError("Không tìm thấy mã đơn hàng hợp lệ từ URL.");
                return;
            }

            setIsLoading(true);
            try {
                const response = await checkoutService.getOrderResult(orderId);

                if (response.success && response.data) {
                    setResult(response.data);
                } else {
                    setError(response.message || "Có lỗi xảy ra khi lấy thông tin đơn hàng.");
                }
            } catch (err) {
                setError("Lỗi kết nối đến máy chủ. Vui lòng thử lại.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderResult();
    }, [orderId]);

    return {
        orderId,
        result,
        isLoading,
        error
    };
};