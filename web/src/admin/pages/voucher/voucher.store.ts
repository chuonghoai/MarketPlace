import { create } from 'zustand';
import type { Voucher, VoucherStats, GetVouchersQuery } from '../../features/voucher/models/voucher.model';

interface VoucherState {
    vouchers: Voucher[];
    loading: boolean;
    error: string | null;

    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    filters: Omit<GetVouchersQuery, 'page' | 'pageSize'>;

    saving: boolean;
    selectedVoucherForEdit: Voucher | null;

    stats: VoucherStats | null;
    statsLoading: boolean;

    setVouchers: (vouchers: Voucher[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setPagination: (page: number, pageSize: number, totalItems: number, totalPages: number) => void;
    setFilters: (filters: Omit<GetVouchersQuery, 'page' | 'pageSize'>) => void;
    setSaving: (saving: boolean) => void;
    setStats: (stats: VoucherStats | null) => void;
    setStatsLoading: (loading: boolean) => void;
    updateVoucherInList: (id: number, patch: Partial<Voucher>) => void;
    removeVoucherFromList: (id: number) => void;
    setSelectedVoucherForEdit: (voucher: Voucher | null) => void;
}

export const useVoucherStore = create<VoucherState>((set) => ({
    vouchers: [],
    loading: false,
    error: null,

    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    filters: {},

    saving: false,
    selectedVoucherForEdit: null,

    stats: null,
    statsLoading: false,

    setVouchers: (vouchers) => set({ vouchers }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setPagination: (page, pageSize, totalItems, totalPages) =>
        set({ page, pageSize, totalItems, totalPages }),
    setFilters: (filters) => set({ filters, page: 1 }),
    setSaving: (saving) => set({ saving }),
    setStats: (stats) => set({ stats }),
    setStatsLoading: (statsLoading) => set({ statsLoading }),
    updateVoucherInList: (id, patch) =>
        set((state) => ({
            vouchers: state.vouchers.map((v) => (v.id === id ? { ...v, ...patch } : v)),
        })),
    removeVoucherFromList: (id) =>
        set((state) => ({
            vouchers: state.vouchers.filter((v) => v.id !== id),
            totalItems: state.totalItems - 1,
        })),
    setSelectedVoucherForEdit: (voucher) => set({ selectedVoucherForEdit: voucher }),
}));
