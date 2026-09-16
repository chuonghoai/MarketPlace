import React from "react";
import { OrderTimeline } from "./components/OrderTimeline";
import { CancelOrderRequestModal } from "../components/CancelOrderRequestModal";
import { ReturnOrderRequestModal } from "../components/ReturnOrderRequestModal";
import { useOrderTrackingDetailController } from "./orderTrackingDetail.controller";
import { OrderSummaryCard } from "./components/OrderSummaryCard";
import { OrderItemsSection } from "./components/OrderItemsSection";
import { ShippingInfoCard } from "./components/ShippingInfoCard";
import { OrderNotesCard } from "./components/OrderNotesCard";

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
