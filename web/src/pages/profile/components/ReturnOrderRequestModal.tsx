import React, { useState, useEffect, useRef } from "react";
import { type OrderTrackingDetail as OrderTrackingDetailModel } from "../../../features/order/tracking/model/orderDetail.model";
import { type OrderItemTracking } from "../../../features/order/tracking/model/orderItem.model";

interface ReturnOrderRequestModalProps {
    open: boolean;
    order: OrderTrackingDetailModel | OrderItemTracking;
    onClose: () => void;
    onSubmit: (note: string) => Promise<void>;
}

export const ReturnOrderRequestModal: React.FC<ReturnOrderRequestModalProps> = ({ open, order, onClose, onSubmit }) => {
    const [note, setNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (open) {
            setNote("");
            setIsSubmitting(false);
            // Small delay to ensure modal is rendered before focusing
            setTimeout(() => {
                textareaRef.current?.focus();
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedNote = note.trim();
        if (!trimmedNote) return;

        setIsSubmitting(true);
        try {
            await onSubmit(trimmedNote);
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={() => !isSubmitting && onClose()} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-border-subtle flex justify-between items-center bg-stone-50 shrink-0">
                    <div>
                        <h3 className="text-xl font-bold font-['Lora',serif] text-stone-900">Yêu cầu trả hàng</h3>
                        <p className="text-sm text-stone-500 mt-1">Yêu cầu trả hàng cho đơn hàng {order.id}</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        disabled={isSubmitting}
                        className="p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    <form id="return-order-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {/* Products */}
                        <div>
                            <h4 className="font-semibold text-stone-800 mb-3 text-sm">Danh sách sản phẩm</h4>
                            <div className="flex flex-col gap-3">
                                {'items' in order ? (
                                    order.items.map((item) => (
                                        <div key={item.productId} className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-border-subtle">
                                            <div className="w-12 h-12 rounded border border-stone-100 overflow-hidden shrink-0 bg-white">
                                                <img src={item.productImageUrl} alt={item.productName} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-stone-800 truncate">{item.productName}</p>
                                                <p className="text-xs text-stone-500 mt-0.5">Số lượng: x{item.quantity}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-border-subtle">
                                        <div className="w-12 h-12 rounded border border-stone-100 overflow-hidden shrink-0 bg-white">
                                            <img src={order.firstProductImageUrl} alt={order.firstProductName} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-stone-800 truncate">{order.firstProductName}</p>
                                            {order.totalProductQuantity > 1 && (
                                                <p className="text-xs text-stone-500 mt-0.5">Và {order.totalProductQuantity - 1} sản phẩm khác</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Reason */}
                        <div>
                            <label htmlFor="return-note" className="block font-semibold text-stone-800 mb-2 text-sm">
                                Lý do trả hàng <span className="text-market-error">*</span>
                            </label>
                            <textarea
                                id="return-note"
                                ref={textareaRef}
                                required
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                disabled={isSubmitting}
                                placeholder="Vui lòng mô tả lý do bạn muốn trả hàng..."
                                className="w-full min-h-30 p-3 border-2 border-border-medium rounded-xl focus:border-market-primary focus:ring-4 focus:ring-market-primary/20 outline-none transition-all resize-y text-sm bg-stone-50 focus:bg-white disabled:opacity-60"
                            />
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border-subtle bg-stone-50 flex items-center justify-end gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 font-medium text-stone-600 bg-white border border-border-medium rounded-xl hover:bg-stone-50 transition-colors disabled:opacity-60 min-w-25"
                    >
                        Đóng
                    </button>
                    <button
                        type="submit"
                        form="return-order-form"
                        disabled={isSubmitting || !note.trim()}
                        className="px-6 py-2 font-medium text-white bg-market-warning hover:bg-amber-600 rounded-xl transition-colors disabled:opacity-60 min-w-45 flex items-center justify-center gap-2 shadow-sm"
                    >
                        {isSubmitting && (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        Gửi yêu cầu trả hàng
                    </button>
                </div>
            </div>
        </div>
    );
};
