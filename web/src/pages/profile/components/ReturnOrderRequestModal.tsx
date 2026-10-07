import React, { useState, useEffect, useRef } from "react";
import { type OrderTrackingDetail as OrderTrackingDetailModel } from "../../../features/order/tracking/model/orderDetail.model";
import { type OrderItemTracking } from "../../../features/order/tracking/model/orderItem.model";
import { walletService } from "../../../features/wallet/services/wallet.service";

export interface ReturnOrderFormData {
    type: 'EXCHANGE' | 'RETURN_REFUND';
    title: string;
    reason: string;
    proofImages: string[];
    proofVideos?: string[];
    bankName?: string;
    bankAccountNumber?: string;
    bankAccountHolder?: string;
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
    
    // Minh chứng hình ảnh (UC23)
    const [proofImageUrl, setProofImageUrl] = useState("");
    const [proofImages, setProofImages] = useState<string[]>([]);

    // Minh chứng video (UC23 - Mục 1.4)
    const [proofVideoUrl, setProofVideoUrl] = useState("");
    const [proofVideos, setProofVideos] = useState<string[]>([]);

    // Kiểm tra ví điện tử & thông tin tài khoản ngân hàng nếu chưa có ví (UC23 - Mục 1.2 & 1.11)
    const [hasWallet, setHasWallet] = useState<boolean | null>(null);
    const [checkingWallet, setCheckingWallet] = useState(false);
    const [bankName, setBankName] = useState("");
    const [bankAccountNumber, setBankAccountNumber] = useState("");
    const [bankAccountHolder, setBankAccountHolder] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const titleInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            setRequestType('RETURN_REFUND');
            setTitle("");
            setReason("");
            setProofImageUrl("");
            setProofImages([]);
            setProofVideoUrl("");
            setProofVideos([]);
            setBankName("");
            setBankAccountNumber("");
            setBankAccountHolder("");
            setIsSubmitting(false);

            // Kiểm tra khách đã kích hoạt ví điện tử chưa
            setCheckingWallet(true);
            walletService.checkWalletStatus()
                .then((res) => {
                    setHasWallet(res?.data?.exists === true);
                })
                .catch(() => {
                    setHasWallet(false);
                })
                .finally(() => {
                    setCheckingWallet(false);
                });

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

    const handleAddVideo = () => {
        const url = proofVideoUrl.trim();
        if (url && !proofVideos.includes(url)) {
            setProofVideos([...proofVideos, url]);
            setProofVideoUrl("");
        }
    };

