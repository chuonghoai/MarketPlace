export const DistributionType = {
    PUBLIC: 'PUBLIC',
    LIMITED: 'LIMITED',
} as const;

export type DistributionType = typeof DistributionType[keyof typeof DistributionType];

export const VoucherType = {
    PERCENT: 'PERCENT',
    CASH: 'CASH',
    FREESHIP_CASH: 'FREESHIP_CASH',
    FREESHIP_PERCENT: 'FREESHIP_PERCENT',
} as const;

export type VoucherType = typeof VoucherType[keyof typeof VoucherType];

export const VoucherStatus = {
    ACTIVE: 'ACTIVE',
    DISABLED: 'DISABLED',
    EXPIRED: 'EXPIRED',
} as const;

export type VoucherStatus = typeof VoucherStatus[keyof typeof VoucherStatus];

export interface Voucher {
    id: number;
    title: string;
    code: string;
    distribution_type: DistributionType;
    voucher_type: VoucherType;
    discount_value: number;
    max_discount_amount: number | null;
    min_order_value: number;
    total_limit: number;
    used_count: number;
    limit_per_user: number;
    start_date: string;
    end_date: string;
    status: VoucherStatus;
    created_at: string;
}

export interface VoucherStats {
    total_vouchers: number;
    total_used_count: number;
    total_discount_given: number;
    most_popular_type: VoucherType | null;
    top_vouchers: VoucherStatItem[];
    active_vouchers_count: number;
}

export interface VoucherStatItem {
    id: number;
    title: string;
    code: string;
    used_count: number;
    total_discount_given: number;
    voucher_type: VoucherType;
}

export interface GetVouchersQuery {
    page?: number;
    pageSize?: number;
    status?: VoucherStatus;
    distribution_type?: DistributionType;
}

export interface CreateVoucherRequest {
    title: string;
    code: string;
    distribution_type: DistributionType;
    voucher_type: VoucherType;
    discount_value: number;
    max_discount_amount: number | null;
    min_order_value: number;
    total_limit: number;
    limit_per_user: number;
    start_date: string;
    end_date: string;
}

export interface UpdateVoucherRequest {
    title?: string;
    discount_value?: number;
    max_discount_amount?: number | null;
    total_limit?: number;
    limit_per_user?: number;
    start_date?: string;
    end_date?: string;
    status?: VoucherStatus;
}

export interface UpdateVoucherStatusRequest {
    status: VoucherStatus;
}


export interface CreateVoucherResponse {
    id: number;
    status: VoucherStatus;
}
