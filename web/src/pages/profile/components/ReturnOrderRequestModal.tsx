import React, { useState, useEffect, useRef } from "react";
import { type OrderTrackingDetail as OrderTrackingDetailModel } from "../../../features/order/tracking/model/orderDetail.model";
import { type OrderItemTracking } from "../../../features/order/tracking/model/orderItem.model";

export interface ReturnOrderFormData {
    type: 'EXCHANGE' | 'RETURN_REFUND';
    title: string;
    reason: string;
    proofImages: string[];
}

interface ReturnOrderRequestModalProps {
    open: boolean;
    order: OrderTrackingDetailModel | OrderItemTracking;
    onClose: () => void;
    onSubmit: (data: ReturnOrderFormData | string) => Promise<void>;
}

export const ReturnOrderRequestModal: React.FC<ReturnOrderRequestModalProps> = ({ open, order, onClose, onSubmit }) => {
    const [requestType, setRequestType] = useState<'EXCHANGE' | 'RETURN_REFUND'>('RETURN_REFUND');
    const [title, setTitle] = useState("");
    const [reason, setReason] = useState("");
    const [proofImageUrl, setProofImageUrl] = useState("");
    const [proofImages, setProofImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const titleInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            setRequestType('RETURN_REFUND');
            setTitle("");
            setReason("");
            setProofImageUrl("");
            setProofImages([]);
            setIsSubmitting(false);
            setTimeout(() => {
                titleInputRef.current?.focus();
            }, 50);
        }
    }, [open]);

    // Esc to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && open && !isSubmitting) onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, isSubmitting, onClose]);

    if (!open) return null;

    const handleAddImage = () => {
        const url = proofImageUrl.trim();
        if (url && !proofImages.includes(url)) {
            setProofImages([...proofImages, url]);
            setProofImageUrl("");
        }
    };

    const handleRemoveImage = (index: number) => {
        setProofImages(proofImages.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedTitle = title.trim();
        const trimmedReason = reason.trim();
        if (!trimmedTitle || !trimmedReason) return;

        setIsSubmitting(true);
        try {
            await onSubmit({
                type: requestType,
                title: trimmedTitle,
                reason: trimmedReason,
                proofImages,
            });
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={() => !isSubmitting && onClose()} />

            {/* Modal */}
            <div className="relative bg-white dark:bg-stone-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border border-stone-200 dark:border-stone-800">
                {/* Header */}
                <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center bg-stone-50 dark:bg-stone-800/60 shrink-0">
                    <div>
                        <h3 className="text-xl font-bold font-['Lora',serif] text-stone-900 dark:text-stone-100">
                            Yêu cầu xử lý đổi trả / Hoàn tiền
                        </h3>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                            Đơn hàng #{order.id} • Trong thời hạn 7 ngày bảo hành
                        </p>
                    </div>
                    <button 
                        onClick={onClose} 
                        disabled={isSubmitting}
                        className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    <form id="return-order-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Mục đích yêu cầu (UC23: Đổi lấy món hàng mới hoặc Trả hàng hoàn tiền) */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
                                Mục đích xử lý <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                                    requestType === 'RETURN_REFUND'
                                        ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 shadow-xs'
                                        : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800'
                                }`}>
                                    <input
                                        type="radio"
                                        name="returnType"
                                        checked={requestType === 'RETURN_REFUND'}
                                        onChange={() => setRequestType('RETURN_REFUND')}
                                        className="mt-0.5 text-amber-600"
                                    />
                                    <div>
                                        <p className="text-xs font-bold">Trả hàng hoàn tiền</p>
                                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 leading-snug">
                                            Shipper lấy hàng về và hoàn tiền 100% vào Ví điện tử
                                        </p>
                                    </div>
                                </label>

                                <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                                    requestType === 'EXCHANGE'
                                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-200 shadow-xs'
                                        : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800'
                                }`}>
                                    <input
                                        type="radio"
                                        name="returnType"
                                        checked={requestType === 'EXCHANGE'}
                                        onChange={() => setRequestType('EXCHANGE')}
                                        className="mt-0.5 text-blue-600"
                                    />
                                    <div>
                                        <p className="text-xs font-bold">Đổi lấy món hàng mới</p>
                                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 leading-snug">
                                            Tạo đơn hàng mới để giao món hàng thay thế
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Tiêu đề yêu cầu */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                                Tiêu đề yêu cầu <span className="text-red-500">*</span>
                            </label>
                            <input
                                ref={titleInputRef}
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ví dụ: Sản phẩm bị nứt vỡ trong quá trình vận chuyển"
                                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>

                        {/* Lý do chi tiết */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                                Nội dung / Lý do chi tiết <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                required
                                rows={3}
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Vui lòng mô tả chi tiết tình trạng sản phẩm và mong muốn của bạn..."
                                className="w-full p-3 border border-stone-300 dark:border-stone-700 rounded-xl bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>

                        {/* Đính kèm hình ảnh / video minh chứng (UC23) */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                                Link hình ảnh / video minh chứng
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={proofImageUrl}
                                    onChange={(e) => setProofImageUrl(e.target.value)}
                                    placeholder="Dán link ảnh hoặc video minh chứng..."
                                    className="flex-1 px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddImage}
                                    className="px-3 py-2 text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl transition-colors"
                                >
                                    Thêm
                                </button>
                            </div>

                            {proofImages.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {proofImages.map((img, i) => (
                                        <div key={i} className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-lg text-xs max-w-full truncate">
                                            <span className="material-symbols-outlined text-sm text-stone-500">image</span>
                                            <span className="truncate max-w-[180px]">{img}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(i)}
                                                className="text-stone-400 hover:text-red-500"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 flex items-center justify-end gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 font-medium text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors disabled:opacity-60"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        form="return-order-form"
                        disabled={isSubmitting || !title.trim() || !reason.trim()}
                        className="px-6 py-2 font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm"
                    >
                        {isSubmitting && (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        Gửi yêu cầu xử lý
                    </button>
                </div>
            </div>
        </div>
    );
};
