import { useState, useCallback } from 'react';
import type { OrderTrackingDetail as OrderTrackingDetailModel } from '../../../features/order/tracking/model/orderDetail.model';
import { orderService } from '../../../features/order/tracking/services/order.service';

export const useOrderTrackingDetailStore = () => {
    const [order, setOrder] = useState<OrderTrackingDetailModel | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchOrderDetail = useCallback(async (orderId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await orderService.getOrderDetailById(orderId);
            if (response.success && response.data) {
                setOrder(response.data);
            } else {
                setError(response.message || 'Không tìm thấy chi tiết đơn hàng');
            }
        } catch {
            setError('Lỗi khi tải chi tiết đơn hàng');
        } finally {
            setLoading(false);
        }
    }, []);

    const cancelOrder = useCallback(async (orderId: string, note: string) => {
        setActionLoading(true);
        try {
            const response = await orderService.cancelOrder(orderId, note);
            if (response.success && response.data) {
                setOrder(response.data);
                return { success: true };
            }
            return { success: false, message: response.message };
        } catch {
            return { success: false, message: 'Lỗi khi hủy đơn hàng' };
        } finally {
            setActionLoading(false);
        }
    }, []);

    const returnOrder = useCallback(async (orderId: string, note: string) => {
        setActionLoading(true);
        try {
            const response = await orderService.returnOrder(orderId, note);
            if (response.success && response.data) {
                setOrder(response.data);
                return { success: true };
            }
            return { success: false, message: response.message };
        } catch {
            return { success: false, message: 'Lỗi khi yêu cầu trả hàng' };
        } finally {
            setActionLoading(false);
        }
    }, []);

    return {
        order,
        loading,
        error,
        actionLoading,
        setOrder,
        fetchOrderDetail,
        cancelOrder,
        returnOrder,
    };
};
