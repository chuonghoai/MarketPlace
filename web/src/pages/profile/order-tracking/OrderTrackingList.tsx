import React from "react";
import { Link } from "react-router-dom";
import { OrderCard } from "./components/OrderCard";
import { useOrderTrackingListController } from "./orderTrackingList.controller";
import { CancelOrderRequestModal } from "../components/CancelOrderRequestModal";
import { ReturnOrderRequestModal } from "../components/ReturnOrderRequestModal";
import type { OrderItemTracking } from "../../../features/order/tracking/model/orderItem.model";

export const OrderTrackingList: React.FC = () => {
    const controller = useOrderTrackingListController();
    const [actionState, setActionState] = React.useState<{ type: 'cancel' | 'return' | null, order: OrderItemTracking | null }>({ type: null, order: null });

    return (
        <div className="bg-white border border-border-subtle rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-125">
            {/* Header */}
            <div className="px-6 py-5 border-b border-stone-100 flex items-center gap-4 bg-white">
                <div className="w-10 h-10 rounded-xl bg-market-primary/10 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-market-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                </div>
                <div>
                    <h2 className="font-['Lora',serif] text-xl font-bold text-stone-900">
                        Theo dõi đơn hàng
                    </h2>
                    <p className="text-stone-500 text-sm mt-0.5">
                        Quản lý và theo dõi trạng thái các đơn hàng đã đặt
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-stone-100 bg-white sticky top-18 z-10">
                <div className="flex overflow-x-auto hide-scrollbar">
                    {controller.tabs.map((tab) => {
                        const isActive = controller.activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => controller.handleTabChange(tab.key)}
                                className={`flex items-center gap-2 px-6 py-4 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${
                                    isActive
                                        ? "border-market-primary text-market-primary"
                                        : "border-transparent text-stone-500 hover:text-stone-700 hover:bg-stone-50"
                                }`}
                            >
                                {tab.label}
                                {tab.count > 0 && ["all", "pending", "preparing", "shipping"].includes(tab.key) && (
                                    <span
                                        className={`px-1.5 py-0.5 rounded-full text-[10px] leading-none ${
                                            isActive
                                                ? "bg-market-primary/10 text-market-primary"
                                                : "bg-stone-100 text-stone-500"
                                        }`}
                                    >
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 bg-stone-50/30 flex-1 flex flex-col gap-4 relative">
                {controller.loading && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                        <div className="w-8 h-8 rounded-full border-2 border-market-primary border-t-transparent animate-spin"></div>
                    </div>
                )}
                {controller.error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 mb-2">
                        {controller.error}
                    </div>
                )}
                
                {controller.actionLoading && (
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-20 rounded-2xl">
                        <div className="w-8 h-8 rounded-full border-2 border-market-primary border-t-transparent animate-spin"></div>
                    </div>
                )}

                {controller.filteredItems.length > 0 ? (
                    controller.filteredItems.map((order) => (
                        <OrderCard 
                            key={order.id} 
                            order={order} 
                            onCancel={() => setActionState({ type: 'cancel', order })}
                            onReturn={() => setActionState({ type: 'return', order })}
                        />
                    ))
                ) : (
                    !controller.loading && (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                            <div className="w-24 h-24 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                                <svg className="w-12 h-12 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-stone-800 mb-1">
                                Chưa có đơn hàng
                            </h3>
                            <p className="text-stone-500 text-sm mb-6 max-w-sm">
                                Các đơn hàng của bạn sẽ xuất hiện tại đây. Hãy tiếp tục khám phá và mua sắm những sản phẩm ưng ý nhé!
                            </p>
                            <Link
                                to="/products"
                                className="px-6 py-2.5 bg-market-primary text-white text-sm font-medium rounded-lg hover:bg-market-primary/90 transition-colors shadow-sm"
                            >
                                Tiếp tục mua sắm
                            </Link>
                        </div>
                    )
                )}
            </div>

            {/* Modals */}
            {actionState.order && actionState.type === 'cancel' && (
                <CancelOrderRequestModal
                    open={true}
                    order={actionState.order}
                    onClose={() => setActionState({ type: null, order: null })}
                    onSubmit={async (note) => {
                        await controller.handleCancelOrder(actionState.order!.id, note);
                        setActionState({ type: null, order: null });
                    }}
                />
            )}
            {actionState.order && actionState.type === 'return' && (
                <ReturnOrderRequestModal
                    open={true}
                    order={actionState.order}
                    onClose={() => setActionState({ type: null, order: null })}
                    onSubmit={async (note) => {
                        await controller.handleReturnOrder(actionState.order!.id, note);
                        setActionState({ type: null, order: null });
                    }}
                />
            )}
        </div>
    );
};
