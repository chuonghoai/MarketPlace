import React, { useState, useEffect } from 'react';
import { voucherService } from '../../../features/voucher/services/voucher.service';
import type { ClientVoucherResponseDto } from '../../../features/voucher/model/voucher.model';
import { VoucherType } from '../../../features/voucher/model/voucher.model';
import { useToast } from '../../../components/toast/toast';
import { formatCurrency } from '../../../admin/pages/orderDetail/utils/helpers';

interface VoucherModalProps {
    isOpen: boolean;
    onClose: () => void;
    subTotal: number;
    selectedVouchers: string[];
    onApplyVouchers: (codes: string[]) => void;
}

export const VoucherModal: React.FC<VoucherModalProps> = ({
    isOpen,
    onClose,
    subTotal,
    selectedVouchers,
    onApplyVouchers
}) => {
    const { toast } = useToast();
    const [vouchers, setVouchers] = useState<ClientVoucherResponseDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);
    const [inputCode, setInputCode] = useState('');

    const renderDiscountValue = (v: ClientVoucherResponseDto) => {
        switch (v.voucher_type) {
            case VoucherType.CASH:
                return `Giảm ${formatCurrency(v.discount_value)}`;
            case VoucherType.PERCENT:
                return `Giảm ${v.discount_value}%`;
            case VoucherType.FREESHIP_CASH:
                return `Giảm phí vận chuyển ${formatCurrency(v.discount_value)}`;
            case VoucherType.FREESHIP_PERCENT:
                if (Number(v.discount_value) === 100) return 'Miễn phí vận chuyển';
                return `Giảm ${v.discount_value}% phí vận chuyển`;
            default:
                return '';
        }
    };

    useEffect(() => {
        if (isOpen) {
            setSelected([...selectedVouchers]);
            fetchValidVouchers();
        }
    }, [isOpen, selectedVouchers, subTotal]);

    const fetchValidVouchers = async () => {
        setLoading(true);
        const data = await voucherService.getValidVouchers(subTotal);
        setVouchers(data);
        setLoading(false);
    };

    const handleApplyInputCode = async () => {
        if (!inputCode.trim()) return;
        const res = await voucherService.lookupVoucher(inputCode.trim(), subTotal);
        if (res.success && res.data) {
            const voucher = res.data;
            if (!vouchers.find(v => v.code === voucher.code)) {
                setVouchers([voucher, ...vouchers]);
            }
            handleToggleSelect(voucher.code, voucher.voucher_type);
            setInputCode('');
        } else {
            toast(res.message || 'Mã voucher không hợp lệ', 'error');
        }
    };

    const handleToggleSelect = (code: string, type: VoucherType) => {
        const isSelected = selected.includes(code);
        if (isSelected) {
            setSelected(selected.filter(c => c !== code));
            return;
        }

        const isFreeship = type === VoucherType.FREESHIP_PERCENT || type === VoucherType.FREESHIP_CASH;
        const freeshipCount = selected.filter(c => {
            const v = vouchers.find(v => v.code === c);
            return v && (v.voucher_type === VoucherType.FREESHIP_PERCENT || v.voucher_type === VoucherType.FREESHIP_CASH);
        }).length;

        const discountCount = selected.filter(c => {
            const v = vouchers.find(v => v.code === c);
            return v && (v.voucher_type === VoucherType.PERCENT || v.voucher_type === VoucherType.CASH);
        }).length;

        if (isFreeship && freeshipCount >= 1) {
            toast('Chỉ được chọn tối đa 1 mã Miễn phí vận chuyển', 'warning');
            return;
        }

        if (!isFreeship && discountCount >= 2) {
            toast('Chỉ được chọn tối đa 2 mã Giảm giá', 'warning');
            return;
        }

        setSelected([...selected, code]);
    };

    const handleConfirm = () => {
        onApplyVouchers(selected);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-[#FFFFFF] w-[90%] max-w-md rounded-xl border border-[#E7E5E4] flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-4 border-b border-[#E7E5E4]">
                    <h3 className="font-subhead text-[26px] text-[#C2410C] font-semibold tracking-wide">Chọn Voucher</h3>
                    <button className="text-text-muted hover:text-[#C2410C] transition-colors" onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="p-4 space-y-4 overflow-y-auto bg-[#FFFBF5]">
                    <div className="flex gap-2">
                        <input 
                            className="w-full px-3 py-2 border border-[#E7E5E4] rounded-lg text-sm font-body placeholder:text-text-muted focus:outline-none focus:border-[#C2410C] bg-[#FFFFFF]" 
                            placeholder="Nhập mã voucher" 
                            type="text" 
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value)}
                        />
                        <button 
                            className="bg-[#C2410C] text-white px-4 py-2 rounded-lg text-sm font-body font-medium hover:bg-[#9A3412] whitespace-nowrap transition-colors border border-[#C2410C]"
                            onClick={handleApplyInputCode}
                        >
                            Áp dụng
                        </button>
                    </div>
                    {loading ? (
                        <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#C2410C] mx-auto"></div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {vouchers.map(v => {
                                const isSelected = selected.includes(v.code);
                                const isFreeship = v.voucher_type === VoucherType.FREESHIP_CASH || v.voucher_type === VoucherType.FREESHIP_PERCENT;
                                const isEligible = subTotal >= v.min_order_value;
                                return (
                                    <label key={v.code} className={`block ${isEligible ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}>
                                        <div className={`p-4 border rounded-lg flex justify-between items-start gap-4 relative overflow-hidden transition-colors ${isSelected ? 'border-[#C2410C] bg-[#FFFBF5]' : 'border-[#E7E5E4] bg-[#FFFFFF] hover:border-[#D4A373]'}`}>
                                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isFreeship ? 'bg-[#365314]' : 'bg-[#C2410C]'}`}></div>
                                            <div className="pl-4 grow flex flex-col justify-center">
                                                <div className="font-subhead text-xl text-[#C2410C] font-bold tracking-tight mb-2">
                                                    {renderDiscountValue(v)}
                                                </div>
                                                
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-body text-sm font-semibold text-text-ink bg-[#F5F5F5] px-2 py-0.5 rounded border border-[#E7E5E4]">Mã: {v.code}</span>
                                                        {isSelected && <span className="bg-[#FFFBF5] border border-[#C2410C] text-[#C2410C] text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Đã chọn</span>}
                                                    </div>
                                                    
                                                    {v.max_discount_amount && Number(v.max_discount_amount) > 0 && (
                                                        <p className="font-caption text-text-muted">Tối đa {formatCurrency(v.max_discount_amount)}</p>
                                                    )}
                                                    
                                                    <p className="font-caption text-text-muted">Đơn tối thiểu {formatCurrency(v.min_order_value)}</p>
                                                    
                                                    <p className="font-body-sm text-text-muted mt-1 italic">{v.title}</p>
                                                </div>

                                                {!isEligible && (
                                                    <div className="mt-2">
                                                        <span className="font-caption text-[#DC2626] font-medium bg-[#FEF2F2] px-2 py-1 rounded">Mua thêm {formatCurrency(v.min_order_value - subTotal)} để áp dụng</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="shrink-0 pt-1">
                                                <input 
                                                    type="checkbox" 
                                                    checked={isSelected} 
                                                    disabled={!isEligible}
                                                    onChange={() => isEligible && handleToggleSelect(v.code, v.voucher_type)} 
                                                    className="w-5 h-5 text-[#C2410C] rounded border-[#E7E5E4] focus:ring-[#C2410C]" 
                                                />
                                            </div>
                                        </div>
                                    </label>
                                );
                            })}
                            {vouchers.length === 0 && (
                                <div className="text-center py-4 text-gray-500 text-sm">
                                    Không có voucher nào khả dụng
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="p-4 border-t border-[#E7E5E4] bg-[#FFFFFF] flex gap-3">
                    <button className="flex-1 bg-[#FFFFFF] border border-[#E7E5E4] text-text-ink py-2 rounded-lg font-body font-medium hover:bg-[#FFFBF5] transition-colors" onClick={onClose}>Huỷ</button>
                    <button className="flex-1 bg-[#C2410C] text-[#FFFFFF] border border-[#C2410C] py-2 rounded-lg font-body font-medium hover:bg-[#9A3412] transition-colors" onClick={handleConfirm}>Xác nhận</button>
                </div>
            </div>
        </div>
    );
};