import React from "react";
import { Link } from "react-router-dom";
import type { OrderTrackingDetail } from "../../../../features/order/tracking/model/orderDetail.model";
import { EOrderStatus } from "../../../../features/order/enums/orderStatus.enum";

interface ShippingInfoCardProps {
    order: OrderTrackingDetail;
    onCancelClick: () => void;
    onReturnClick: () => void;
}

export const ShippingInfoCard: React.FC<ShippingInfoCardProps> = ({ order, onCancelClick, onReturnClick }) => {
    const canCancel = order.orderStatus === EOrderStatus.PENDING;

    const hasReturnHistory =
        order.orderStatus === EOrderStatus.RETURNED ||
        (order.statusHistory || []).some(
            h =>
                h.status === EOrderStatus.RETURNED ||
                (h.note &&
                    (h.note.includes("yêu cầu Trả hàng") ||
                        h.note.includes("yêu cầu Đổi món") ||
                        h.note.includes("yêu cầu đổi trả")))
        );

    const isReturnRejected =
        order.returnStatus === 'REJECTED' ||
        (order.statusHistory || []).some(
            (h) => h.note && (h.note.includes('Từ chối') || h.note.includes('từ chối'))
        );

    const isReturnFinished =
        !isReturnRejected &&
        (order.returnStatus === 'COMPLETED' ||
            (order.statusHistory || []).some(
                (h) =>
                    h.note &&
                    (h.note.includes('Hoàn tiền') ||
                        h.note.includes('đổi hàng mới') ||
                        h.note.includes('Đã hoàn tất'))
            ));

    const rejectionReason =
        order.returnRequest?.adminNote ||
        order.returnAdminNote ||
        (() => {
            const h = (order.statusHistory || []).find(
                (item) => item.note && (item.note.includes('Từ chối') || item.note.includes('từ chối'))
            );
            if (h && h.note) {
                const parts = h.note.split(':');
                return parts.length > 1 ? parts.slice(1).join(':').trim() : h.note;
            }
            return undefined;
        })();

    const replacementOrderId =
        order.newOrderId ||
        (() => {
            const h = (order.statusHistory || []).find(
                item => item.note && (item.note.includes('Đơn hàng mới: #') || item.note.includes('đổi hàng mới'))
            );
            if (h && h.note) {
                const m = h.note.match(/#([a-zA-Z0-9-]+)/);
                return m ? m[1] : undefined;
            }
            return undefined;
        })();

    // Ràng buộc UC23: trong vòng 7 ngày kể từ khi đơn kết thúc và chưa có yêu cầu đổi trả
    const isWithin7Days = (() => {
        if (order.orderStatus !== EOrderStatus.SUCCESS || hasReturnHistory) return false;
        const successHistory = order.statusHistory?.slice().reverse().find(h => h.status === EOrderStatus.SUCCESS);
        const deliveredDate = successHistory ? new Date(successHistory.timestamp) : new Date(order.createdAt);
        const diffDays = (Date.now() - deliveredDate.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays <= 7;
    })();

    const canReturn = isWithin7Days && !hasReturnHistory;

    return (
        <div className="flex flex-col gap-6">
            {/* Address block */}
            <div className="bg-white border border-border-subtle rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-stone-800 mb-4 font-['Lora',serif] border-b border-stone-100 pb-4">
                    Địa chỉ nhận hàng
                </h3>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-stone-800">{order.buyerName}</span>
                        <span className="text-stone-300">|</span>
                        <span className="text-stone-600">{order.buyerPhone}</span>
                    </div>
                    <p className="text-stone-500 text-sm leading-relaxed">
                        {order.buyerAddress}
                    </p>
                </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white border border-border-subtle rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-stone-800 mb-4 font-['Lora',serif] border-b border-stone-100 pb-4">
                    Thông tin thanh toán
                </h3>

                <div className="flex flex-col gap-3 text-sm text-stone-600 mb-4 border-b border-stone-100 pb-4">
                    <div className="flex justify-between">
                        <span>Phương thức:</span>
                        <span className="font-medium text-stone-800">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Trạng thái:</span>
                        <span className={`font-medium ${order.paymentStatus === 'PAID' ? 'text-market-success' : 'text-market-warning'}`}>
                            {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-3 text-sm">
                    <div className="flex justify-between text-stone-500">
                        <span>Tạm tính</span>
                        <span>{order.subTotal.toLocaleString("vi-VN")}đ</span>
                    </div>
                    <div className="flex justify-between text-stone-500">
                        <span>Phí vận chuyển</span>
                        <span>{order.shippingFee.toLocaleString("vi-VN")}đ</span>
                    </div>
                    {order.vouchers && order.vouchers.length > 0 ? (
                        <div className="flex flex-col gap-2 pt-2 pb-2 border-y border-stone-100 my-1">
                            <span className="font-semibold text-stone-700 mb-1">Voucher đã áp dụng:</span>
                            {order.vouchers.map((v, i) => {
                                const isFreeship = String(v.voucherSnapshot?.voucher_type || '').includes('FREESHIP');
                                const typeText = isFreeship ? 'Giảm phí vận chuyển' : 'Giảm giá sản phẩm';
                                return (
                                    <div key={i} className="flex flex-col bg-market-primary/5 rounded-lg p-2.5">
                                        <div className="flex justify-between items-center text-market-success text-sm">
                                            <div className="flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-sm">local_activity</span>
                                                <span className="font-semibold uppercase">{v.voucherCode}</span>
                                            </div>
                                            <span className="font-semibold">-{v.discountAmount.toLocaleString("vi-VN")}đ</span>
                                        </div>
                                        <div className="text-xs text-stone-500 pl-5 mt-0.5">
                                            {v.voucherSnapshot?.title || typeText}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <>
                            {order.discountAmount && order.discountAmount > 0 ? (
                                <div className="flex justify-between text-market-success">
                                    <span>Giảm giá</span>
                                    <span>-{order.discountAmount.toLocaleString("vi-VN")}đ</span>
                                </div>
                            ) : null}
                            {order.shippingDiscountAmount && order.shippingDiscountAmount > 0 ? (
                                <div className="flex justify-between text-market-success">
                                    <span>Giảm phí vận chuyển</span>
                                    <span>-{order.shippingDiscountAmount.toLocaleString("vi-VN")}đ</span>
                                </div>
                            ) : null}
                        </>
                    )}
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-stone-100">
                        <span className="font-semibold text-stone-800">Tổng cộng</span>
                        <span className="font-bold text-market-primary text-xl">
                            {order.totalAmount.toLocaleString("vi-VN")}đ
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                {(canCancel || canReturn || hasReturnHistory) && (
                    <div className="mt-6 flex flex-col gap-3">
                        {canCancel && (
                            <button
                                onClick={onCancelClick}
                                className="w-full min-h-11 flex items-center justify-center font-medium text-white bg-market-error hover:bg-red-700 rounded-xl transition-colors shadow-sm"
                            >
                                Hủy đơn
                            </button>
                        )}
                        {canReturn && (
                            <button
                                onClick={onReturnClick}
                                className="w-full min-h-11 flex items-center justify-center font-medium text-white bg-market-warning hover:bg-amber-600 rounded-xl transition-colors shadow-sm"
                            >
                                Yêu cầu đổi trả / Hoàn tiền
                            </button>
                        )}
                        {hasReturnHistory && (
                            isReturnRejected ? (
                                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-900 dark:text-red-200 text-sm flex flex-col gap-2.5">
                                    <div className="flex items-center gap-2.5">
                                        <span className="material-symbols-outlined text-red-600 shrink-0">cancel</span>
                                        <div>
                                            <div className="font-semibold text-xs uppercase tracking-wide">Yêu cầu đổi trả bị từ chối</div>
                                            <div className="text-xs text-red-700 dark:text-red-300/80 mt-0.5">
                                                Yêu cầu đổi trả của bạn không được phê duyệt.
                                            </div>
                                        </div>
                                    </div>
                                    {rejectionReason && (
                                        <div className="text-xs text-red-800 dark:text-red-300 bg-red-100/70 dark:bg-red-900/40 p-2.5 rounded-lg border border-red-200 dark:border-red-800/50">
                                            <strong>Lý do từ chối:</strong> {rejectionReason}
                                        </div>
                                    )}
                                </div>
                            ) : isReturnFinished ? (
                                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200 text-sm flex flex-col gap-2.5">
                                    <div className="flex items-center gap-2.5">
                                        <span className="material-symbols-outlined text-emerald-600 shrink-0">check_circle</span>
                                        <div>
                                            <div className="font-semibold text-xs uppercase tracking-wide">Đổi trả thành công</div>
                                            <div className="text-xs text-emerald-700 dark:text-emerald-300/80 mt-0.5">
                                                Yêu cầu đổi trả / hoàn tiền đã được xử lý hoàn tất.
                                            </div>
                                        </div>
                                    </div>
                                    {replacementOrderId && (
                                        <Link
                                            to={`/profile/order/tracking/${replacementOrderId}`}
                                            className="w-full py-2 px-3 bg-white dark:bg-stone-900 border border-emerald-300 dark:border-emerald-700 rounded-lg text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/40 transition-colors shadow-xs"
                                        >
                                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                                            Xem đơn hàng đổi mới #{replacementOrderId}
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-sm flex items-center gap-2.5">
                                    <span className="material-symbols-outlined text-amber-600 shrink-0">assignment_return</span>
                                    <div>
                                        <div className="font-semibold text-xs uppercase tracking-wide">
                                            {order.returnStatus === 'PICKING_UP'
                                                ? 'Shipper đang lấy hàng'
                                                : order.returnStatus === 'RECEIVED'
                                                ? 'Đã nhận hàng về kho'
                                                : 'Đang xử lý đổi trả'}
                                        </div>
                                        <div className="text-xs text-amber-700 dark:text-amber-300/80 mt-0.5">
                                            {order.returnStatus === 'PICKING_UP'
                                                ? 'Shipper đang trên đường đến lấy lại sản phẩm đổi trả.'
                                                : order.returnStatus === 'RECEIVED'
                                                ? 'Hàng đã được chuyển về kho và đang được kiểm tra.'
                                                : 'Đơn hàng đang có yêu cầu đổi trả / hoàn tiền được xử lý.'}
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                        {order.orderStatus === EOrderStatus.SUCCESS && !isWithin7Days && !hasReturnHistory && (
                            <div className="p-3 text-xs text-stone-500 bg-stone-50 rounded-xl border border-stone-200 text-center">
                                Đã hết hạn yêu cầu đổi trả (quá 7 ngày)
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
