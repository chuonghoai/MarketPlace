import type { ApiResponse } from '../../../../core/api/apiResponse';
import { USE_MOCK } from '../../../../core/config/useMock.config';
import type {
    CategoryStat,
    DashboardPeriod,
    KpiStats,
    ProductPerformanceItem,
    RevenueDataPoint,
    TrendingProduct,
} from '../models/dashboard.model';
import type { DashboardRepository } from '../repositories/dashboard.repository';
import { DashboardApiRepository } from '../repositories/dashboardApi.repository';
import { DashboardMockRepository } from '../repositories/dashboardMock.repository';

export class DashboardService {
    private readonly repository: DashboardRepository;

    constructor(repository?: DashboardRepository) {
        this.repository = repository ?? new DashboardApiRepository();
    }

    /**
     * GET /api/v1/admin/dashboard/kpi
     * @query period: DashboardPeriod
     * @returns ApiResponse<KpiStats>
     */
    getKpiStats(period: DashboardPeriod): Promise<ApiResponse<KpiStats>> {
        return this.repository.getKpiStats(period);
    }

    /**
     * GET /api/v1/admin/dashboard/revenue-chart
     * @query period: DashboardPeriod
     * @returns ApiResponse<RevenueDataPoint[]>
     */
    getRevenueChart(period: DashboardPeriod): Promise<ApiResponse<RevenueDataPoint[]>> {
        return this.repository.getRevenueChart(period);
    }

    /**
     * GET /api/v1/admin/dashboard/top-categories
     * @query period: DashboardPeriod, limit: number
     * @returns ApiResponse<CategoryStat[]>
     */
    getTopCategories(period: DashboardPeriod, limit?: number): Promise<ApiResponse<CategoryStat[]>> {
        return this.repository.getTopCategories(period, limit);
    }

    /**
     * GET /api/v1/admin/dashboard/trending-products
     * @query limit: number
     * @returns ApiResponse<TrendingProduct[]>
     */
    getTrendingProducts(limit?: number): Promise<ApiResponse<TrendingProduct[]>> {
        return this.repository.getTrendingProducts(limit);
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
        return this.repository.getProductPerformance(page, pageSize, period);
    }
}

export const dashboardService = new DashboardService(USE_MOCK ? new DashboardMockRepository() : undefined);
