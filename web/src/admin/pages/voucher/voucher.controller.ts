import { useCallback, useMemo, useState } from 'react';
import { useVoucherStore } from './voucher.store';
import { voucherService } from '../../features/voucher/services/voucher.service';
import type { CreateVoucherRequest, UpdateVoucherRequest, Voucher } from '../../features/voucher/models/voucher.model';
import { VoucherStatus } from '../../features/voucher/models/voucher.model';

export const useVoucherController = () => {
    const store = useVoucherStore();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const query = useMemo(() => ({
        page: store.page,
        pageSize: store.pageSize,
        ...store.filters,
    }), [store.page, store.pageSize, store.filters]);

    const fetchVouchers = useCallback(async () => {
        store.setLoading(true);
        store.setError(null);
        try {
            const response = await voucherService.fetchVouchers(query);
            if (response.success && response.data) {
                store.setVouchers(response.data);
                if (response.pagination) {
                    store.setPagination(
                        response.pagination.page,
                        response.pagination.pageSize,
                        response.pagination.totalItems,
                        response.pagination.totalPages
                    );
                }
            } else {
                store.setError(response.message || 'Lỗi khi tải danh sách voucher');
            }
        } catch (error: any) {
            store.setError(error?.message || 'Đã xảy ra lỗi không xác định');
        } finally {
            store.setLoading(false);
        }
    }, [query]);

    const fetchStats = useCallback(async () => {
        store.setStatsLoading(true);
        try {
            const response = await voucherService.fetchStats();
            if (response.success && response.data) {
                store.setStats(response.data);
            }
        } catch (error) {
            console.error('Lỗi khi tải thống kê:', error);
        } finally {
            store.setStatsLoading(false);
        }
    }, []);

    const handlePageChange = (newPage: number) => {
        store.setPagination(newPage, store.pageSize, store.totalItems, store.totalPages);
    };

    const handleFilterChange = (filters: typeof store.filters) => {
        store.setFilters(filters);
    };

    const handleOpenCreateModal = () => setIsCreateModalOpen(true);
    const handleCloseCreateModal = () => setIsCreateModalOpen(false);

    const handleCreateVoucher = async (data: CreateVoucherRequest): Promise<boolean> => {
        store.setSaving(true);
        try {
            const response = await voucherService.createVoucher(data);
            if (response.success) {
                handleCloseCreateModal();
                await fetchVouchers();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Lỗi khi tạo voucher:', error);
            return false;
        } finally {
            store.setSaving(false);
        }
    };

    const handleOpenEditModal = (voucher: Voucher) => {
        store.setSelectedVoucherForEdit(voucher);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        store.setSelectedVoucherForEdit(null);
        setIsEditModalOpen(false);
    };

    const handleEditVoucher = async (id: number, data: UpdateVoucherRequest): Promise<boolean> => {
        store.setSaving(true);
        try {
            const response = await voucherService.updateVoucher(id, data);
            if (response.success) {
                handleCloseEditModal();
                await fetchVouchers();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Lỗi khi sửa voucher:', error);
            return false;
        } finally {
            store.setSaving(false);
        }
    };

    const handleDeleteVoucher = async (id: number): Promise<boolean> => {
        try {
            const response = await voucherService.deleteVoucher(id);
            if (response.success) {
                store.removeVoucherFromList(id);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Lỗi khi xóa voucher:', error);
            return false;
        }
    };

    const handleDisableVoucher = async (id: number): Promise<boolean> => {
        try {
            const response = await voucherService.disableVoucher(id, { status: VoucherStatus.DISABLED });
            if (response.success) {
                store.updateVoucherInList(id, { status: VoucherStatus.DISABLED });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Lỗi khi vô hiệu hóa voucher:', error);
            return false;
        }
    };

    const handleActivateVoucher = async (id: number): Promise<boolean> => {
        try {
            const response = await voucherService.disableVoucher(id, { status: VoucherStatus.ACTIVE });
            if (response.success) {
                store.updateVoucherInList(id, { status: VoucherStatus.ACTIVE });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Lỗi khi kích hoạt voucher:', error);
            return false;
        }
    };

    return {
        vouchers: store.vouchers,
        loading: store.loading,
        error: store.error,
        page: store.page,
        pageSize: store.pageSize,
        totalItems: store.totalItems,
        totalPages: store.totalPages,
        filters: store.filters,
        saving: store.saving,
        stats: store.stats,
        statsLoading: store.statsLoading,

        isCreateModalOpen,
        isEditModalOpen,
        selectedVoucherForEdit: store.selectedVoucherForEdit,

        fetchVouchers,
        fetchStats,
        handlePageChange,
        handleFilterChange,
        handleOpenCreateModal,
        handleCloseCreateModal,
        handleCreateVoucher,
        handleOpenEditModal,
        handleCloseEditModal,
        handleEditVoucher,
        handleDeleteVoucher,
        handleDisableVoucher,
        handleActivateVoucher,
    };
};
