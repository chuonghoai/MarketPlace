import { useState, useCallback } from 'react';
import type { OrderItem } from '../../features/order/model/orderItem.model';
import type { OrderStatusCount } from '../../features/order/model/orderStatusCount.model';
import { orderService } from '../../features/order/services/order.service';
import type { EOrderStatus } from '../../../features/order/enums/orderStatus.enum';

export const useOrderStore = () => {
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [ordersCount, setOrdersCount] = useState<OrderStatusCount | null>(null);

    const fetchOrders = useCallback(async (status?: EOrderStatus) => {
        setLoading(true);
        setError(null);
        try {
            const response = await orderService.getOrdersByStatus(status);
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
            // ordersCount giữ nguyên null nếu lỗi
        }
    }, []);

    return {
        orders,
        loading,
        error,
        ordersCount,
        fetchOrders,
        fetchOrdersCount,
    };
};