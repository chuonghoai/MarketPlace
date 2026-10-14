import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { kpiService } from '../../../features/kpi/services/kpi.service';
import { staffService, type Staff } from '../../../features/staff/services/staff.service';
import type { StaffKpiResponseData } from '../../../features/kpi/models/kpi.model';
import { tKpi } from '../../../features/kpi/constants/kpiL10n';

export const StaffKpiPage: React.FC = () => {
  // Dates default to last 30 days
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const thirtyDaysAgoStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  }, []);

  const [startDate, setStartDate] = useState(thirtyDaysAgoStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [staffList, setStaffList] = useState<Staff[]>([]);

  const [kpiData, setKpiData] = useState<StaffKpiResponseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchKpi = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await kpiService.getStaffsKpi({
        startDate,
        endDate,
        staffId: selectedStaffId || undefined,
        pageSize: 50,
      });
      setKpiData(res.data);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || tKpi('errorOccurred'));
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, selectedStaffId]);

  const fetchStaffs = async () => {
    try {
      const res = await staffService.getAll(1, 100);
      setStaffList(res.data || []);
    } catch (err: unknown) {
      console.error(err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStaffs();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchKpi();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchKpi]);

  const handlePreset = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    setStartDate(d.toISOString().slice(0, 10));
    setEndDate(new Date().toISOString().slice(0, 10));
  };

  // Max value for daily trend chart
  const maxDailyCount = (() => {
    if (!kpiData?.timeSeries || kpiData.timeSeries.length === 0) return 1;
    return Math.max(
      ...kpiData.timeSeries.map((t) => Math.max(t.assignedCount, t.resolvedCount)),
      1,
    );
  })();

  // Max value for staff resolved bar chart
  const maxStaffResolved = (() => {
    if (!kpiData?.items || kpiData.items.length === 0) return 1;
    return Math.max(...kpiData.items.map((i) => i.totalResolved), 1);
  })();

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 pb-12">
      {/* Title & Filter Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 border-b border-border-subtle dark:border-stone-800 pb-5">
        <div>
          <h1 className="font-headline text-2xl md:text-3xl font-bold text-text-ink dark:text-stone-100">
            {tKpi('pageTitle')}
          </h1>
          <p className="font-body text-sm text-text-muted dark:text-stone-400 mt-1">
            {tKpi('subtitle')}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 bg-surface-card dark:bg-stone-900 border border-border-subtle dark:border-stone-800 p-2 rounded-xl shadow-xs">
          {/* Quick presets */}
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

          {/* Date pickers */}
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

          {/* Staff Selector */}
          <select
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-border-subtle dark:border-stone-700 bg-surface-card dark:bg-stone-900 text-text-ink dark:text-stone-100 focus:outline-none"
          >
            <option value="">{tKpi('allStaffs')}</option>
            {staffList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.user?.fullName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-error rounded-xl text-sm font-body">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Assigned */}
        <div className="bg-surface-card dark:bg-stone-900 border border-border-subtle dark:border-stone-800 rounded-xl p-4 flex flex-col justify-between border-t-4 border-t-primary-container shadow-xs">
          <span className="font-body text-[11px] font-bold text-text-muted dark:text-stone-400 uppercase tracking-wider">
            {tKpi('totalAssigned')}
          </span>
          <div className="text-2xl font-bold font-headline text-text-ink dark:text-stone-100 mt-2">
            {loading ? '-' : (kpiData?.summary?.totalAssigned ?? 0).toLocaleString('vi-VN')}
          </div>
          <span className="text-[11px] text-text-muted dark:text-stone-500 mt-1">Yêu cầu được gán</span>
        </div>

        {/* Total Resolved */}
        <div className="bg-surface-card dark:bg-stone-900 border border-border-subtle dark:border-stone-800 rounded-xl p-4 flex flex-col justify-between border-t-4 border-t-emerald-600 shadow-xs">
          <span className="font-body text-[11px] font-bold text-text-muted dark:text-stone-400 uppercase tracking-wider">
            {tKpi('totalResolved')}
          </span>
          <div className="text-2xl font-bold font-headline text-emerald-600 dark:text-emerald-400 mt-2">
            {loading ? '-' : (kpiData?.summary?.totalResolved ?? 0).toLocaleString('vi-VN')}
          </div>
          <span className="text-[11px] text-text-muted dark:text-stone-500 mt-1">Đã hoàn thành</span>
        </div>

        {/* Resolve Rate */}
        <div className="bg-surface-card dark:bg-stone-900 border border-border-subtle dark:border-stone-800 rounded-xl p-4 flex flex-col justify-between border-t-4 border-t-blue-600 shadow-xs">
          <span className="font-body text-[11px] font-bold text-text-muted dark:text-stone-400 uppercase tracking-wider">
            {tKpi('resolveRate')}
          </span>
          <div className="text-2xl font-bold font-headline text-blue-600 dark:text-blue-400 mt-2">
            {loading ? '-' : `${kpiData?.summary?.overallResolveRate ?? 0}%`}
          </div>
          <span className="text-[11px] text-text-muted dark:text-stone-500 mt-1">Hiệu quả xử lý</span>
        </div>

        {/* SLA Met Rate */}
        <div className="bg-surface-card dark:bg-stone-900 border border-border-subtle dark:border-stone-800 rounded-xl p-4 flex flex-col justify-between border-t-4 border-t-amber-500 shadow-xs">
          <span className="font-body text-[11px] font-bold text-text-muted dark:text-stone-400 uppercase tracking-wider">
            {tKpi('slaMetRate')}
          </span>
          <div className="text-2xl font-bold font-headline text-amber-600 dark:text-amber-400 mt-2">
            {loading ? '-' : `${kpiData?.summary?.overallSlaMetRate ?? 0}%`}
          </div>
          <span className="text-[11px] text-text-muted dark:text-stone-500 mt-1">
            {'<'} {kpiData?.summary?.slaThresholdMinutes || 120} {tKpi('minutesUnit')}
          </span>
        </div>

        {/* Avg Resolution Time */}
        <div className="bg-surface-card dark:bg-stone-900 border border-border-subtle dark:border-stone-800 rounded-xl p-4 flex flex-col justify-between border-t-4 border-t-purple-600 shadow-xs">
          <span className="font-body text-[11px] font-bold text-text-muted dark:text-stone-400 uppercase tracking-wider">
            {tKpi('avgResolution')}
          </span>
          <div className="text-2xl font-bold font-headline text-purple-600 dark:text-purple-400 mt-2">
            {loading
              ? '-'
              : (kpiData?.summary?.avgResolutionMinutes ?? 0) >= 60
              ? `${Math.round((kpiData?.summary?.avgResolutionMinutes ?? 0) / 60)} ${tKpi('hoursUnit')}`
              : `${kpiData?.summary?.avgResolutionMinutes ?? 0} ${tKpi('minutesUnit')}`}
          </div>
          <span className="text-[11px] text-text-muted dark:text-stone-500 mt-1">Thời gian xử lý</span>
        </div>

        {/* Open Backlog */}
        <div className="bg-surface-card dark:bg-stone-900 border border-border-subtle dark:border-stone-800 rounded-xl p-4 flex flex-col justify-between border-t-4 border-t-rose-500 shadow-xs">
          <span className="font-body text-[11px] font-bold text-text-muted dark:text-stone-400 uppercase tracking-wider">
            {tKpi('openBacklog')}
          </span>
          <div className="text-2xl font-bold font-headline text-rose-600 dark:text-rose-400 mt-2">
            {loading ? '-' : (kpiData?.summary?.totalBacklog ?? 0).toLocaleString('vi-VN')}
          </div>
          <span className="text-[11px] text-text-muted dark:text-stone-500 mt-1">Chưa hoàn tất</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Resolved tickets by staff */}
        <div className="bg-surface-card dark:bg-stone-900 border border-border-subtle dark:border-stone-800 rounded-2xl p-5 md:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle dark:border-stone-800">
            <h3 className="font-headline text-base font-bold text-text-ink dark:text-stone-100">
              {tKpi('chartStaffResolvedTitle')}
            </h3>
            <span className="material-symbols-outlined text-text-muted text-[20px]">
              leaderboard
            </span>
          </div>

          {loading ? (
            <div className="h-60 bg-surface-container dark:bg-stone-800/40 animate-pulse rounded-xl" />
          ) : !kpiData?.items || kpiData.items.length === 0 ? (
            <div className="h-60 flex items-center justify-center text-xs text-text-muted dark:text-stone-400">
              {tKpi('emptyData')}
            </div>
          ) : (
            <div className="space-y-3.5 pt-2 max-h-64 overflow-y-auto pr-1">
              {kpiData.items.map((staff) => {
                const widthPct = Math.round((staff.totalResolved / maxStaffResolved) * 100);
                return (
                  <div key={staff.staffId} className="space-y-1">
                    <div className="flex justify-between text-xs font-body">
                      <span className="font-semibold text-text-ink dark:text-stone-200 truncate max-w-[200px]">
                        {staff.staffName}
                      </span>
                      <span className="font-mono text-text-muted dark:text-stone-400">
                        {staff.totalResolved} / {staff.totalAssigned} ({staff.resolveRate}%)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-surface-container dark:bg-stone-800 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-primary-container rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${Math.max(widthPct, 2)}%` }}
                        title={`${staff.staffName}: ${staff.totalResolved} phiếu`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Chart 2: Daily trend chart (pure CSS div) */}
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
            <div className="h-60 bg-surface-container dark:bg-stone-800/40 animate-pulse rounded-xl" />
          ) : !kpiData?.timeSeries || kpiData.timeSeries.length === 0 ? (
            <div className="h-60 flex items-center justify-center text-xs text-text-muted dark:text-stone-400">
              {tKpi('emptyData')}
            </div>
          ) : (
            <div className="h-60 flex flex-col justify-end pt-4">
              <div className="flex-1 flex items-end justify-between gap-1 overflow-x-auto pb-2">
                {kpiData.timeSeries.map((point) => {
                  const resolvedHeight = Math.round((point.resolvedCount / maxDailyCount) * 100);
                  const assignedHeight = Math.round((point.assignedCount / maxDailyCount) * 100);
                  return (
                    <div
                      key={point.date}
                      className="flex-1 min-w-[20px] max-w-[40px] flex flex-col items-center gap-1 group relative cursor-pointer"
                    >
                      <div className="w-full flex items-end justify-center gap-0.5 h-44">
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
                      <span className="text-[9px] font-mono text-text-muted dark:text-stone-400 truncate w-full text-center">
                        {point.date.slice(8, 10)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Staff Ranking Table */}
      <div className="bg-surface-card dark:bg-stone-900 border border-border-subtle dark:border-stone-800 rounded-2xl p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle dark:border-stone-800">
          <h3 className="font-headline text-base font-bold text-text-ink dark:text-stone-100">
            {tKpi('staffRanking')}
          </h3>
          <span className="font-body text-xs text-text-muted dark:text-stone-400">
            {kpiData?.items?.length || 0} {tKpi('totalStaffs')}
          </span>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs font-body border-collapse">
            <thead>
              <tr className="border-b border-border-subtle dark:border-stone-800 text-text-muted dark:text-stone-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-3 w-12 text-center">{tKpi('colRank')}</th>
                <th className="py-3 px-3">{tKpi('colStaff')}</th>
                <th className="py-3 px-3 text-center">{tKpi('colAssigned')}</th>
                <th className="py-3 px-3 text-center">{tKpi('colResolved')}</th>
                <th className="py-3 px-3 text-center">{tKpi('colResolveRate')}</th>
                <th className="py-3 px-3 text-center">{tKpi('colSlaRate')}</th>
                <th className="py-3 px-3 text-center">{tKpi('colFirstResponse')}</th>
                <th className="py-3 px-3 text-center">{tKpi('colResolutionTime')}</th>
                <th className="py-3 px-3 text-center">{tKpi('colBacklog')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle dark:divide-stone-800 text-text-ink dark:text-stone-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-text-muted dark:text-stone-400">
                    {tKpi('loading')}
                  </td>
                </tr>
              ) : !kpiData?.items || kpiData.items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-text-muted dark:text-stone-400">
                    {tKpi('emptyData')}
                  </td>
                </tr>
              ) : (
                kpiData.items.map((item, idx) => (
                  <tr
                    key={item.staffId}
                    className="hover:bg-surface-container dark:hover:bg-stone-800/60 transition-colors"
                  >
                    <td className="py-3.5 px-3 text-center font-bold text-text-muted dark:text-stone-400 font-mono">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-3 font-semibold">
                      <div>{item.staffName}</div>
                      <div className="text-[11px] text-text-muted dark:text-stone-400 font-normal">
                        {item.staffEmail}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono">{item.totalAssigned}</td>
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {item.totalResolved}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          item.resolveRate >= 80
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : item.resolveRate >= 50
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}
                      >
                        {item.resolveRate}%
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono">
                      <span className="font-semibold text-primary-container">{item.slaMetRate}%</span>
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono text-text-muted dark:text-stone-400">
                      {item.avgFirstResponseMinutes} {tKpi('minutesUnit')}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono text-text-muted dark:text-stone-400">
                      {item.avgResolutionMinutes >= 60
                        ? `${Math.round(item.avgResolutionMinutes / 60)} ${tKpi('hoursUnit')}`
                        : `${item.avgResolutionMinutes} ${tKpi('minutesUnit')}`}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono text-rose-600 dark:text-rose-400 font-bold">
                      {item.openBacklog}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffKpiPage;
