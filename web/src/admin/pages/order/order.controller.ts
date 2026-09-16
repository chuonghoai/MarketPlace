import { useEffect, useMemo, useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useOrderStore } from './order.store';
import type { EOrderStatus } from '../../../features/order/enums/orderStatus.enum';

export type TabValue = EOrderStatus | 'ALL';

export const useOrderController = () => {
    const store = useOrderStore();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');

    const activeTab = (searchParams.get('status') as TabValue) || 'ALL';

    useEffect(() => {
        const statusToFetch = activeTab === 'ALL' ? undefined : (activeTab as EOrderStatus);
        store.fetchOrders(statusToFetch);
    }, [activeTab, store.fetchOrders]);

    useEffect(() => {
        store.fetchOrdersCount();
    }, [store.fetchOrdersCount]);

    /**
     * Chuyển tab trạng thái đơn hàng
     */
    const handleTabChange = useCallback((tab: TabValue) => {
        searchParams.set('status', tab);
        setSearchParams(searchParams);
    }, [searchParams, setSearchParams]);

    /**
     * Lọc đơn hàng theo mã đơn hàng, tên hoặc số điện thoại người mua
     */
    const filteredOrders = useMemo(() => {
        if (!searchQuery.trim()) return store.orders;
        const lowerQuery = searchQuery.toLowerCase();
        return store.orders.filter(order =>
            order.id.toLowerCase().includes(lowerQuery) ||
            order.buyerName.toLowerCase().includes(lowerQuery) ||
            order.buyerPhone.includes(searchQuery)
        );
    }, [store.orders, searchQuery]);

    return {
        loading: store.loading,
        error: store.error,
        ordersCount: store.ordersCount,
        activeTab,
        searchQuery,
        setSearchQuery,
        filteredOrders,
        handleTabChange,
    };
};