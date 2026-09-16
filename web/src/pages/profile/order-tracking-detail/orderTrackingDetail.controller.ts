import { useEffect, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useOrderTrackingDetailStore } from "./orderTrackingDetail.store";
import { useToast } from "../../../components/toast/toast";

export const useOrderTrackingDetailController = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const location = useLocation();
    const store = useOrderTrackingDetailStore();
    const { toast } = useToast();

    useEffect(() => {
        if (location.state?.updatedOrder) {
            store.setOrder(location.state.updatedOrder);
            window.history.replaceState({}, document.title);
        } else if (orderId) {
            store.fetchOrderDetail(orderId);
        }
    }, [orderId, store.fetchOrderDetail, store.setOrder, location.state]);

    const handleCancelOrder = useCallback(async (note: string) => {
        if (!orderId) return;
        const result = await store.cancelOrder(orderId, note);
        if (result.success) {
            toast("Hủy đơn hàng thành công!", "success");
        } else {
            toast(result.message || "Không thể hủy đơn hàng.", "error");
        }
    }, [orderId, store.cancelOrder, toast]);

    const handleReturnOrder = useCallback(async (note: string) => {
        if (!orderId) return;
        const result = await store.returnOrder(orderId, note);
        if (result.success) {
            toast("Yêu cầu trả hàng thành công!", "success");
        } else {
            toast(result.message || "Không thể yêu cầu trả hàng.", "error");
        }
    }, [orderId, store.returnOrder, toast]);

    return {
        order: store.order,
        loading: store.loading,
        error: store.error,
        actionLoading: store.actionLoading,
        handleCancelOrder,
        handleReturnOrder,
    };
};
