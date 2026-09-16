import { useCallback } from 'react';
import type { DashboardPeriod } from '../../features/dashboard/models/dashboard.model';
import { useDashboardStore } from './dashboard.store';

export const useDashboardController = () => {
    const store = useDashboardStore();

    const handlePeriodChange = useCallback((period: DashboardPeriod) => {
        store.setPeriod(period);
    }, [store.setPeriod]);

    const handleRefresh = useCallback(() => {
        store.fetchAll(store.period, store.productPage);
    }, [store.fetchAll, store.period, store.productPage]);

    const handlePageChange = useCallback((page: number) => {
        store.fetchAll(store.period, page);
    }, [store.fetchAll, store.period]);

    return {
        ...store,
        handlePeriodChange,
        handleRefresh,
        handlePageChange,
    };
};
