import { useState, useCallback } from 'react';
import type { OrderDetail } from '../../features/order/model/orderDetail.model';
import { orderService } from '../../features/order/services/order.service';

export const useOrderDetailStore = () => {
    const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrderDetail = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await orderService.getOrderDetail(id);
            if (response.success) {
                setOrderDetail(response.data || null);
            } else {
                setError(response.message || 'Lỗi khi tải chi tiết đơn hàng.');
            }
        } catch {
            setError('Không thể tải chi tiết đơn hàng. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearOrderDetail = useCallback(() => {
        setOrderDetail(null);
        setError(null);
    }, []);

    return {
        orderDetail,
        setOrderDetail,

        loading,
        error,
        fetchOrderDetail,
        clearOrderDetail,
    };
};
