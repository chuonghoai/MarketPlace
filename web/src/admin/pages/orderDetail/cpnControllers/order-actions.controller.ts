import { useState } from 'react';
import { orderService } from '../../../features/order/services/order.service';
import type { OrderDetail } from '../../../features/order/model/orderDetail.model';
import { EOrderStatus } from '../../../../features/order/enums/orderStatus.enum';

export const useOrderActionsController = (order: OrderDetail, onUpdateSuccess: (updatedDetail: OrderDetail) => void) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    /**
     * Call service update status
     */
    const updateStatus = async (status: EOrderStatus, note: string) => {
        setIsLoading(true);
        try {
            const res = await orderService.updateOrderStatus({
                orderId: order.id,
                status,
                note
            });
            if (res.success && res.data) {
                onUpdateSuccess(res.data);
            }
        } catch (error) {
            console.error(`Failed to update status to ${status}`, error);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * UI action update status (not cancel)
     */
    const handleConfirmOrder = () => updateStatus(EOrderStatus.PREPARING, "Đơn hàng đã được xác nhận");
    const handleHandOver = () => updateStatus(EOrderStatus.SHIPPING, "Đơn hàng đang được giao");
    const handleComplete = () => updateStatus(EOrderStatus.SUCCESS, "Đơn hàng đã hoàn tất");

    /**
     * UI action cancel order
     */
    const handleOpenCancelModal = () => setIsCancelModalOpen(true);
    const handleCloseCancelModal = () => setIsCancelModalOpen(false);
    const handleConfirmCancel = async (reason: string) => {
        await updateStatus(EOrderStatus.CANCELLED, reason);
        setIsCancelModalOpen(false);
    };

    /**
     * UI action return order (chưa phát triển)
     */
    const handleProcessReturn = () => {
        // TODO
        setIsLoading(true);
        setTimeout(() => {
            alert("Đã xử lý hoàn trả đơn hàng");
            setIsLoading(false);
        }, 1000);
    };

    /**
     * UI action open google map to shipping location
     */
    const handleOpenGoogleMaps = () => {
        if (order.latitude !== undefined && order.longitude !== undefined) {
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${order.latitude},${order.longitude}`, '_blank');
        } else {
            console.warn("No coordinates available for this order.");
        }
    };

    return {
        isLoading,
        isCancelModalOpen,
        handleConfirmOrder,
        handleHandOver,
        handleComplete,
        handleOpenCancelModal,
        handleCloseCancelModal,
        handleConfirmCancel,
        handleProcessReturn,
        handleOpenGoogleMaps
    };
};
