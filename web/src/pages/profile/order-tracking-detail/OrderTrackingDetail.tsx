import React from "react";
import { OrderTimeline } from "./components/OrderTimeline";
import { CancelOrderRequestModal } from "../components/CancelOrderRequestModal";
import { ReturnOrderRequestModal } from "../components/ReturnOrderRequestModal";
import { useOrderTrackingDetailController } from "./orderTrackingDetail.controller";
import { OrderSummaryCard } from "./components/OrderSummaryCard";
import { OrderItemsSection } from "./components/OrderItemsSection";
import { ShippingInfoCard } from "./components/ShippingInfoCard";
import { OrderNotesCard } from "./components/OrderNotesCard";
import { EOrderStatus } from "../../../features/order/enums/orderStatus.enum";

export const OrderTrackingDetail: React.FC = () => {
    const controller = useOrderTrackingDetailController();
    const [isCancelModalOpen, setIsCancelModalOpen] = React.useState(false);
    const [isReturnModalOpen, setIsReturnModalOpen] = React.useState(false);

    if (controller.loading && !controller.order) {
        return (
            <div className="flex justify-center items-center h-64 bg-white rounded-2xl border border-border-subtle shadow-sm">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-market-primary"></div>
            </div>
        );
    }

    if (controller.error || !controller.order) {
        return (
            <div className="flex justify-center items-center h-64 bg-white rounded-2xl border border-border-subtle shadow-sm text-red-500">
                {controller.error || "Không tìm thấy chi tiết đơn hàng"}
            </div>
        );
    }



    return (
        <div className="flex flex-col gap-6 relative">
            {controller.actionLoading && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-20 rounded-2xl">
                    <div className="w-8 h-8 rounded-full border-2 border-market-primary border-t-transparent animate-spin"></div>
                </div>
            )}

            {/* Breadcrumb & Context Header (UC23 - Yêu cầu hỗ trợ) */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                <a href="/profile/order-tracking" className="hover:text-amber-600 transition-colors">
                    Đơn hàng của tôi
                </a>
                <span>/</span>
                <span className="text-stone-900 dark:text-stone-200 font-medium">
                    Đơn #{controller.order.id}
                </span>
                {controller.order.orderStatus === EOrderStatus.RETURNED && (() => {
                    const isReturnRejected =
                        controller.order.returnStatus === 'REJECTED' ||
                        controller.order.statusHistory?.some(
                            h => h.note && (h.note.includes('Từ chối') || h.note.includes('từ chối'))
                        );
                    const isReturnFinished =
                        !isReturnRejected &&
                        (controller.order.returnStatus === 'COMPLETED' ||
                            controller.order.statusHistory?.some(
                                h =>
                                    h.note &&
                                    (h.note.includes('Hoàn tiền') ||
                                        h.note.includes('đổi hàng mới') ||
                                        h.note.includes('Đã hoàn tất'))
                            ));
                    return (
                        <>
                            <span>/</span>
                            <span
                                className={`px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${
                                    isReturnRejected
                                        ? 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/40'
                                        : isReturnFinished
                                        ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/40'
                                        : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/40'
                                }`}
                            >
                                {isReturnRejected ? 'Từ chối đổi trả' : isReturnFinished ? 'Đổi trả thành công' : 'Đang xử lý đổi trả'}
                            </span>
                        </>
                    );
                })()}
            </div>

            {/* Section 1: Summary Card */}
            <OrderSummaryCard order={controller.order} />

            {/* Section 2: Timeline */}
            <OrderTimeline history={controller.order.statusHistory} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Items */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <OrderItemsSection order={controller.order} />
                </div>

                {/* Right Column: Shipping & Notes */}
                <div className="flex flex-col gap-6">
                    <OrderNotesCard order={controller.order} />

                    <ShippingInfoCard
                        order={controller.order}
                        onCancelClick={() => setIsCancelModalOpen(true)}
                        onReturnClick={() => setIsReturnModalOpen(true)}
                    />
                </div>
            </div>

            {/* Modals */}
            {controller.order && (
                <CancelOrderRequestModal
                    open={isCancelModalOpen}
                    order={controller.order}
                    onClose={() => setIsCancelModalOpen(false)}
                    onSubmit={controller.handleCancelOrder}
                />
            )}
            {controller.order && (
                <ReturnOrderRequestModal
                    open={isReturnModalOpen}
                    order={controller.order}
                    onClose={() => setIsReturnModalOpen(false)}
                    onSubmit={controller.handleReturnOrder}
                />
            )}
        </div>
    );
};
