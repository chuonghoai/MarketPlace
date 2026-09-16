import { useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { HeaderOptions } from '../../layout/AdminLayout';
import type { DashboardPeriod, KpiStats, ProductPerformanceItem, StockStatus } from '../../features/dashboard/models/dashboard.model';
import { useDashboardController } from './dashboard.controller';

const PERIOD_OPTIONS: { label: string; value: DashboardPeriod }[] = [
    { label: '1 tuần', value: '7d' },
    { label: '30 ngày', value: '30d' },
    { label: '1 năm', value: '1y' },
];

const STOCK_STATUS_MAP: Record<StockStatus, { label: string; className: string }> = {
    in_stock: {
        label: 'Còn hàng',
        className: 'bg-[#dcfce7] text-[#166534] border-[#86efac]',
    },
    low_stock: {
        label: 'Sắp hết',
        className: 'bg-[#fef08a] text-[#854d0e] border-[#fde047]',
    },
    out_of_stock: {
        label: 'Hết hàng',
        className: 'bg-[#fee2e2] text-error border-[#fecaca]',
    },
};

const KPI_CONFIG: {
    key: keyof KpiStats;
    label: string;
    icon: string;
    format: (v: number) => string;
}[] = [
    {
        key: 'totalRevenue',
        label: 'Doanh thu',
        icon: 'account_balance_wallet',
        format: (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(v),
    },
    {
        key: 'totalOrders',
        label: 'Đơn hàng',
        icon: 'shopping_bag',
        format: (v) => v.toLocaleString('vi-VN'),
    },
    {
        key: 'conversionRate',
        label: 'Tỉ lệ chuyển đổi',
        icon: 'monitoring',
        format: (v) => `${v.toFixed(1)}%`,
    },
];

const BarChart = ({ data }: { data: { label: string; revenue: number }[] }) => {
    const maxRevenue = useMemo(() => Math.max(...data.map(d => d.revenue), 1), [data]);

    const yLabels = useMemo(() => {
        const step = maxRevenue / 4;
        return [maxRevenue, step * 3, step * 2, step, 0].map(v =>
            v >= 1_000_000 ? `${(v / 1_000_000).toFixed(0)}M` : `${v}`
        );
    }, [maxRevenue]);

    return (
        <div className="relative w-full h-55 md:h-70 flex gap-2">
            <div className="flex flex-col justify-between font-body text-xs font-semibold text-text-muted pb-8 w-10 shrink-0 text-right">
                {yLabels.map((l) => (
                    <span key={l}>{l}</span>
                ))}
            </div>

            <div className="flex-1 flex flex-col">
                <div className="flex-1 relative">
                    {[0, 25, 50, 75, 100].map((pct) => (
                        <div
                            key={pct}
                            className="absolute w-full border-t border-dashed border-border-subtle opacity-60"
                            style={{ top: `${pct}%` }}
                            aria-hidden="true"
                        />
                    ))}

                    <div className="absolute inset-0 flex items-stretch justify-around gap-2 px-1">
                        {data.map((d) => {
                            const heightPct = (d.revenue / maxRevenue) * 100;
                            return (
                                <div
                                    key={d.label}
                                    className="flex-1 flex flex-col items-center gap-1 group"
                                >
                                    <div
                                        className="relative w-full flex items-end justify-center"
                                        style={{ height: '100%' }}
                                    >
                                        <div
                                            className="w-full max-w-10 rounded-t-md bg-primary-container transition-all duration-500 ease-out group-hover:bg-primary cursor-pointer"
                                            style={{ height: `${heightPct}%`, minHeight: '4px' }}
                                            title={`${d.label}: ${new Intl.NumberFormat('vi-VN').format(d.revenue)}đ`}
                                            role="img"
                                            aria-label={`${d.label}: ${new Intl.NumberFormat('vi-VN').format(d.revenue)} đồng`}
                                        />
                                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:flex bg-text-ink text-surface-card font-body text-[10px] font-semibold px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none">
                                            {new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(d.revenue / 1_000_000)}M đ
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="h-8 flex justify-around items-center border-t border-border-subtle px-1">
                    {data.map((d) => (
                        <span key={d.label} className="flex-1 text-center font-body text-xs font-semibold text-text-muted">
                            {d.label}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

const KpiSkeleton = () => (
    <div className="bg-surface-card border border-border-subtle rounded-xl p-4 md:p-6 animate-pulse">
        <div className="h-3 bg-surface-container rounded w-24 mb-4" />
        <div className="h-8 bg-surface-container rounded w-32 mb-6" />
        <div className="h-3 bg-surface-container rounded w-20" />
    </div>
);



const formatTableProductName = (item: ProductPerformanceItem) =>
    item.name.length > 28 ? `${item.name.slice(0, 28)}…` : item.name;

export const DashboardPage = () => {
    const { setHeaderOptions } = useOutletContext<{ setHeaderOptions: (options: HeaderOptions) => void }>();

    const {
        kpi,
        revenueChart,
        topCategories,
        trendingProducts,
        productPerformance,
        period,
        periodLabel,
        loading,
        error,
        handlePeriodChange,
        fetchAll,
    } = useDashboardController();

    useEffect(() => {
        setHeaderOptions({
            links: [
                { label: 'Dashboard', href: '/admin', active: true },
                { label: 'Reports', href: '/admin/reports' },
            ],
            showSearch: true,
            rightActions: (
                <button
                    className="btn-primary font-body text-sm font-semibold px-4 py-2 hover:-translate-y-0.5"
                    aria-label="Xuất báo cáo"
                >
                    Xuất báo cáo
                </button>
            ),
        });
    }, [setHeaderOptions]);

    useEffect(() => {
        fetchAll(period);
    }, [period, fetchAll]);

    return (
        <div className="max-w-7xl mx-auto space-y-5 md:space-y-8 w-full pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0">
                <div>
                    <h2 className="font-headline text-2xl md:text-4xl font-semibold text-text-ink" style={{ textWrap: 'balance' } as React.CSSProperties}>
                        Tổng quan
                    </h2>
                    <p className="font-body text-lg text-text-muted mt-2">
                        Chào mừng trở lại. Đây là hiệu suất bán hàng của bạn.
                    </p>
                </div>

                <div className="relative" role="group" aria-label="Lọc theo khoảng thời gian">
                    <div className="flex items-center gap-1 bg-surface-card border border-border-subtle rounded-lg p-1">
                        {PERIOD_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => handlePeriodChange(opt.value)}
                                className={`font-body text-xs font-semibold px-3 py-1.5 rounded-md transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:outline-none ${
                                    period === opt.value
                                        ? 'bg-primary-container text-on-primary-container shadow-sm'
                                        : 'text-text-muted hover:text-text-ink hover:bg-surface-container'
                                }`}
                                aria-pressed={period === opt.value}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {error && (
                <div
                    className="bg-[#fee2e2] border border-[#fecaca] text-error rounded-xl px-6 py-4 font-body text-sm"
                    role="alert"
                    aria-live="polite"
                >
                    {error}
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {loading || !kpi
                    ? Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)
                    : KPI_CONFIG.map(({ key, label, icon, format }) => {
                        const metric = kpi[key];
                        const isUp = metric.trend === 'up';
                        const trendColor = isUp ? 'text-[#4d7c0f]' : 'text-error';
                        const trendIcon = isUp ? 'arrow_upward' : 'arrow_downward';

                        return (
                            <div
                                key={key}
                                className="bg-surface-card border border-border-subtle rounded-xl p-4 md:p-6 border-t-4 border-t-primary-container hover:-translate-y-0.5 hover:border-border-medium transition-all duration-200 relative overflow-hidden group flex flex-col justify-between"
                            >
                                <div className="absolute top-0 right-0 p-4 md:p-6 opacity-10 group-hover:opacity-20 transition-opacity" aria-hidden="true">
                                    <span className="material-symbols-outlined text-[32px] md:text-[48px]">{icon}</span>
                                </div>
                                <div>
                                    <p className="font-body text-[10px] md:text-xs font-semibold text-text-muted tracking-widest uppercase truncate">{label}</p>
                                    <h3 className="font-headline text-xl md:text-3xl font-semibold text-text-ink mt-2 truncate" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                        {format(metric.value)}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-1 mt-4">
                                    <span className={`material-symbols-outlined text-[14px] md:text-[16px] ${trendColor}`} aria-hidden="true">{trendIcon}</span>
                                    <span className={`font-body text-[10px] md:text-xs font-semibold ${trendColor}`}>
                                        {Math.abs(metric.changePercent).toFixed(1)}%
                                    </span>
                                    <span className="font-body text-[10px] md:text-sm text-text-muted ml-1 md:ml-2 hidden sm:inline">so với kỳ trước</span>
                                </div>
                            </div>
                        );
                    })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
                <div className="lg:col-span-2 bg-surface-card border border-border-subtle rounded-xl p-4 md:p-6 hover:-translate-y-0.5 transition-transform duration-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-body text-sm font-semibold text-text-ink tracking-widest uppercase">
                            Doanh thu — {periodLabel}
                        </h3>
                        <button
                            className="material-symbols-outlined text-text-muted hover:text-text-ink focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:outline-none rounded-sm"
                            aria-label="Thêm tùy chọn biểu đồ"
                        >
                            more_horiz
                        </button>
                    </div>
                    {loading
                        ? <div className="h-55 md:h-70 bg-surface-container animate-pulse rounded" />
                        : <BarChart data={revenueChart} />
                    }
                </div>

                <div className="flex flex-col gap-5 md:gap-6">
                    <div className="bg-surface-card border border-border-subtle rounded-xl p-4 md:p-6 flex-1 hover:-translate-y-0.5 transition-transform duration-200">
                        <h3 className="font-body text-sm font-semibold text-text-ink tracking-widest uppercase mb-4">
                            Top danh mục
                        </h3>
                        {loading
                            ? <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-6 bg-surface-container animate-pulse rounded" />)}</div>
                            : (
                                <ul className="space-y-3" aria-label="Danh sách top danh mục">
                                    {topCategories.map((cat, idx) => (
                                        <li key={cat.categoryId} className={`flex items-center justify-between pb-3 ${idx < topCategories.length - 1 ? 'border-b border-border-subtle' : ''}`}>
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-2 h-2 rounded-full bg-primary-container shrink-0" aria-hidden="true" />
                                                <span className="font-body text-base text-text-ink truncate">{cat.categoryName}</span>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0 ml-2">
                                                <div className="w-16 h-1.5 bg-surface-container rounded-full overflow-hidden" aria-hidden="true">
                                                    <div className="h-full bg-primary-container rounded-full" style={{ width: `${cat.revenuePercent}%` }} />
                                                </div>
                                                <span className="font-body text-sm font-semibold text-text-ink" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                                    {cat.revenuePercent}%
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )
                        }
                    </div>

                    <div className="bg-surface-card border border-border-subtle rounded-xl p-4 md:p-6 flex-1 hover:-translate-y-0.5 transition-transform duration-200">
                        <h3 className="font-body text-sm font-semibold text-text-ink tracking-widest uppercase mb-4">
                            Đang trending
                        </h3>
                        {loading
                            ? <div className="space-y-3">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-12 bg-surface-container animate-pulse rounded" />)}</div>
                            : (
                                <ul className="space-y-3" aria-label="Danh sách sản phẩm trending">
                                    {trendingProducts.map((product) => (
                                        <li key={product.productId} className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-surface-container border border-border-subtle rounded-md overflow-hidden shrink-0">
                                                <img
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                    src={product.imageUrl}
                                                    loading="lazy"
                                                    width="40"
                                                    height="40"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-body text-xs font-semibold text-text-ink truncate">{product.name}</p>
                                                <p className="font-body text-sm text-text-muted" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(product.price)}
                                                </p>
                                            </div>
                                            <span
                                                className="material-symbols-outlined text-[16px] text-[#4d7c0f] shrink-0"
                                                aria-label={`Xu hướng tăng ${product.salesGrowthPercent}%`}
                                            >
                                                trending_up
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )
                        }
                    </div>
                </div>
            </div>

            <div className="bg-surface-card border border-border-subtle rounded-xl p-6 hover:-translate-y-0.5 transition-transform duration-200">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="font-body text-sm font-semibold text-text-ink tracking-widest uppercase">
                        Hiệu suất sản phẩm
                    </h3>
                    <button
                        className="font-body text-xs font-semibold text-text-muted hover:text-text-ink underline focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:outline-none rounded-sm"
                        aria-label="Xem toàn bộ danh sách sản phẩm"
                    >
                        Xem tất cả
                    </button>
                </div>

                {loading
                    ? (
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-16 bg-surface-container animate-pulse rounded" />
                            ))}
                        </div>
                    )
                    : (
                        <>
                        <div className="hidden md:block w-full overflow-x-auto">
                            <table className="w-full text-left border-collapse" aria-label="Bảng hiệu suất sản phẩm">
                                <thead>
                                    <tr>
                                        <th scope="col" className="font-body text-xs font-semibold text-text-muted tracking-widest uppercase pb-2 border-b-[1.5px] border-border-medium">
                                            Sản phẩm
                                        </th>
                                        <th scope="col" className="font-body text-xs font-semibold text-text-muted tracking-widest uppercase pb-2 border-b-[1.5px] border-border-medium px-4">
                                            Danh mục
                                        </th>
                                        <th scope="col" className="font-body text-xs font-semibold text-text-muted tracking-widest uppercase pb-2 border-b-[1.5px] border-border-medium px-4">
                                            Doanh số
                                        </th>
                                        <th scope="col" className="font-body text-xs font-semibold text-text-muted tracking-widest uppercase pb-2 border-b-[1.5px] border-border-medium px-4">
                                            Tình trạng
                                        </th>
                                        <th scope="col" className="font-body text-xs font-semibold text-text-muted tracking-widest uppercase pb-2 border-b-[1.5px] border-border-medium text-right">
                                            Hành động
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="font-body text-base text-text-ink">
                                    {productPerformance.map((item) => {
                                        const status = STOCK_STATUS_MAP[item.stockStatus];
                                        return (
                                            <tr
                                                key={item.productId}
                                                className="hover:bg-surface-container transition-colors border-b border-border-subtle"
                                            >
                                                <td className="py-4 pr-4">
                                                    <div className="flex items-center gap-4 min-w-0">
                                                        <div className="w-12 h-12 bg-surface-card border border-border-subtle rounded overflow-hidden shrink-0">
                                                            <img
                                                                alt={item.name}
                                                                className="w-full h-full object-cover"
                                                                src={item.imageUrl}
                                                                loading="lazy"
                                                                width="48"
                                                                height="48"
                                                            />
                                                        </div>
                                                        <span className="font-headline text-base font-semibold leading-tight text-text-ink truncate">
                                                            {formatTableProductName(item)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-text-muted">{item.categoryName}</td>
                                                <td className="py-4 px-4" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                                    {item.totalSales.toLocaleString('vi-VN')}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full font-body text-[11px] font-semibold tracking-wider uppercase border ${status.className}`}>
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            className="btn-secondary font-body text-xs font-semibold px-3 py-1.5 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:outline-none"
                                                            aria-label={`Xem chi tiết ${item.name}`}
                                                        >
                                                            Chi tiết
                                                        </button>
                                                        <button
                                                            className="text-text-muted hover:text-text-ink p-1 focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:outline-none rounded-sm"
                                                            aria-label={`Chỉnh sửa ${item.name}`}
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">edit</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="md:hidden flex flex-col gap-4">
                            {productPerformance.map((item) => {
                                const status = STOCK_STATUS_MAP[item.stockStatus];
                                return (
                                    <div key={item.productId} className="flex flex-col border border-border-subtle rounded-xl p-4 bg-surface gap-4">
                                        <div className="flex gap-4 items-start">
                                            <div className="w-16 h-16 bg-surface-card border border-border-subtle rounded-md overflow-hidden shrink-0">
                                                <img
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                    src={item.imageUrl}
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-headline text-sm font-semibold text-text-ink truncate">{item.name}</h4>
                                                <p className="font-body text-xs text-text-muted mt-1">{item.categoryName}</p>
                                                <p className="font-body text-sm font-semibold text-text-ink mt-1">{item.totalSales.toLocaleString('vi-VN')} đã bán</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center pt-4 border-t border-border-subtle">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full font-body text-[10px] font-semibold tracking-wider uppercase border ${status.className}`}>
                                                {status.label}
                                            </span>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    className="btn-secondary font-body text-xs font-semibold px-4 py-2 hover:-translate-y-0.5"
                                                    aria-label={`Xem chi tiết ${item.name}`}
                                                >
                                                    Chi tiết
                                                </button>
                                                <button
                                                    className="text-text-muted hover:text-text-ink p-2 border border-border-subtle rounded-md flex items-center justify-center"
                                                    aria-label={`Chỉnh sửa ${item.name}`}
                                                >
                                                    <span className="material-symbols-outlined text-[20px]" aria-hidden="true">edit</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        </>
                    )
                }
            </div>
        </div>
    );
};
