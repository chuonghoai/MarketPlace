import type { ApiResponse } from '../../../../core/api/apiResponse';
import type {
    Voucher,
    VoucherStats,
    GetVouchersQuery,
    CreateVoucherRequest,
    UpdateVoucherStatusRequest,
    CreateVoucherResponse,
    UpdateVoucherRequest,
} from '../models/voucher.model';
import type { IVoucherRepository } from '../repositories/voucher.repository';
import { VoucherApiRepository } from '../repositories/voucherApi.repository';
import { VoucherMockRepository } from '../repositories/voucherMock.repository';
import { USE_MOCK } from '../../../../core/config/useMock.config';

export class VoucherService {
    private readonly repository: IVoucherRepository;

    constructor(repository: IVoucherRepository) {
        this.repository = repository;
    }

    async fetchVouchers(query: GetVouchersQuery): Promise<ApiResponse<Voucher[]>> {
        try {
            return await this.repository.getVouchers(query);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách voucher:', error);
            throw error;
        }
    }

    async fetchVoucherById(id: number): Promise<ApiResponse<Voucher>> {
        try {
            return await this.repository.getVoucherById(id);
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết voucher:', error);
            throw error;
        }
    }

    async createVoucher(data: CreateVoucherRequest): Promise<ApiResponse<CreateVoucherResponse>> {
        try {
            return await this.repository.createVoucher(data);
        } catch (error) {
            console.error('Lỗi khi tạo voucher:', error);
            throw error;
        }
    }

    async disableVoucher(id: number, data: UpdateVoucherStatusRequest): Promise<ApiResponse<null>> {
        try {
            return await this.repository.updateVoucherStatus(id, data);
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái voucher:', error);
            throw error;
        }
    }


    async fetchStats(): Promise<ApiResponse<VoucherStats>> {
        try {
            return await this.repository.getVoucherStats();
        } catch (error) {
            console.error('Lỗi khi lấy thống kê voucher:', error);
            throw error;
        }
    }

    async updateVoucher(id: number, data: UpdateVoucherRequest): Promise<ApiResponse<null>> {
        try {
            return await this.repository.updateVoucher(id, data);
        } catch (error) {
            console.error('Lỗi khi cập nhật voucher:', error);
            throw error;
        }
    }

    async deleteVoucher(id: number): Promise<ApiResponse<null>> {
        try {
            return await this.repository.deleteVoucher(id);
        } catch (error) {
            console.error('Lỗi khi xóa voucher:', error);
            throw error;
        }
    }
}

export const voucherService = new VoucherService(
    USE_MOCK ? new VoucherMockRepository() : new VoucherApiRepository()
);
