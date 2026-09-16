import type { ApiResponse } from '../../../../core/api/apiResponse';
import type {
    CategoryStat,
    DashboardPeriod,
    KpiStats,
    ProductPerformanceItem,
    RevenueDataPoint,
    TrendingProduct,
} from '../models/dashboard.model';

export interface DashboardRepository {
    /**
     * GET /api/v1/admin/dashboard/kpi
     * @query period: DashboardPeriod
     * @returns ApiResponse<KpiStats>
     */
    getKpiStats(period: DashboardPeriod): Promise<ApiResponse<KpiStats>>;

    /**
     * GET /api/v1/admin/dashboard/revenue-chart
     * @query period: DashboardPeriod
     * @returns ApiResponse<RevenueDataPoint[]>
     */
    getRevenueChart(period: DashboardPeriod): Promise<ApiResponse<RevenueDataPoint[]>>;

    /**
     * GET /api/v1/admin/dashboard/top-categories
     * @query period: DashboardPeriod, limit: number
     * @returns ApiResponse<CategoryStat[]>
     */
    getTopCategories(period: DashboardPeriod, limit?: number): Promise<ApiResponse<CategoryStat[]>>;

    /**
     * GET /api/v1/admin/dashboard/trending-products
     * @query limit: number
     * @returns ApiResponse<TrendingProduct[]>
     */
    getTrendingProducts(limit?: number): Promise<ApiResponse<TrendingProduct[]>>;

    /**
     * GET /api/v1/admin/dashboard/product-performance
     * @query page: number, pageSize: number, period: DashboardPeriod
     * @returns ApiResponse<ProductPerformanceItem[]>
     */
    getProductPerformance(
        page: number,
        pageSize: number,
        period: DashboardPeriod
    ): Promise<ApiResponse<ProductPerformanceItem[]>>;
}
