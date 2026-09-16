import type { VoucherStatus } from '../../../features/voucher/models/voucher.model';
import { VoucherStatus as VS } from '../../../features/voucher/models/voucher.model';

interface VoucherStatusBadgeProps {
    status: VoucherStatus;
}

const STATUS_CONFIG: Record<VoucherStatus, { label: string; className: string }> = {
    [VS.ACTIVE]: {
        label: 'Đang hoạt động',
        className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    },
    [VS.DISABLED]: {
        label: 'Vô hiệu hóa',
        className: 'bg-amber-50 text-amber-700 border border-amber-200',
    },
    [VS.EXPIRED]: {
        label: 'Đã hết hạn',
        className: 'bg-slate-100 text-slate-500 border border-slate-200',
    },
};

export const VoucherStatusBadge = ({ status }: VoucherStatusBadgeProps) => {
    const config = STATUS_CONFIG[status];
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-body ${config.className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
            {config.label}
        </span>
    );
};
