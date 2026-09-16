export const VoucherType = {
    PERCENT: 'PERCENT',
    CASH: 'CASH',
    FREESHIP_PERCENT: 'FREESHIP_PERCENT',
    FREESHIP_CASH: 'FREESHIP_CASH',
} as const;

export type VoucherType = typeof VoucherType[keyof typeof VoucherType];

export interface ClientVoucherResponseDto {
    id: number;
    code: string;
    title: string;
    voucher_type: VoucherType;
    discount_value: number;
    max_discount_amount?: number;
    min_order_value: number;
    start_date: string;
    end_date: string;
}
