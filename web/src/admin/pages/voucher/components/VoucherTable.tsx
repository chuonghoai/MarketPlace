import { useState, useRef, useEffect } from 'react';
import type { Voucher } from '../../../features/voucher/models/voucher.model';
import { VoucherType, DistributionType } from '../../../features/voucher/models/voucher.model';
import { VoucherStatusBadge } from './VoucherStatusBadge';

interface VoucherTableProps {
    vouchers: Voucher[];
    loading: boolean;
    onEdit: (voucher: Voucher) => void;
    onDelete: (voucher: Voucher) => void;
}

const VOUCHER_TYPE_LABEL: Record<string, string> = {
    [VoucherType.PERCENT]: 'Giảm %',
    [VoucherType.CASH]: 'Giảm tiền',
    [VoucherType.FREESHIP_CASH]: 'Freeship (tiền)',
    [VoucherType.FREESHIP_PERCENT]: 'Freeship (%)',
};

const DISTRIBUTION_LABEL: Record<string, string> = {
    [DistributionType.PUBLIC]: 'Công khai',
    [DistributionType.LIMITED]: 'Giới hạn',
};

const DISTRIBUTION_BADGE: Record<string, string> = {
    [DistributionType.PUBLIC]: 'bg-blue-50 text-blue-600 border border-blue-200',
    [DistributionType.LIMITED]: 'bg-orange-50 text-orange-600 border border-orange-200',
};

const formatDiscount = (voucher: Voucher): string => {
    if (voucher.voucher_type === VoucherType.FREESHIP_PERCENT) return `Giảm ${voucher.discount_value}% phí ship`;
    if (voucher.voucher_type === VoucherType.FREESHIP_CASH) return `Giảm ${voucher.discount_value.toLocaleString('vi-VN')}đ phí ship`;
    if (voucher.voucher_type === VoucherType.PERCENT) return `Giảm ${voucher.discount_value}%`;
    return `Giảm ${voucher.discount_value.toLocaleString('vi-VN')}đ`;
};

