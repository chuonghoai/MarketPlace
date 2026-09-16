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

const KPI_BY_PERIOD: Record<DashboardPeriod, KpiStats> = {
    '30d': {
        totalRevenue: { value: 124500000, changePercent: 12.5, trend: 'up' },
        totalOrders: { value: 1248, changePercent: 8.2, trend: 'up' },
        conversionRate: { value: 3.4, changePercent: -1.1, trend: 'down' },
    },
    '7d': {
        totalRevenue: { value: 28600000, changePercent: 5.3, trend: 'up' },
        totalOrders: { value: 287, changePercent: 3.1, trend: 'up' },
        conversionRate: { value: 3.2, changePercent: -0.4, trend: 'down' },
    },
    '1y': {
        totalRevenue: { value: 1542000000, changePercent: 22.3, trend: 'up' },
        totalOrders: { value: 15230, changePercent: 18.0, trend: 'up' },
        conversionRate: { value: 3.9, changePercent: 0.8, trend: 'up' },
    },
};

const REVENUE_CHART_BY_PERIOD: Record<DashboardPeriod, RevenueDataPoint[]> = {
    '30d': [
        { label: 'T1', revenue: 18500000, orders: 180 },
        { label: 'T2', revenue: 22000000, orders: 210 },
        { label: 'T3', revenue: 19800000, orders: 195 },
        { label: 'T4', revenue: 31000000, orders: 298 },
        { label: 'T5', revenue: 27400000, orders: 265 },
        { label: 'T6', revenue: 35200000, orders: 340 },
    ],
    '7d': [
        { label: 'T2', revenue: 3200000, orders: 32 },
        { label: 'T3', revenue: 4100000, orders: 41 },
        { label: 'T4', revenue: 3800000, orders: 38 },
        { label: 'T5', revenue: 5200000, orders: 52 },
        { label: 'T6', revenue: 6300000, orders: 63 },
        { label: 'T7', revenue: 4900000, orders: 49 },
        { label: 'CN', revenue: 2100000, orders: 21 },
    ],
    '1y': [
        { label: 'T1', revenue: 98000000, orders: 920 },
        { label: 'T2', revenue: 115000000, orders: 1080 },
        { label: 'T3', revenue: 122000000, orders: 1140 },
        { label: 'T4', revenue: 108000000, orders: 1010 },
        { label: 'T5', revenue: 135000000, orders: 1270 },
        { label: 'T6', revenue: 148000000, orders: 1390 },
        { label: 'T7', revenue: 120000000, orders: 1120 },
        { label: 'T8', revenue: 140000000, orders: 1310 },
        { label: 'T9', revenue: 155000000, orders: 1450 },
        { label: 'T10', revenue: 162000000, orders: 1520 },
        { label: 'T11', revenue: 175000000, orders: 1640 },
        { label: 'T12', revenue: 182000000, orders: 1710 },
    ],
};

const MOCK_TOP_CATEGORIES: CategoryStat[] = [
    { categoryId: '1', categoryName: 'Gốm sứ', revenuePercent: 45, revenue: 56025000 },
    { categoryId: '3', categoryName: 'Dệt thổ cẩm', revenuePercent: 28, revenue: 34860000 },
    { categoryId: '5', categoryName: 'Gỗ mỹ nghệ', revenuePercent: 15, revenue: 18675000 },
    { categoryId: '6', categoryName: 'Thủy tinh', revenuePercent: 12, revenue: 14940000 },
];

const MOCK_TRENDING_PRODUCTS: TrendingProduct[] = [
    {
        productId: '1',
        name: 'Bình gốm men tro',
        price: 450000,
        imageUrl: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=200&auto=format&fit=crop',
        trend: 'up',
        salesGrowthPercent: 34.2,
    },
    {
        productId: '5',
        name: 'Khăn dệt thổ cẩm',
        price: 250000,
        imageUrl: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=200&auto=format&fit=crop',
        trend: 'up',
        salesGrowthPercent: 18.7,
    },
];

const MOCK_PRODUCT_PERFORMANCE: ProductPerformanceItem[] = [
    {
        productId: '1',
        name: 'Bình gốm men tro',
        imageUrl: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=200&auto=format&fit=crop',
        categoryName: 'Gốm sứ',
        totalSales: 342,
        stockStatus: 'in_stock',
    },
    {
        productId: '5',
        name: 'Khăn dệt thổ cẩm',
        imageUrl: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=200&auto=format&fit=crop',
        categoryName: 'Dệt thổ cẩm',
        totalSales: 215,
        stockStatus: 'low_stock',
    },
    {
        productId: '6',
        name: 'Lọ hoa gỗ lũa',
        imageUrl: 'https://th.bing.com/th/id/OIP.prMCooHgX8QImiqNbgeeOwHaHZ?rs=1&pid=ImgDetMain',
        categoryName: 'Gỗ mỹ nghệ',
        totalSales: 189,
        stockStatus: 'out_of_stock',
    },
];

export class DashboardMockRepository implements DashboardRepository {
    async getKpiStats(period: DashboardPeriod): Promise<ApiResponse<KpiStats>> {
        return {
            success: true,
            message: 'Lấy KPI thành công (Mock)',
            data: KPI_BY_PERIOD[period],
        };
    }

    async getRevenueChart(period: DashboardPeriod): Promise<ApiResponse<RevenueDataPoint[]>> {
        return {
            success: true,
            message: 'Lấy dữ liệu biểu đồ thành công (Mock)',
            data: REVENUE_CHART_BY_PERIOD[period],
        };
    }

    async getTopCategories(_period: DashboardPeriod, limit: number = 5): Promise<ApiResponse<CategoryStat[]>> {
        return {
            success: true,
            message: 'Lấy top danh mục thành công (Mock)',
            data: MOCK_TOP_CATEGORIES.slice(0, limit),
        };
    }

    async getTrendingProducts(limit: number = 5): Promise<ApiResponse<TrendingProduct[]>> {
        return {
            success: true,
            message: 'Lấy sản phẩm trending thành công (Mock)',
            data: MOCK_TRENDING_PRODUCTS.slice(0, limit),
        };
    }

    async getProductPerformance(
        page: number,
        pageSize: number,
        _period: DashboardPeriod
    ): Promise<ApiResponse<ProductPerformanceItem[]>> {
        const start = (page - 1) * pageSize;
        const paginated = MOCK_PRODUCT_PERFORMANCE.slice(start, start + pageSize);

        return {
            success: true,
            message: 'Lấy hiệu suất sản phẩm thành công (Mock)',
            data: paginated.length > 0 ? paginated : MOCK_PRODUCT_PERFORMANCE,
            pagination: {
                page,
                pageSize,
                totalItems: MOCK_PRODUCT_PERFORMANCE.length,
                totalPages: Math.ceil(MOCK_PRODUCT_PERFORMANCE.length / pageSize),
            },
        };
    }
}
