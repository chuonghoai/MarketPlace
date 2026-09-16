import { useCallback, useMemo, useState } from 'react';
import type {
    CategoryStat,
    DashboardPeriod,
    KpiStats,
    ProductPerformanceItem,
    RevenueDataPoint,
    TrendingProduct,
} from '../../features/dashboard/models/dashboard.model';
import { dashboardService } from '../../features//dashboard/services/dashboard.service';

interface DashboardState {
    kpi: KpiStats | null;
    revenueChart: RevenueDataPoint[];
    topCategories: CategoryStat[];
    trendingProducts: TrendingProduct[];
    productPerformance: ProductPerformanceItem[];
    productPage: number;
    productTotalPages: number;
    period: DashboardPeriod;
    loading: boolean;
    error: string | null;
}

const initialState: DashboardState = {
    kpi: null,
    revenueChart: [],
    topCategories: [],
    trendingProducts: [],
    productPerformance: [],
    productPage: 1,
    productTotalPages: 1,
    period: '7d',
    loading: false,
    error: null,
};

export const useDashboardStore = () => {
    const [state, setState] = useState<DashboardState>(initialState);

    const setPeriod = useCallback((period: DashboardPeriod) => {
        setState(prev => ({ ...prev, period }));
    }, []);

    const fetchAll = useCallback(async (period: DashboardPeriod, page: number = 1) => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const [kpiRes, chartRes, catRes, trendRes, perfRes] = await Promise.all([
                dashboardService.getKpiStats(period),
                dashboardService.getRevenueChart(period),
                dashboardService.getTopCategories(period, 4),
                dashboardService.getTrendingProducts(5),
                dashboardService.getProductPerformance(page, 10, period),
            ]);

            setState(prev => ({
                ...prev,
                kpi: kpiRes.data,
                revenueChart: chartRes.data,
                topCategories: catRes.data,
                trendingProducts: trendRes.data,
                productPerformance: perfRes.data,
                productPage: perfRes.pagination?.page ?? 1,
                productTotalPages: perfRes.pagination?.totalPages ?? 1,
                loading: false,
            }));
        } catch {
            setState(prev => ({
                ...prev,
                loading: false,
                error: 'Không thể tải dữ liệu dashboard. Vui lòng thử lại.',
            }));
        }
    }, []);

    const periodLabel = useMemo(() => {
        const labels: Record<DashboardPeriod, string> = {
            '7d': '1 tuần qua',
            '30d': '30 ngày qua',
            '1y': '1 năm qua',
        };
        return labels[state.period];
    }, [state.period]);

    return {
        ...state,
        periodLabel,
        setPeriod,
        fetchAll,
    };
};