const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const VoucherTableRow = ({ voucher, onEdit, onDelete }: { voucher: Voucher, onEdit: (v: Voucher) => void, onDelete: (v: Voucher) => void }) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <tr className="hover:bg-surface-container/50 transition-colors flex flex-col md:table-row relative group border-b border-border-subtle md:border-b md:border-border-subtle last:border-b-0 md:last:border-b">
            {/* MOBILE ONLY VIEW */}
            <td className="p-4 md:hidden block w-full">
                 <div className="flex flex-col gap-3 w-full">
                     <div className="flex items-start justify-between gap-3 relative">
                         <span className="font-mono font-bold text-primary-container text-xs bg-surface-container px-2.5 py-1 rounded min-w-0 truncate">
                             {voucher.code}
                         </span>
                         <div className="flex items-center gap-1.5 shrink-0 relative" ref={menuRef}>
                             <VoucherStatusBadge status={voucher.status} />
                             <button
                                 onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                                 className="p-1 text-text-muted hover:text-text-ink rounded-full hover:bg-surface-container-highest transition-colors"
                             >
                                 <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                             </button>
                             
                             {showMenu && (
                                 <div className="absolute top-full right-0 mt-1 w-44 bg-white rounded-md shadow-lg border border-border-subtle z-50 overflow-hidden">
                                     <button
                                         onClick={(e) => { e.stopPropagation(); setShowMenu(false); onEdit(voucher); }}
                                         className="w-full text-left px-4 py-3 text-sm text-text-ink hover:bg-surface-container flex items-center gap-3 transition-colors"
                                     >
                                         <span className="material-symbols-outlined text-[18px] text-blue-600">edit</span>
                                         Chỉnh sửa
                                     </button>
                                     <button
                                         onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete(voucher); }}
                                         className="w-full text-left px-4 py-3 text-sm text-error hover:bg-surface-container flex items-center gap-3 transition-colors"
                                     >
                                         <span className="material-symbols-outlined text-[18px]">delete</span>
                                         Xóa
                                     </button>
                                 </div>
                             )}
                         </div>
                     </div>
                     
                     <p className="text-text-ink font-semibold text-[15px] line-clamp-2">{voucher.title}</p>
                     
                     <div className="flex items-center gap-2 text-sm mt-0.5">
                         <span className="text-text-ink font-medium">{VOUCHER_TYPE_LABEL[voucher.voucher_type]}</span>
                         <span className="text-text-muted text-[10px]">•</span>
                         <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${DISTRIBUTION_BADGE[voucher.distribution_type]}`}>
                             {DISTRIBUTION_LABEL[voucher.distribution_type]}
                         </span>
                     </div>
                     
                     <div className="flex items-center gap-2 mt-1 bg-surface-container/30 px-3 py-2 rounded border border-border-subtle/50">
                         <span className="text-market-primary font-semibold text-sm shrink-0">{formatDiscount(voucher)}</span>
                         {voucher.min_order_value > 0 && (
                             <span className="text-text-muted text-[13px] truncate min-w-0">
                                 - Đơn từ {voucher.min_order_value.toLocaleString('vi-VN')}đ
                             </span>
                         )}
                     </div>

                     <div className="grid grid-cols-2 gap-4 mt-2">
                         <div className="bg-surface-container/20 p-2.5 rounded-lg border border-border-subtle/50">
                             <p className="text-xs text-text-muted mb-1.5">Đã sử dụng</p>
                             <div className="flex items-center gap-1.5">
                                 <span className="font-semibold text-text-ink text-sm">{voucher.used_count}</span>
                                 <span className="text-text-muted text-xs">/ {voucher.total_limit}</span>
                             </div>
                             <div className="w-full h-1.5 bg-border-subtle rounded-full mt-2 overflow-hidden">
                                 <div
                                     className="h-full bg-primary-container rounded-full transition-all"
                                     style={{ width: `${Math.min((voucher.used_count / voucher.total_limit) * 100, 100)}%` }}
                                 />
                             </div>
                         </div>
                         <div className="bg-surface-container/20 p-2.5 rounded-lg border border-border-subtle/50">
                             <p className="text-xs text-text-muted mb-1.5">Hạn sử dụng</p>
                             <p className="text-text-ink text-sm font-medium">{formatDate(voucher.start_date)}</p>
                             <p className="text-text-muted text-xs mt-0.5 truncate">→ {formatDate(voucher.end_date)}</p>
                         </div>
                     </div>
                 </div>
            </td>

            {/* DESKTOP ONLY VIEW */}
            <td className="px-4 py-3 hidden md:table-cell">
                <div>
                    <span className="font-mono font-bold text-primary-container text-xs bg-surface-container px-2 py-0.5 rounded">
                        {voucher.code}
                    </span>
                    <p className="text-text-ink font-semibold mt-1 text-sm line-clamp-2">{voucher.title}</p>
                </div>
            </td>
            <td className="px-4 py-3 hidden md:table-cell">
                <span className="text-text-ink font-semibold text-xs">
                    {VOUCHER_TYPE_LABEL[voucher.voucher_type]}
                </span>
            </td>
            <td className="px-4 py-3 hidden md:table-cell">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${DISTRIBUTION_BADGE[voucher.distribution_type]}`}>
                    {DISTRIBUTION_LABEL[voucher.distribution_type]}
                </span>
            </td>
            <td className="px-4 py-3 hidden md:table-cell">
                <span className="text-text-ink font-semibold text-sm">{formatDiscount(voucher)}</span>
                {voucher.min_order_value > 0 && (
                    <p className="text-text-muted text-xs mt-0.5 truncate">
                        Đơn từ {voucher.min_order_value.toLocaleString('vi-VN')}đ
                    </p>
                )}
            </td>
            <td className="px-4 py-3 hidden md:table-cell">
                <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-text-ink">{voucher.used_count}</span>
                    <span className="text-text-muted text-xs">/ {voucher.total_limit}</span>
                </div>
                <div className="w-24 h-1.5 bg-border-subtle rounded-full mt-1.5 overflow-hidden">
                    <div
                        className="h-full bg-primary-container rounded-full transition-all"
                        style={{ width: `${Math.min((voucher.used_count / voucher.total_limit) * 100, 100)}%` }}
                    />
                </div>
            </td>
            <td className="px-4 py-3 hidden md:table-cell">
                <span className="text-text-muted text-xs">{formatDate(voucher.start_date)}</span>
                <p className="text-text-muted text-xs">→ {formatDate(voucher.end_date)}</p>
            </td>
            <td className="px-4 py-3 hidden md:table-cell">
                <VoucherStatusBadge status={voucher.status} />
            </td>
            <td className="px-4 py-3 hidden md:table-cell">
                <div className="flex items-center gap-1">
                    <button
                        id={`btn-edit-voucher-${voucher.id}`}
                        onClick={() => onEdit(voucher)}
                        title="Sửa / Khoá / Mở"
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                        id={`btn-delete-voucher-${voucher.id}`}
                        onClick={() => onDelete(voucher)}
                        title="Xoá"
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                </div>
            </td>
        </tr>
    );
};

export const VoucherTable = ({ vouchers, loading, onEdit, onDelete }: VoucherTableProps) => {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
                <span className="material-symbols-outlined text-4xl text-text-muted animate-spin">progress_activity</span>
                <p className="font-body text-sm text-text-muted">Đang tải danh sách voucher...</p>
            </div>
        );
    }

    if (vouchers.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
                <span className="material-symbols-outlined text-5xl text-text-muted">confirmation_number</span>
                <p className="font-body text-sm text-text-muted">Chưa có voucher nào.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto w-full">
            <table className="w-full text-sm font-body border-collapse">
                <thead className="hidden md:table-header-group">
                    <tr className="border-b border-border-subtle bg-surface-container">
                        <th className="text-left px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Mã / Tên</th>
                        <th className="text-left px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Loại</th>
                        <th className="text-left px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Phát hành</th>
                        <th className="text-left px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Ưu đãi</th>
                        <th className="text-left px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Đã dùng</th>
                        <th className="text-left px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Hạn dùng</th>
                        <th className="text-left px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Trạng thái</th>
                        <th className="text-left px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="divide-y-0 md:divide-y divide-border-subtle flex flex-col md:table-row-group">
                    {vouchers.map((voucher) => (
                        <VoucherTableRow
                            key={voucher.id}
                            voucher={voucher}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};
