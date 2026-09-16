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

export interface IVoucherRepository {
    getVouchers(query: GetVouchersQuery): Promise<ApiResponse<Voucher[]>>;
    getVoucherById(id: number): Promise<ApiResponse<Voucher>>;
    createVoucher(data: CreateVoucherRequest): Promise<ApiResponse<CreateVoucherResponse>>;
    updateVoucherStatus(id: number, data: UpdateVoucherStatusRequest): Promise<ApiResponse<null>>;
    getVoucherStats(): Promise<ApiResponse<VoucherStats>>;
    updateVoucher(id: number, data: UpdateVoucherRequest): Promise<ApiResponse<null>>;
    deleteVoucher(id: number): Promise<ApiResponse<null>>;
}
