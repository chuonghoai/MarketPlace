import React, { useState } from 'react';
import type { OrderReturnRequestDetail } from '../../../features/order/model/orderDetail.model';
import { MediaLightboxModal } from './MediaLightboxModal';

interface OrderReturnRequestCardProps {
    returnRequest: OrderReturnRequestDetail;
    onOpenProcessModal?: () => void;
    canProcess?: boolean;
}

export const OrderReturnRequestCard: React.FC<OrderReturnRequestCardProps> = ({
    returnRequest,
    onOpenProcessModal,
    canProcess = false,
}) => {
    const [selectedMedia, setSelectedMedia] = useState<{
        url: string;
        type: 'image' | 'video';
        title?: string;
    } | null>(null);

    const isExchange = returnRequest.type === 'EXCHANGE';

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return {
                    label: 'Chờ xử lý',
                    className: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
                };
            case 'PICKING_UP':
                return {
                    label: 'Đang lấy hàng',
                    className: 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800',
                };
            case 'RECEIVED':
                return {
                    label: 'Đã nhận tại kho',
                    className: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800',
                };
            case 'COMPLETED':
                return {
                    label: 'Đã hoàn tất',
                    className: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
                };
            case 'REJECTED':
                return {
                    label: 'Đã từ chối',
                    className: 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800',
                };
            default:
                return {
                    label: status,
                    className: 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-300 border-stone-300 dark:border-stone-700',
                };
        }
    };

    const statusBadge = getStatusBadge(returnRequest.status);

    return (
        <div className="bg-white dark:bg-stone-900 border border-amber-200 dark:border-amber-900/60 rounded-xl shadow-sm overflow-hidden transition-colors">
            {/* Header */}
            <div className="px-5 py-3.5 bg-amber-50/80 dark:bg-amber-950/30 border-b border-amber-200/80 dark:border-amber-900/50 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-xl">
                        {isExchange ? 'swap_horiz' : 'assignment_return'}
                    </span>
                    <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wide">
                        Yêu cầu đổi trả từ khách hàng
                    </h2>
                </div>

                <div className="flex items-center gap-2">
                    <span
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg border flex items-center gap-1 ${
                            isExchange
                                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                        }`}
                    >
                        <span className="material-symbols-outlined text-xs">
                            {isExchange ? 'cached' : 'payments'}
                        </span>
                        {isExchange ? 'Đổi sản phẩm mới' : 'Trả hàng & Hoàn tiền'}
                    </span>

                    <span
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${statusBadge.className}`}
                    >
                        {statusBadge.label}
                    </span>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-5 space-y-4">
                {/* Title & Reason */}
                <div className="space-y-1.5">
                    <div className="text-xs font-semibold uppercase text-stone-500 dark:text-stone-400">
                        Tiêu đề khiếu nại
                    </div>
                    <p className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        {returnRequest.title || 'Không có tiêu đề'}
                    </p>
                </div>

                <div className="space-y-1.5">
                    <div className="text-xs font-semibold uppercase text-stone-500 dark:text-stone-400">
                        Lý do / Nội dung chi tiết
                    </div>
                    <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 text-sm text-stone-800 dark:text-stone-200 leading-relaxed whitespace-pre-line">
                        {returnRequest.reason || 'Khách hàng không nhập lý do chi tiết'}
                    </div>
                </div>

                {/* Proof Images Gallery */}
                {returnRequest.proofImages && returnRequest.proofImages.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-amber-600 text-sm">photo_library</span>
                                Hình ảnh minh chứng ({returnRequest.proofImages.length})
                            </span>
                            <span className="text-[11px] text-stone-400 dark:text-stone-500">
                                Click vào ảnh để phóng to
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {returnRequest.proofImages.map((imgUrl, index) => (
                                <div
                                    key={index}
                                    onClick={() =>
                                        setSelectedMedia({
                                            url: imgUrl,
                                            type: 'image',
                                            title: `Ảnh minh chứng #${index + 1}`,
                                        })
                                    }
                                    className="group relative aspect-square rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 cursor-pointer shadow-sm hover:shadow-md hover:border-amber-500 transition-all"
                                >
                                    <img
                                        src={imgUrl}
                                        alt={`Minh chứng ${index + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                        onError={(e) => {
                                            (e.target as HTMLElement).setAttribute(
                                                'src',
                                                'https://via.placeholder.com/150?text=Loi+Anh'
                                            );
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                        <span className="material-symbols-outlined text-xl">zoom_in</span>
                                    </div>
                                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-white font-mono">
                                        #{index + 1}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Proof Videos Section */}
                {returnRequest.proofVideos && returnRequest.proofVideos.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-blue-600 text-sm">videocam</span>
                                Video minh chứng ({returnRequest.proofVideos.length})
                            </span>
                            <span className="text-[11px] text-stone-400 dark:text-stone-500">
                                Click để phát video
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {returnRequest.proofVideos.map((videoUrl, index) => (
                                <div
                                    key={index}
                                    onClick={() =>
                                        setSelectedMedia({
                                            url: videoUrl,
                                            type: 'video',
                                            title: `Video minh chứng #${index + 1}`,
                                        })
                                    }
                                    className="group relative flex items-center gap-3 p-3 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer transition-all shadow-sm"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow group-hover:scale-105 transition-transform">
                                        <span className="material-symbols-outlined text-xl">play_arrow</span>
                                    </div>
                                    <div className="overflow-hidden flex-1">
                                        <div className="text-xs font-bold text-blue-900 dark:text-blue-200">
                                            Video minh chứng #{index + 1}
                                        </div>
                                        <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate mt-0.5">
                                            {videoUrl}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Bank Information (If customer requested refund to Bank Account) */}
                {returnRequest.bankAccountNumber && (
                    <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
                        <div className="font-bold flex items-center gap-1.5 text-amber-900 dark:text-amber-300">
                            <span className="material-symbols-outlined text-sm">account_balance</span>
                            Thông tin nhận tiền hoàn qua Ngân hàng:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-medium">
                            <div>
                                <span className="text-stone-500 dark:text-stone-400 block text-[11px]">Ngân hàng:</span>
                                <span className="font-bold text-stone-800 dark:text-stone-200">
                                    {returnRequest.bankName || 'Chưa cung cấp'}
                                </span>
                            </div>
                            <div>
                                <span className="text-stone-500 dark:text-stone-400 block text-[11px]">Số tài khoản:</span>
                                <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                                    {returnRequest.bankAccountNumber}
                                </span>
                            </div>
                            <div>
                                <span className="text-stone-500 dark:text-stone-400 block text-[11px]">Chủ tài khoản:</span>
                                <span className="font-bold text-stone-800 dark:text-stone-200 uppercase">
                                    {returnRequest.bankAccountHolder || 'Chưa cung cấp'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Rejection Notice (if request was rejected) */}
                {returnRequest.status === 'REJECTED' && (
                    <div className="p-3.5 bg-red-50/80 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 rounded-xl text-xs text-red-900 dark:text-red-200 space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-red-700 dark:text-red-300">
                            <span className="material-symbols-outlined text-base">cancel</span>
                            Yêu cầu đổi trả đã bị từ chối
                        </div>
                        {returnRequest.adminNote && (
                            <p className="text-stone-700 dark:text-stone-300">
                                <strong>Lý do từ chối:</strong> {returnRequest.adminNote}
                            </p>
                        )}
                    </div>
                )}

                {/* Process Action Trigger */}
                {canProcess && onOpenProcessModal && (
                    <div className="pt-2 flex justify-end">
                        <button
                            type="button"
                            onClick={onOpenProcessModal}
                            className="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                        >
                            <span className="material-symbols-outlined text-sm">handshake</span>
                            Mở quy trình xử lý hoàn trả
                        </button>
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {selectedMedia && (
                <MediaLightboxModal
                    isOpen={!!selectedMedia}
                    onClose={() => setSelectedMedia(null)}
                    mediaUrl={selectedMedia.url}
                    mediaType={selectedMedia.type}
                    title={selectedMedia.title}
                />
            )}
        </div>
    );
};