    const handleRemoveVideo = (index: number) => {
        setProofVideos(proofVideos.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedTitle = title.trim();
        const trimmedReason = reason.trim();
        if (!trimmedTitle || !trimmedReason) return;

        // Nếu hoàn tiền và chưa có ví điện tử -> bắt buộc nhập STK
        if (requestType === 'RETURN_REFUND' && hasWallet === false) {
            if (!bankName.trim() || !bankAccountNumber.trim() || !bankAccountHolder.trim()) {
                return;
            }
        }

        setIsSubmitting(true);
        try {
            await onSubmit({
                type: requestType,
                title: trimmedTitle,
                reason: trimmedReason,
                proofImages,
                proofVideos,
                ...(requestType === 'RETURN_REFUND' && hasWallet === false ? {
                    bankName: bankName.trim(),
                    bankAccountNumber: bankAccountNumber.trim(),
                    bankAccountHolder: bankAccountHolder.trim(),
                } : {}),
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
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                                Yêu cầu hỗ trợ (UC23)
                            </span>
                        </div>
                        <h3 className="text-xl font-bold font-['Lora',serif] text-stone-900 dark:text-stone-100 mt-1">
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
                                            Shipper lấy hàng về và hoàn tiền 100%
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
                                            Tạo đơn hàng mới để giao món thay thế
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Phương thức nhận tiền hoàn (UC23 - Mục 1.2: Nếu chưa mở ví điện tử thì yêu cầu cung cấp STK) */}
                        {requestType === 'RETURN_REFUND' && (
                            <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 text-xs">
                                {checkingWallet ? (
                                    <div className="text-stone-500 dark:text-stone-400 flex items-center gap-2">
                                        <div className="w-3.5 h-3.5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                                        Đang kiểm tra thông tin Ví điện tử...
                                    </div>
                                ) : hasWallet === true ? (
                                    <div className="flex items-start gap-2 text-emerald-800 dark:text-emerald-300">
                                        <span className="material-symbols-outlined text-base mt-0.5">account_balance_wallet</span>
                                        <div>
                                            <p className="font-semibold">Hoàn tiền vào Ví điện tử</p>
                                            <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 mt-0.5">
                                                Tài khoản của bạn đã có Ví điện tử. Tiền hoàn sẽ được tự động cộng vào Ví ngay khi hàng được nhận về kho.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-2 text-amber-800 dark:text-amber-300">
                                            <span className="material-symbols-outlined text-base mt-0.5">info</span>
                                            <div>
                                                <p className="font-bold">Bạn chưa kích hoạt Ví điện tử</p>
                                                <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-0.5">
                                                    Theo quy định, vui lòng cung cấp thông tin tài khoản ngân hàng để nhân viên thực hiện chuyển khoản hoàn tiền cho bạn.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                            <div>
                                                <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                                                    Ngân hàng thụ hưởng <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    required={requestType === 'RETURN_REFUND' && hasWallet === false}
                                                    value={bankName}
                                                    onChange={(e) => setBankName(e.target.value)}
                                                    placeholder="VD: Vietcombank, MB Bank..."
                                                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-1 focus:ring-amber-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                                                    Số tài khoản <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    required={requestType === 'RETURN_REFUND' && hasWallet === false}
                                                    value={bankAccountNumber}
                                                    onChange={(e) => setBankAccountNumber(e.target.value)}
                                                    placeholder="Nhập số tài khoản"
                                                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-1 focus:ring-amber-500"
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                                                    Tên chủ tài khoản <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    required={requestType === 'RETURN_REFUND' && hasWallet === false}
                                                    value={bankAccountHolder}
                                                    onChange={(e) => setBankAccountHolder(e.target.value)}
                                                    placeholder="VD: NGUYEN VAN A (viết hoa không dấu)"
                                                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-1 focus:ring-amber-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

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

                        {/* Đính kèm hình ảnh minh chứng (UC23) */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                                Link hình ảnh minh chứng
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={proofImageUrl}
                                    onChange={(e) => setProofImageUrl(e.target.value)}
                                    placeholder="Dán link ảnh minh chứng..."
                                    className="flex-1 px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddImage}
                                    className="px-3 py-2 text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl transition-colors"
                                >
                                    Thêm ảnh
                                </button>
                            </div>

                            {proofImages.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {proofImages.map((img, i) => (
                                        <div key={i} className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-lg text-xs max-w-full truncate border border-stone-200 dark:border-stone-700">
                                            <span className="material-symbols-outlined text-sm text-stone-500">image</span>
                                            <span className="truncate max-w-[180px]">{img}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(i)}
                                                className="text-stone-400 hover:text-red-500 ml-1 font-bold"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Đính kèm video minh chứng (UC23 - Mục 1.4) */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                                Link video minh chứng (MP4 / WebM / Youtube)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={proofVideoUrl}
                                    onChange={(e) => setProofVideoUrl(e.target.value)}
                                    placeholder="Dán link video mở hộp/tình trạng sản phẩm..."
                                    className="flex-1 px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddVideo}
                                    className="px-3 py-2 text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl transition-colors"
                                >
                                    Thêm video
                                </button>
                            </div>

                            {proofVideos.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {proofVideos.map((vid, i) => (
                                        <div key={i} className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 px-2.5 py-1 rounded-lg text-xs max-w-full truncate text-blue-800 dark:text-blue-300">
                                            <span className="material-symbols-outlined text-sm text-blue-600 dark:text-blue-400">videocam</span>
                                            <span className="truncate max-w-[180px]">{vid}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveVideo(i)}
                                                className="text-stone-400 hover:text-red-500 ml-1 font-bold"
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
                        disabled={
                            isSubmitting || 
                            !title.trim() || 
                            !reason.trim() ||
                            (requestType === 'RETURN_REFUND' && hasWallet === false && (!bankName.trim() || !bankAccountNumber.trim() || !bankAccountHolder.trim()))
                        }
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
