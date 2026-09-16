import { useState } from 'react';
import type { CreateVoucherRequest } from '../../../features/voucher/models/voucher.model';
import { DistributionType, VoucherType } from '../../../features/voucher/models/voucher.model';

interface VoucherCreateModalProps {
    isOpen: boolean;
    saving: boolean;
    onClose: () => void;
    onSubmit: (data: CreateVoucherRequest) => void;
}

const INITIAL_FORM: CreateVoucherRequest = {
    title: '',
    code: '',
    distribution_type: DistributionType.PUBLIC,
    voucher_type: VoucherType.PERCENT,
    discount_value: 0,
    max_discount_amount: null,
    min_order_value: 0,
    total_limit: 100,
    limit_per_user: 1,
    start_date: '',
    end_date: '',
};

export const VoucherCreateModal = ({ isOpen, saving, onClose, onSubmit }: VoucherCreateModalProps) => {
    const [form, setForm] = useState<CreateVoucherRequest>(INITIAL_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});

    if (!isOpen) return null;

    const setField = <K extends keyof CreateVoucherRequest>(key: K, value: CreateVoucherRequest[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: '' }));
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!form.title.trim()) newErrors.title = 'Vui lòng nhập tên voucher';
        if (!form.code.trim()) newErrors.code = 'Vui lòng nhập mã voucher';
        if (/\s/.test(form.code) || /[^\w]/.test(form.code)) newErrors.code = 'Mã không dấu, viết liền, không ký tự đặc biệt';
        if (form.discount_value <= 0) newErrors.discount_value = 'Giá trị giảm phải lớn hơn 0';
        if (!form.start_date) newErrors.start_date = 'Vui lòng chọn ngày bắt đầu';
        if (!form.end_date) newErrors.end_date = 'Vui lòng chọn ngày kết thúc';
        if (form.start_date && form.end_date && form.start_date >= form.end_date) newErrors.end_date = 'Ngày kết thúc phải sau ngày bắt đầu';
        if (form.end_date && new Date(form.end_date) < new Date()) newErrors.end_date = 'Ngày kết thúc phải ở tương lai';
        if (form.total_limit <= 0) newErrors.total_limit = 'Tổng lượt phải lớn hơn 0';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const payload: CreateVoucherRequest = {
            ...form,
            code: form.code.toUpperCase(),
        };
        onSubmit(payload);
    };

    const handleClose = () => {
        setForm(INITIAL_FORM);
        setErrors({});
        onClose();
    };

    const isFreeship = form.voucher_type === VoucherType.FREESHIP_CASH || form.voucher_type === VoucherType.FREESHIP_PERCENT;
    const isPercent = form.voucher_type === VoucherType.PERCENT || form.voucher_type === VoucherType.FREESHIP_PERCENT;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
            <div className="relative bg-surface-card border border-border-subtle rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle sticky top-0 bg-surface-card z-10">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary-container text-2xl">confirmation_number</span>
                        <h2 className="font-headline text-xl font-semibold text-text-ink">Tạo voucher mới</h2>
                    </div>
                    <button
                        id="btn-close-create-voucher-modal"
                        onClick={handleClose}
                        className="p-2 rounded-lg text-text-muted hover:bg-surface-container hover:text-text-ink transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block font-body text-sm font-semibold text-text-ink mb-1.5">
                                Tên voucher <span className="text-error">*</span>
                            </label>
                            <input
                                id="input-voucher-title"
                                type="text"
                                value={form.title}
                                onChange={(e) => setField('title', e.target.value)}
                                placeholder="VD: Khuyến mãi giảm 10% tháng 6"
                                className="w-full px-3 py-2 border border-border-subtle rounded-lg font-body text-sm text-text-ink bg-background-page focus:outline-none focus:ring-2 focus:ring-primary-container/40 focus:border-primary-container transition-all"
                            />
                            {errors.title && <p className="text-error text-xs mt-1 font-body">{errors.title}</p>}
                        </div>

                        <div className="col-span-2">
                            <label className="block font-body text-sm font-semibold text-text-ink mb-1.5">
                                Mã voucher <span className="text-error">*</span>
                            </label>
                            <input
                                id="input-voucher-code"
                                type="text"
                                value={form.code}
                                onChange={(e) => setField('code', e.target.value.toUpperCase())}
                                placeholder="VD: KM10THANG6"
                                className="w-full px-3 py-2 border border-border-subtle rounded-lg font-mono text-sm text-text-ink bg-background-page focus:outline-none focus:ring-2 focus:ring-primary-container/40 focus:border-primary-container transition-all"
                            />
                            {errors.code && <p className="text-error text-xs mt-1 font-body">{errors.code}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-body text-sm font-semibold text-text-ink mb-1.5">
                                Loại voucher <span className="text-error">*</span>
                            </label>
                            <select
                                id="select-voucher-type"
                                value={form.voucher_type}
                                onChange={(e) => setField('voucher_type', e.target.value as typeof form.voucher_type)}
                                className="w-full px-3 py-2 border border-border-subtle rounded-lg font-body text-sm text-text-ink bg-background-page focus:outline-none focus:ring-2 focus:ring-primary-container/40 focus:border-primary-container transition-all"
                            >
                                <option value={VoucherType.PERCENT}>Giảm theo %</option>
                                <option value={VoucherType.CASH}>Giảm tiền mặt</option>
                                <option value={VoucherType.FREESHIP_CASH}>Freeship theo tiền</option>
                                <option value={VoucherType.FREESHIP_PERCENT}>Freeship theo %</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-body text-sm font-semibold text-text-ink mb-1.5">
                                Hình thức phát hành <span className="text-error">*</span>
                            </label>
                            <select
                                id="select-distribution-type"
                                value={form.distribution_type}
                                onChange={(e) => setField('distribution_type', e.target.value as typeof form.distribution_type)}
                                className="w-full px-3 py-2 border border-border-subtle rounded-lg font-body text-sm text-text-ink bg-background-page focus:outline-none focus:ring-2 focus:ring-primary-container/40 focus:border-primary-container transition-all"
                            >
                                <option value={DistributionType.PUBLIC}>Công khai</option>
                                <option value={DistributionType.LIMITED}>Giới hạn người dùng</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-body text-sm font-semibold text-text-ink mb-1.5">
                                {isFreeship ? 'Giảm phí ship' : 'Giá trị giảm'} {isPercent ? '(%)' : '(VNĐ)'} <span className="text-error">*</span>
                            </label>
                            <input
                                id="input-discount-value"
                                type="number"
                                min={0}
                                value={form.discount_value}
                                onChange={(e) => setField('discount_value', parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-border-subtle rounded-lg font-body text-sm text-text-ink bg-background-page focus:outline-none focus:ring-2 focus:ring-primary-container/40 focus:border-primary-container transition-all"
                            />
                            {errors.discount_value && <p className="text-error text-xs mt-1 font-body">{errors.discount_value}</p>}
                        </div>

                        {isPercent && (
                            <div>
                                <label className="block font-body text-sm font-semibold text-text-ink mb-1.5">
                                    {isFreeship ? 'Giảm tối đa (VNĐ)' : 'Giảm tối đa (VNĐ)'}
                                </label>
                                <input
                                    id="input-max-discount"
                                    type="number"
                                    min={0}
                                    value={form.max_discount_amount || ''}
                                    onChange={(e) => setField('max_discount_amount', e.target.value ? parseFloat(e.target.value) : null)}
                                    placeholder="Để trống nếu không giới hạn"
                                    className="w-full px-3 py-2 border border-border-subtle rounded-lg font-body text-sm text-text-ink bg-background-page focus:outline-none focus:ring-2 focus:ring-primary-container/40 focus:border-primary-container transition-all"
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-body text-sm font-semibold text-text-ink mb-1.5">Giá trị đơn tối thiểu (VNĐ)</label>
                            <input
                                id="input-min-order-value"
                                type="number"
                                min={0}
                                value={form.min_order_value}
                                onChange={(e) => setField('min_order_value', parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-border-subtle rounded-lg font-body text-sm text-text-ink bg-background-page focus:outline-none focus:ring-2 focus:ring-primary-container/40 focus:border-primary-container transition-all"
                            />
                        </div>

                        <div>
                            <label className="block font-body text-sm font-semibold text-text-ink mb-1.5">
                                Tổng lượt sử dụng <span className="text-error">*</span>
                            </label>
                            <input
                                id="input-total-limit"
                                type="number"
                                min={1}
                                value={form.total_limit}
                                onChange={(e) => setField('total_limit', parseInt(e.target.value) || 1)}
                                className="w-full px-3 py-2 border border-border-subtle rounded-lg font-body text-sm text-text-ink bg-background-page focus:outline-none focus:ring-2 focus:ring-primary-container/40 focus:border-primary-container transition-all"
                            />
                            {errors.total_limit && <p className="text-error text-xs mt-1 font-body">{errors.total_limit}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block font-body text-sm font-semibold text-text-ink mb-1.5">Giới hạn / user</label>
                            <input
                                id="input-limit-per-user"
                                type="number"
                                min={1}
                                value={form.limit_per_user}
                                onChange={(e) => setField('limit_per_user', parseInt(e.target.value) || 1)}
                                className="w-full px-3 py-2 border border-border-subtle rounded-lg font-body text-sm text-text-ink bg-background-page focus:outline-none focus:ring-2 focus:ring-primary-container/40 focus:border-primary-container transition-all"
                            />
                        </div>

                        <div>
                            <label className="block font-body text-sm font-semibold text-text-ink mb-1.5">
                                Ngày bắt đầu <span className="text-error">*</span>
                            </label>
                            <input
                                id="input-start-date"
                                type="datetime-local"
                                value={form.start_date}
                                onChange={(e) => setField('start_date', e.target.value)}
                                className="w-full px-3 py-2 border border-border-subtle rounded-lg font-body text-sm text-text-ink bg-background-page focus:outline-none focus:ring-2 focus:ring-primary-container/40 focus:border-primary-container transition-all"
                            />
                            {errors.start_date && <p className="text-error text-xs mt-1 font-body">{errors.start_date}</p>}
                        </div>

                        <div>
                            <label className="block font-body text-sm font-semibold text-text-ink mb-1.5">
                                Ngày kết thúc <span className="text-error">*</span>
                            </label>
                            <input
                                id="input-end-date"
                                type="datetime-local"
                                value={form.end_date}
                                onChange={(e) => setField('end_date', e.target.value)}
                                className="w-full px-3 py-2 border border-border-subtle rounded-lg font-body text-sm text-text-ink bg-background-page focus:outline-none focus:ring-2 focus:ring-primary-container/40 focus:border-primary-container transition-all"
                            />
                            {errors.end_date && <p className="text-error text-xs mt-1 font-body">{errors.end_date}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-border-subtle">
                        <button
                            id="btn-cancel-create-voucher"
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 rounded-lg border border-border-subtle font-body text-sm font-semibold text-text-muted hover:bg-surface-container hover:text-text-ink transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            id="btn-submit-create-voucher"
                            type="submit"
                            disabled={saving}
                            className="btn-primary px-5 py-2 text-sm font-semibold font-body flex items-center gap-2 disabled:opacity-60 hover:-translate-y-[1px] transition-all"
                        >
                            {saving ? (
                                <>
                                    <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                                    Đang tạo...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[16px]">add</span>
                                    Tạo voucher
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
