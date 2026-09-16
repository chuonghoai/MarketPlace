import { apiClient } from '../../../../core/api/apiClient';
import type { ApiResponse } from '../../../../core/api/apiResponse';
import type {
    CategoryStat,
    DashboardPeriod,
    KpiStats,
    ProductPerformanceItem,
    RevenueDataPoint,
    TrendingProduct,
} from '../models/dashboard.model';
import type { DashboardRepository } from './dashboard.repository';

export class DashboardApiRepository implements DashboardRepository {
    /**
     * GET /api/v1/admin/dashboard/kpi
     * @query period: DashboardPeriod
     * @returns ApiResponse<KpiStats>
     */
    getKpiStats(period: DashboardPeriod): Promise<ApiResponse<KpiStats>> {
        return apiClient.get<ApiResponse<KpiStats>>('/api/v1/admin/dashboard/kpi', {
            params: { period },
        });
    }

    /**
     * GET /api/v1/admin/dashboard/revenue-chart
     * @query period: DashboardPeriod
     * @returns ApiResponse<RevenueDataPoint[]>
     */
    getRevenueChart(period: DashboardPeriod): Promise<ApiResponse<RevenueDataPoint[]>> {
        return apiClient.get<ApiResponse<RevenueDataPoint[]>>('/api/v1/admin/dashboard/revenue-chart', {
            params: { period },
        });
    }

    /**
     * GET /api/v1/admin/dashboard/top-categories
     * @query period: DashboardPeriod, limit: number
     * @returns ApiResponse<CategoryStat[]>
     */
    getTopCategories(period: DashboardPeriod, limit?: number): Promise<ApiResponse<CategoryStat[]>> {
        return apiClient.get<ApiResponse<CategoryStat[]>>('/api/v1/admin/dashboard/top-categories', {
            params: { period, limit },
        });
    }

    /**
     * GET /api/v1/admin/dashboard/trending-products
     * @query limit: number
     * @returns ApiResponse<TrendingProduct[]>
     */
    getTrendingProducts(limit?: number): Promise<ApiResponse<TrendingProduct[]>> {
        return apiClient.get<ApiResponse<TrendingProduct[]>>('/api/v1/admin/dashboard/trending-products', {
            params: { limit },
        });
    }

    /**
     * GET /api/v1/admin/dashboard/product-performance
     * @query page: number, pageSize: number, period: DashboardPeriod
     * @returns ApiResponse<ProductPerformanceItem[]>
     */
    getProductPerformance(
        page: number,
        pageSize: number,
        period: DashboardPeriod
    ): Promise<ApiResponse<ProductPerformanceItem[]>> {
        return apiClient.get<ApiResponse<ProductPerformanceItem[]>>('/api/v1/admin/dashboard/product-performance', {
            params: { page, pageSize, period },
        });
    }
}
