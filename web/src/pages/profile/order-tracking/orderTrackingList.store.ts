import { useState, useCallback } from 'react';
import type { OrderItemTracking } from '../../../features/order/tracking/model/orderItem.model';
import type { OrderTrackingStatusCount } from '../../../features/order/tracking/model/orderStatusCount.model';
import type { EOrderStatus } from '../../../features/order/enums/orderStatus.enum';
import { orderService } from '../../../features/order/tracking/services/order.service';

export const useOrderTrackingListStore = () => {
    const [orders, setOrders] = useState<OrderItemTracking[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [ordersCount, setOrdersCount] = useState<OrderTrackingStatusCount | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchOrders = useCallback(async (status?: EOrderStatus) => {
        setLoading(true);
        setError(null);
        try {
            const response = await orderService.getOrders(status);
            if (response.success) {
                setOrders(response.data || []);
            } else {
                setError(response.message);
            }
        } catch {
            setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchOrdersCount = useCallback(async () => {
        try {
            const response = await orderService.getOrderStatusCount();
            if (response.success) {
                setOrdersCount(response.data || null);
            }
        } catch {
            //
        }
    }, []);

    const cancelOrder = useCallback(async (orderId: string, note: string) => {
        setActionLoading(true);
        try {
            const response = await orderService.cancelOrder(orderId, note);
            if (response.success) {
                // Remove or update the order in the list? We can just return success
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
            if (response.success) {
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
        orders,
        loading,
        error,
        ordersCount,
        actionLoading,
        fetchOrders,
        fetchOrdersCount,
        cancelOrder,
        returnOrder,
    };
};
