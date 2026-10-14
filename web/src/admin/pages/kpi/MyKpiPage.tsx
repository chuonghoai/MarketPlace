import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { kpiService } from '../../../features/kpi/services/kpi.service';
import type { StaffKpiResponseData } from '../../../features/kpi/models/kpi.model';
import { tKpi } from '../../../features/kpi/constants/kpiL10n';

export const MyKpiPage: React.FC = () => {
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const thirtyDaysAgoStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  }, []);

  const [startDate, setStartDate] = useState(thirtyDaysAgoStr);
  const [endDate, setEndDate] = useState(todayStr);

  const [kpiData, setKpiData] = useState<StaffKpiResponseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyKpi = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await kpiService.getMyKpi({
        startDate,
        endDate,
      });
      setKpiData(res.data);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || tKpi('errorOccurred'));
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMyKpi();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchMyKpi]);

  const handlePreset = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    setStartDate(d.toISOString().slice(0, 10));
    setEndDate(new Date().toISOString().slice(0, 10));
  };

  const myStaffItem = kpiData?.items?.[0] || null;

  const maxDailyCount = (() => {
    if (!kpiData?.timeSeries || kpiData.timeSeries.length === 0) return 1;
    return Math.max(
      ...kpiData.timeSeries.map((t) => Math.max(t.assignedCount, t.resolvedCount)),
      1,
    );
  })();

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 pb-12">
      {/* Header & Filter */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 border-b border-border-subtle dark:border-stone-800 pb-5">
        <div>
          <h1 className="font-headline text-2xl md:text-3xl font-bold text-text-ink dark:text-stone-100">
            {tKpi('myKpiTitle')}
          </h1>
          <p className="font-body text-sm text-text-muted dark:text-stone-400 mt-1">
            {tKpi('subtitle')}
          </p>
        </div>

        {/* Date presets & pickers */}
        <div className="flex flex-wrap items-center gap-2.5 bg-surface-card dark:bg-stone-900 border border-border-subtle dark:border-stone-800 p-2 rounded-xl shadow-xs">
          <div className="flex items-center gap-1 bg-surface-container dark:bg-stone-800 p-1 rounded-lg">
            <button
              onClick={() => handlePreset(7)}
              className="px-2.5 py-1 text-xs font-semibold rounded-md text-text-muted dark:text-stone-400 hover:text-text-ink dark:hover:text-stone-100 transition-colors"
            >
              {tKpi('preset7d')}
            </button>
            <button
              onClick={() => handlePreset(30)}
              className="px-2.5 py-1 text-xs font-semibold rounded-md text-text-muted dark:text-stone-400 hover:text-text-ink dark:hover:text-stone-100 transition-colors"
            >
              {tKpi('preset30d')}
            </button>
            <button
              onClick={() => handlePreset(90)}
              className="px-2.5 py-1 text-xs font-semibold rounded-md text-text-muted dark:text-stone-400 hover:text-text-ink dark:hover:text-stone-100 transition-colors"
            >
              {tKpi('preset90d')}
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-text-muted dark:text-stone-400">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-border-subtle dark:border-stone-700 bg-surface-card dark:bg-stone-900 text-text-ink dark:text-stone-100 focus:outline-none"
            />
            <span>→</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-border-subtle dark:border-stone-700 bg-surface-card dark:bg-stone-900 text-text-ink dark:text-stone-100 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-error rounded-xl text-sm font-body">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Assigned */}
        <div className="bg-surface-card dark:bg-stone-900 border border-border-subtle dark:border-stone-800 rounded-xl p-4 flex flex-col justify-between border-t-4 border-t-primary-container shadow-xs">
          <span className="font-body text-[11px] font-bold text-text-muted dark:text-stone-400 uppercase tracking-wider">
            {tKpi('totalAssigned')}
          </span>
          <div className="text-2xl font-bold font-headline text-text-ink dark:text-stone-100 mt-2">
            {loading ? '-' : (myStaffItem?.totalAssigned ?? 0).toLocaleString('vi-VN')}
          </div>
          <span className="text-[11px] text-text-muted dark:text-stone-500 mt-1">Phiếu được phân công</span>
        </div>

        {/* Total Resolved */}
        <div className="bg-surface-card dark:bg-stone-900 border border-border-subtle dark:border-stone-800 rounded-xl p-4 flex flex-col justify-between border-t-4 border-t-emerald-600 shadow-xs">
          <span className="font-body text-[11px] font-bold text-text-muted dark:text-stone-400 uppercase tracking-wider">
            {tKpi('totalResolved')}
          </span>
          <div className="text-2xl font-bold font-headline text-emerald-600 dark:text-emerald-400 mt-2">
            {loading ? '-' : (myStaffItem?.totalResolved ?? 0).toLocaleString('vi-VN')}
          </div>
          <span className="text-[11px] text-text-muted dark:text-stone-500 mt-1">Đã giải quyết</span>
        </div>

        {/* Resolve Rate */}
        <div className="bg-surface-card dark:bg-stone-900 border border-border-subtle dark:border-stone-800 rounded-xl p-4 flex flex-col justify-between border-t-4 border-t-blue-600 shadow-xs">
          <span className="font-body text-[11px] font-bold text-text-muted dark:text-stone-400 uppercase tracking-wider">
            {tKpi('resolveRate')}
          </span>
          <div className="text-2xl font-bold font-headline text-blue-600 dark:text-blue-400 mt-2">
            {loading ? '-' : `${myStaffItem?.resolveRate ?? 0}%`}
          </div>
          <span className="text-[11px] text-text-muted dark:text-stone-500 mt-1">Tỷ lệ hoàn thành</span>
        </div>

        {/* SLA Met Rate */}
        <div className="bg-surface-card dark:bg-stone-900 border border-border-subtle dark:border-stone-800 rounded-xl p-4 flex flex-col justify-between border-t-4 border-t-amber-500 shadow-xs">
          <span className="font-body text-[11px] font-bold text-text-muted dark:text-stone-400 uppercase tracking-wider">
            {tKpi('slaMetRate')}
          </span>
          <div className="text-2xl font-bold font-headline text-amber-600 dark:text-amber-400 mt-2">
            {loading ? '-' : `${myStaffItem?.slaMetRate ?? 0}%`}
          </div>
          <span className="text-[11px] text-text-muted dark:text-stone-500 mt-1">
            {'<'} {kpiData?.summary?.slaThresholdMinutes || 120} {tKpi('minutesUnit')}
          </span>
        </div>

        {/* Open Backlog */}
        <div className="bg-surface-card dark:bg-stone-900 border border-border-subtle dark:border-stone-800 rounded-xl p-4 flex flex-col justify-between border-t-4 border-t-rose-500 shadow-xs">
          <span className="font-body text-[11px] font-bold text-text-muted dark:text-stone-400 uppercase tracking-wider">
            {tKpi('openBacklog')}
          </span>
          <div className="text-2xl font-bold font-headline text-rose-600 dark:text-rose-400 mt-2">
            {loading ? '-' : (myStaffItem?.openBacklog ?? 0).toLocaleString('vi-VN')}
          </div>
          <span className="text-[11px] text-text-muted dark:text-stone-500 mt-1">Đang cần giải quyết</span>
        </div>
      </div>

      {/* Daily Performance Trend Chart */}
      <div className="bg-surface-card dark:bg-stone-900 border border-border-subtle dark:border-stone-800 rounded-2xl p-5 md:p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle dark:border-stone-800">
          <h3 className="font-headline text-base font-bold text-text-ink dark:text-stone-100">
            {tKpi('chartTimeSeriesTitle')}
          </h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-text-muted dark:text-stone-400">
              <span className="w-2.5 h-2.5 rounded-xs bg-primary-container inline-block" />
              {tKpi('chartResolvedLegend')}
            </span>
            <span className="flex items-center gap-1.5 text-text-muted dark:text-stone-400">
              <span className="w-2.5 h-2.5 rounded-xs bg-surface-container-high dark:bg-stone-700 inline-block" />
              {tKpi('chartAssignedLegend')}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="h-64 bg-surface-container dark:bg-stone-800/40 animate-pulse rounded-xl" />
        ) : !kpiData?.timeSeries || kpiData.timeSeries.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-xs text-text-muted dark:text-stone-400">
            {tKpi('emptyData')}
          </div>
        ) : (
          <div className="h-64 flex flex-col justify-end pt-4">
            <div className="flex-1 flex items-end justify-between gap-1 overflow-x-auto pb-2">
              {kpiData.timeSeries.map((point) => {
                const resolvedHeight = Math.round((point.resolvedCount / maxDailyCount) * 100);
                const assignedHeight = Math.round((point.assignedCount / maxDailyCount) * 100);
                return (
                  <div
                    key={point.date}
                    className="flex-1 min-w-[24px] max-w-[44px] flex flex-col items-center gap-1 group relative cursor-pointer"
                  >
                    <div className="w-full flex items-end justify-center gap-1 h-48">
                      <div
                        className="w-1/2 bg-surface-container-high dark:bg-stone-700 rounded-t-xs transition-all duration-300"
                        style={{ height: `${Math.max(assignedHeight, 4)}%` }}
                        title={`${point.date} - Gán: ${point.assignedCount}`}
                      />
                      <div
                        className="w-1/2 bg-primary-container rounded-t-xs transition-all duration-300 group-hover:brightness-110"
                        style={{ height: `${Math.max(resolvedHeight, 4)}%` }}
                        title={`${point.date} - Xong: ${point.resolvedCount}`}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-text-muted dark:text-stone-400 truncate w-full text-center">
                      {point.date.slice(8, 10)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Performance Quality Metrics */}
      {myStaffItem && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface-card dark:bg-stone-900 border border-border-subtle dark:border-stone-800 rounded-2xl p-5 md:p-6 shadow-xs space-y-3">
            <h4 className="font-headline text-base font-bold text-text-ink dark:text-stone-100 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">speed</span>
              {tKpi('colFirstResponse')}
            </h4>
            <p className="font-body text-xs text-text-muted dark:text-stone-400">
              Thời gian từ lúc phiếu hỗ trợ được phân công tới lúc bạn gửi phản hồi đầu tiên tới khách hàng.
            </p>
            <div className="text-3xl font-bold font-mono text-primary-container pt-2">
              {myStaffItem.avgFirstResponseMinutes} {tKpi('minutesUnit')}
            </div>
          </div>

          <div className="bg-surface-card dark:bg-stone-900 border border-border-subtle dark:border-stone-800 rounded-2xl p-5 md:p-6 shadow-xs space-y-3">
            <h4 className="font-headline text-base font-bold text-text-ink dark:text-stone-100 flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">
                task_alt
              </span>
              {tKpi('colResolutionTime')}
            </h4>
            <p className="font-body text-xs text-text-muted dark:text-stone-400">
              Thời gian trung bình từ lúc tiếp nhận tới lúc đánh dấu hoàn tất phiếu hỗ trợ.
            </p>
            <div className="text-3xl font-bold font-mono text-purple-600 dark:text-purple-400 pt-2">
              {myStaffItem.avgResolutionMinutes >= 60
                ? `${Math.round(myStaffItem.avgResolutionMinutes / 60)} ${tKpi('hoursUnit')}`
                : `${myStaffItem.avgResolutionMinutes} ${tKpi('minutesUnit')}`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyKpiPage;
