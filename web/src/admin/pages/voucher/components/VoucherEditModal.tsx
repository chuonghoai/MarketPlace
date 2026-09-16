import { useState, useEffect } from 'react';
import type { UpdateVoucherRequest, Voucher } from '../../../features/voucher/models/voucher.model';
import { VoucherType, VoucherStatus } from '../../../features/voucher/models/voucher.model';

interface VoucherEditModalProps {
    isOpen: boolean;
    saving: boolean;
    voucher: Voucher | null;
    onClose: () => void;
    onSubmit: (id: number, data: UpdateVoucherRequest) => void;
}

const toLocalDatetime = (isoStr: string): string => {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
    [VoucherStatus.ACTIVE]: { label: 'Đang hoạt động', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: 'check_circle' },
    [VoucherStatus.DISABLED]: { label: 'Vô hiệu hóa', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: 'block' },
    [VoucherStatus.EXPIRED]: { label: 'Đã hết hạn', color: 'text-slate-500 bg-slate-50 border-slate-200', icon: 'schedule' },
};

export const VoucherEditModal = ({ isOpen, saving, voucher, onClose, onSubmit }: VoucherEditModalProps) => {
    const [form, setForm] = useState<UpdateVoucherRequest>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (voucher && isOpen) {
            setForm({
                title: voucher.title,
                total_limit: voucher.total_limit,
                end_date: toLocalDatetime(voucher.end_date),
                discount_value: voucher.discount_value,
                max_discount_amount: voucher.max_discount_amount,
                start_date: toLocalDatetime(voucher.start_date),
                limit_per_user: voucher.limit_per_user,
                status: voucher.status,
            });
            setErrors({});
        }
    }, [voucher, isOpen]);

    if (!isOpen || !voucher) return null;

    const isGroup1 = new Date(voucher.start_date) <= new Date();
    const isGroup2 = !isGroup1;
    const isExpired = voucher.status === VoucherStatus.EXPIRED;

    const setField = <K extends keyof UpdateVoucherRequest>(key: K, value: UpdateVoucherRequest[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: '' }));
    };

    const handleToggleStatus = () => {
        if (isExpired) return;
        const next = form.status === VoucherStatus.ACTIVE ? VoucherStatus.DISABLED : VoucherStatus.ACTIVE;
        setField('status', next);
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (isGroup1) {
            if (!form.title?.trim()) newErrors.title = 'Vui lòng nhập tên voucher';
            if (form.total_limit === undefined || form.total_limit < voucher.used_count) {
                newErrors.total_limit = `Không được nhỏ hơn số lượt đã dùng (${voucher.used_count})`;
            }
            if (!form.end_date) newErrors.end_date = 'Vui lòng chọn ngày kết thúc';
            if (form.end_date && new Date(form.end_date) <= new Date(voucher.start_date)) {
                newErrors.end_date = 'Ngày kết thúc phải sau ngày bắt đầu';
            }
            if (form.end_date && new Date(form.end_date) < new Date()) {
                newErrors.end_date = 'Ngày kết thúc phải ở tương lai';
            }
        }

        if (isGroup2) {
            if (!form.discount_value || form.discount_value <= 0) {
                newErrors.discount_value = 'Giá trị giảm phải lớn hơn 0';
            }
            if (!form.start_date) newErrors.start_date = 'Vui lòng chọn ngày bắt đầu';
            if (form.start_date && form.end_date && new Date(form.start_date) >= new Date(form.end_date)) {
                newErrors.start_date = 'Ngày bắt đầu phải trước ngày kết thúc';
            }
            if (form.end_date && new Date(form.end_date) < new Date()) {
                newErrors.end_date = 'Ngày kết thúc phải ở tương lai';
            }
            if (!form.limit_per_user || form.limit_per_user <= 0) {
                newErrors.limit_per_user = 'Giới hạn/user phải lớn hơn 0';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const payload: UpdateVoucherRequest = {};

        if (isGroup1) {
            payload.title = form.title;
            payload.total_limit = Number(form.total_limit);
            payload.end_date = form.end_date ? new Date(form.end_date).toISOString() : undefined;
        }
        if (isGroup2) {
            payload.discount_value = Number(form.discount_value);
            payload.max_discount_amount = form.max_discount_amount ? Number(form.max_discount_amount) : null;
            payload.start_date = form.start_date ? new Date(form.start_date).toISOString() : undefined;
            payload.limit_per_user = Number(form.limit_per_user);
        }

        if (form.status !== voucher.status) {
            payload.status = form.status;
        }

        onSubmit(voucher.id, payload);
    };

    const isFreeship = voucher.voucher_type === VoucherType.FREESHIP_CASH || voucher.voucher_type === VoucherType.FREESHIP_PERCENT;
    const isPercent = voucher.voucher_type === VoucherType.PERCENT || voucher.voucher_type === VoucherType.FREESHIP_PERCENT;
    const currentStatus = form.status ?? voucher.status;
    const statusCfg = STATUS_CONFIG[currentStatus];
    const isActive = currentStatus === VoucherStatus.ACTIVE;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-surface-card border border-border-subtle rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle sticky top-0 bg-surface-card z-10">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-blue-600 text-2xl">edit</span>
                        <div>
                            <h2 className="font-headline text-xl font-semibold text-text-ink">Sửa voucher</h2>
                            <p className="font-mono text-xs text-text-muted">{voucher.code}</p>
                        </div>
                    </div>
                    <button
                        id="btn-close-edit-voucher-modal"
                        onClick={onClose}
                        className="p-2 rounded-lg text-text-muted hover:bg-surface-container hover:text-text-ink transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="px-6 pt-4 space-y-3">
                    {isGroup1 ? (
                        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-sm font-body flex items-start gap-2">
                            <span className="material-symbols-outlined text-[18px] mt-0.5">info</span>
                            <span><strong>Voucher đã bắt đầu</strong> — Chỉ được sửa: Tên, Tổng lượt (chỉ tăng) và Ngày kết thúc.</span>
                        </div>
                    ) : (
                        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-sm font-body flex items-start gap-2">
                            <span className="material-symbols-outlined text-[18px] mt-0.5">schedule</span>
                            <span><strong>Voucher chưa bắt đầu</strong> — Được sửa: Giá trị giảm, Giảm tối đa, Ngày bắt đầu và Giới hạn/user.</span>
                        </div>
                    )}

                    <div className={`flex items-center justify-between p-3 rounded-xl border ${statusCfg.color}`}>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">{statusCfg.icon}</span>
                            <div>
                                <p className="font-body text-sm font-semibold">Trạng thái: {statusCfg.label}</p>
                                {isExpired && <p className="font-body text-xs opacity-75">Voucher đã hết hạn, không thể thay đổi trạng thái.</p>}
                                {!isExpired && isGroup2 && currentStatus === VoucherStatus.DISABLED && (
                                    <p className="font-body text-xs opacity-75">Kích hoạt sớm sẽ cập nhật ngày bắt đầu về hôm nay.</p>
                                )}
                            </div>
                        </div>
                        {!isExpired && (
                            <button
                                id="btn-toggle-voucher-status"
                                type="button"
                                onClick={handleToggleStatus}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`}
                                />
                            </button>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
                    <div>
                        <label className="block font-body text-sm font-semibold text-text-ink mb-1.5">
                            Tên voucher <span className="text-error">*</span>
                        </label>
                        <input
                            id="edit-input-voucher-title"
                            type="text"
                            value={form.title || ''}
                            onChange={(e) => setField('title', e.target.value)}
                            disabled={!isGroup1}
                            className="w-full px-3 py-2 border border-border-subtle rounded-lg font-body text-sm text-text-ink bg-background-page focus:outline-none focus:ring-2 focus:ring-primary-container/40 disabled:opacity-50 disabled:bg-surface-container transition-all"
                        />
                        {errors.title && <p className="text-error text-xs mt-1 font-body">{errors.title}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-body text-sm font-semibold text-text-ink mb-1.5">
                                {isFreeship ? 'Giảm phí ship' : 'Giá trị giảm'} {isPercent ? '(%)' : '(VNĐ)'} <span className="text-error">*</span>
                            </label>
                            <input
                                id="edit-input-discount-value"
                                type="number"
                                min={0}
                                value={form.discount_value ?? 0}
                                onChange={(e) => setField('discount_value', parseFloat(e.target.value) || 0)}
                                disabled={!isGroup2}
                                className="w-full px-3 py-2 border border-border-subtle rounded-lg font-body text-sm text-text-ink bg-background-page focus:outline-none focus:ring-2 focus:ring-primary-container/40 disabled:opacity-50 disabled:bg-surface-container transition-all"
                            />
                            {errors.discount_value && <p className="text-error text-xs mt-1 font-body">{errors.discount_value}</p>}
                        </div>

                        {isPercent && (
                            <div>
                                <label className="block font-body text-sm font-semibold text-text-ink mb-1.5">
                                    Giảm tối đa (VNĐ)
                                </label>
                                <input
                                    id="edit-input-max-discount"
                                    type="number"
                                    min={0}
                                    value={form.max_discount_amount ?? ''}
                                    onChange={(e) => setField('max_discount_amount', e.target.value ? parseFloat(e.target.value) : null)}
                                    disabled={!isGroup2}
                                    placeholder="Để trống nếu không giới hạn"
                                    className="w-full px-3 py-2 border border-border-subtle rounded-lg font-body text-sm text-text-ink bg-background-page focus:outline-none focus:ring-2 focus:ring-primary-container/40 disabled:opacity-50 disabled:bg-surface-container transition-all"
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-body text-sm font-semibold text-text-ink mb-1.5">
                                Tổng lượt sử dụng <span className="text-error">*</span>
                            </label>
                            <input
                                id="edit-input-total-limit"
                                type="number"
                                min={voucher.used_count}
                                value={form.total_limit ?? 0}
                                onChange={(e) => setField('total_limit', parseInt(e.target.value) || 1)}
                                disabled={!isGroup1}
                                className="w-full px-3 py-2 border border-border-subtle rounded-lg font-body text-sm text-text-ink bg-background-page focus:outline-none focus:ring-2 focus:ring-primary-container/40 disabled:opacity-50 disabled:bg-surface-container transition-all"
                            />
                            {errors.total_limit && <p className="text-error text-xs mt-1 font-body">{errors.total_limit}</p>}
                            {isGroup1 && <p className="text-text-muted text-xs mt-1">Đã dùng: <strong>{voucher.used_count}</strong> lượt</p>}
                        </div>

                        <div>
                            <label className="block font-body text-sm font-semibold text-text-ink mb-1.5">Giới hạn / user</label>
                            <input
                                id="edit-input-limit-per-user"
                                type="number"
                                min={1}
                                value={form.limit_per_user ?? 1}
                                onChange={(e) => setField('limit_per_user', parseInt(e.target.value) || 1)}
                                disabled={!isGroup2}
                                className="w-full px-3 py-2 border border-border-subtle rounded-lg font-body text-sm text-text-ink bg-background-page focus:outline-none focus:ring-2 focus:ring-primary-container/40 disabled:opacity-50 disabled:bg-surface-container transition-all"
                            />
                            {errors.limit_per_user && <p className="text-error text-xs mt-1 font-body">{errors.limit_per_user}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-body text-sm font-semibold text-text-ink mb-1.5">
                                Ngày bắt đầu <span className="text-error">*</span>
                            </label>
                            <input
                                id="edit-input-start-date"
                                type="datetime-local"
                                value={form.start_date || ''}
                                onChange={(e) => setField('start_date', e.target.value)}
                                disabled={!isGroup2}
                                className="w-full px-3 py-2 border border-border-subtle rounded-lg font-body text-sm text-text-ink bg-background-page focus:outline-none focus:ring-2 focus:ring-primary-container/40 disabled:opacity-50 disabled:bg-surface-container transition-all"
                            />
                            {errors.start_date && <p className="text-error text-xs mt-1 font-body">{errors.start_date}</p>}
                        </div>

                        <div>
                            <label className="block font-body text-sm font-semibold text-text-ink mb-1.5">
                                Ngày kết thúc <span className="text-error">*</span>
                            </label>
                            <input
                                id="edit-input-end-date"
                                type="datetime-local"
                                value={form.end_date || ''}
                                onChange={(e) => setField('end_date', e.target.value)}
                                disabled={!isGroup1}
                                className="w-full px-3 py-2 border border-border-subtle rounded-lg font-body text-sm text-text-ink bg-background-page focus:outline-none focus:ring-2 focus:ring-primary-container/40 disabled:opacity-50 disabled:bg-surface-container transition-all"
                            />
                            {errors.end_date && <p className="text-error text-xs mt-1 font-body">{errors.end_date}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-border-subtle">
                        <button
                            id="btn-cancel-edit-voucher"
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border border-border-subtle font-body text-sm font-semibold text-text-muted hover:bg-surface-container hover:text-text-ink transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            id="btn-submit-edit-voucher"
                            type="submit"
                            disabled={saving}
                            className="btn-primary px-5 py-2 text-sm font-semibold font-body flex items-center gap-2 disabled:opacity-60 hover:-translate-y-[1px] transition-all"
                        >
                            {saving ? (
                                <>
                                    <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[16px]">save</span>
                                    Lưu thay đổi
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
