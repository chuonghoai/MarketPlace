import { useState, useCallback, useEffect } from 'react';
import { userService } from '../../../features/user/services/user.service';
import type { Address } from '../../../features/order/checkout/models/checkout.model';
import { useToast } from '../../../components/toast/toast';

export const useAddressManagementController = () => {
    const { toast } = useToast();

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    // Delete confirmation state
    const [deletingAddressId, setDeletingAddressId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchAddresses = useCallback(async () => {
        setLoading(true);
        try {
            const res = await userService.getAddress();
            if (res.success && res.data) {
                setAddresses(res.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách địa chỉ:", error);
            toast("Không thể tải danh sách địa chỉ", "error");
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    const handleAddSuccess = (newAddress: Address) => {
        setAddresses(prev => [...prev, newAddress]);
        setIsAddModalOpen(false);
        toast("Thêm địa chỉ mới thành công!", "success");
    };

    const handleUpdateSuccess = (updatedAddress: Address) => {
        setAddresses(prev => prev.map(a => a.id === updatedAddress.id ? updatedAddress : a));
        setEditingAddress(null);
        toast("Cập nhật địa chỉ thành công!", "success");
    };

    // Mở modal xác nhận xóa
    const confirmDelete = (id: number) => {
        setDeletingAddressId(id);
    };

    // Đóng modal xác nhận xóa
    const cancelDelete = () => {
        setDeletingAddressId(null);
    };

    // Thực hiện xóa sau khi xác nhận
    const executeDelete = async () => {
        if (deletingAddressId === null) return;
        setIsDeleting(true);
        try {
            const res = await userService.deleteAddress(deletingAddressId);
            if (res.success) {
                setAddresses(prev => prev.filter(a => a.id !== deletingAddressId));
                toast("Xóa địa chỉ thành công!", "success");
            } else {
                toast(res.message || "Không thể xóa địa chỉ", "error");
            }
        } catch {
            toast("Có lỗi xảy ra khi xóa địa chỉ", "error");
        } finally {
            setIsDeleting(false);
            setDeletingAddressId(null);
        }
    };

    const handleSetDefault = async (id: number) => {
        try {
            const res = await userService.setDefaultAddress(id);
            if (res.success) {
                setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
                toast("Đặt địa chỉ mặc định thành công!", "success");
            } else {
                toast(res.message || "Không thể đặt mặc định", "error");
            }
        } catch {
            toast("Có lỗi xảy ra", "error");
        }
    };

    // Lấy tên address đang chờ xóa (để hiển thị trên modal)
    const deletingAddress = addresses.find(a => a.id === deletingAddressId) ?? null;

    return {
        addresses,
        loading,
        isAddModalOpen,
        setIsAddModalOpen,
        editingAddress,
        setEditingAddress,
        handleAddSuccess,
        handleUpdateSuccess,
        confirmDelete,
        cancelDelete,
        executeDelete,
        isDeleting,
        deletingAddress,
        handleSetDefault,
        fetchAddresses,
    };
};
