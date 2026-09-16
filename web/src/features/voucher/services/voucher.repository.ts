import { apiClient } from '../../../core/api/apiClient';
import type { ApiResponse } from '../../../core/api/apiResponse';
import type { ClientVoucherResponseDto } from '../model/voucher.model';

export class VoucherRepository {
    private readonly basePath = '/api/v1/vouchers';

    async getValidVouchers(subTotal: number): Promise<ApiResponse<ClientVoucherResponseDto[]>> {
        return await apiClient.get<ApiResponse<ClientVoucherResponseDto[]>>(`${this.basePath}/valid`, {
            params: { subTotal }
        });
    }

    async lookupVoucher(code: string, subTotal: number): Promise<ApiResponse<ClientVoucherResponseDto>> {
        return await apiClient.get<ApiResponse<ClientVoucherResponseDto>>(`${this.basePath}/lookup`, {
            params: { code, subTotal }
        });
    }
}

export const voucherRepository = new VoucherRepository();
