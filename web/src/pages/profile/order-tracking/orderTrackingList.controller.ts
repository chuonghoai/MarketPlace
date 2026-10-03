import { useState, useEffect, useMemo, useCallback } from "react";
import { useOrderTrackingListStore } from "./orderTrackingList.store";
import { useToast } from "../../../components/toast/toast";
import { EOrderStatus } from "../../../features/order/enums/orderStatus.enum";
import { orderService } from "../../../features/order/tracking/services/order.service";

export type TabKey = "all" | "pending" | "preparing" | "shipping" | "success" | "cancelled" | "returned";

export interface TabItem {
    key: TabKey;
    label: string;
    count: number;
}

export const useOrderTrackingListController = () => {
    const store = useOrderTrackingListStore();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState<TabKey>("all");

    // Đếm số lượng theo trạng thái
    useEffect(() => {
        store.fetchOrdersCount();
    }, [store.fetchOrdersCount]);

    // Lấy danh sách đơn theo tab
    useEffect(() => {
        let status: EOrderStatus | undefined;
        if (activeTab === "pending") status = EOrderStatus.PENDING;
        else if (activeTab === "preparing") status = EOrderStatus.PREPARING;
        else if (activeTab === "shipping") status = EOrderStatus.SHIPPING;
        else if (activeTab === "success") status = EOrderStatus.SUCCESS;
        else if (activeTab === "cancelled") status = EOrderStatus.CANCELLED;
        else if (activeTab === "returned") status = EOrderStatus.RETURNED;

        store.fetchOrders(status);
    }, [activeTab, store.fetchOrders]);

    // Danh sách tabs trạng thái đơn
    const tabs: TabItem[] = useMemo(() => {
        const count = store.ordersCount;
        return [
            { key: "all", label: "Tất cả", count: count?.all || 0 },
            { key: "pending", label: "Chờ xác nhận", count: count?.pending || 0 },
            { key: "preparing", label: "Đang chuẩn bị", count: count?.preparing || 0 },
            { key: "shipping", label: "Đang giao", count: count?.shipping || 0 },
            { key: "success", label: "Đã giao", count: count?.success || 0 },
            { key: "cancelled", label: "Đã hủy", count: count?.cancelled || 0 },
            { key: "returned", label: "Yêu cầu trả hàng", count: 0 },
        ];
    }, [store.ordersCount]);

    // Chuyển tab trạng thái
    const handleTabChange = useCallback((tab: TabKey) => {
        setActiveTab(tab);
    }, []);

    // Lọc danh sách đơn theo tab
    const filteredItems = useMemo(() => {
        return store.orders.filter((item) => {
            if (activeTab === "all") return item.orderStatus === EOrderStatus.PENDING || item.orderStatus === EOrderStatus.PREPARING || item.orderStatus === EOrderStatus.SHIPPING;
            if (activeTab === "pending") return item.orderStatus === EOrderStatus.PENDING;
            if (activeTab === "preparing") return item.orderStatus === EOrderStatus.PREPARING;
            if (activeTab === "shipping") return item.orderStatus === EOrderStatus.SHIPPING;
            if (activeTab === "success") return item.orderStatus === EOrderStatus.SUCCESS || item.orderStatus === EOrderStatus.DELIVERED;
            if (activeTab === "cancelled") return item.orderStatus === EOrderStatus.CANCELLED;
            if (activeTab === "returned") return item.orderStatus === EOrderStatus.RETURNED;
            return true;
        });
    }, [store.orders, activeTab]);

    const handleCancelOrder = useCallback(async (orderId: string, note: string) => {
        const result = await store.cancelOrder(orderId, note);
        if (result.success) {
            toast("Hủy đơn hàng thành công!", "success");
            store.fetchOrdersCount();
            store.fetchOrders(activeTab === "all" ? undefined : (
                activeTab === "pending" ? EOrderStatus.PENDING :
                    activeTab === "preparing" ? EOrderStatus.PREPARING :
                        activeTab === "shipping" ? EOrderStatus.SHIPPING :
                            activeTab === "success" ? EOrderStatus.SUCCESS :
                                activeTab === "cancelled" ? EOrderStatus.CANCELLED :
                                    activeTab === "returned" ? EOrderStatus.RETURNED : undefined
            ));
        } else {
            toast(result.message || "Không thể hủy đơn hàng.", "error");
        }
    }, [store.cancelOrder, store.fetchOrders, store.fetchOrdersCount, activeTab, toast]);

    const handleReturnOrder = useCallback(async (orderId: string, data: any) => {
        if (typeof data === 'object') {
            const result = await orderService.createReturnRequest(orderId, data);
            if (result.success) {
                toast("Gửi yêu cầu xử lý đổi trả/hoàn tiền thành công!", "success");
                store.fetchOrdersCount();
                store.fetchOrders();
            } else {
                toast(result.message || "Không thể gửi yêu cầu đổi trả.", "error");
            }
        } else {
            const result = await store.returnOrder(orderId, String(data));
            if (result.success) {
                toast("Yêu cầu trả hàng thành công!", "success");
                store.fetchOrdersCount();
                store.fetchOrders();
            } else {
                toast(result.message || "Không thể yêu cầu trả hàng.", "error");
            }
        }
    }, [store, toast]);

    return {
        loading: store.loading,
        error: store.error,
        actionLoading: store.actionLoading,
        activeTab,
        tabs,
        filteredItems,
        handleTabChange,
        handleCancelOrder,
        handleReturnOrder,
    };
};
