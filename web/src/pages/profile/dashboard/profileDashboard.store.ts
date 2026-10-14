import { useState } from "react";
import { userService } from "../../../features/user/services/user.service";
import { userStorageService } from "../../../features/user/services/userStorage.service";
import type { UpdateProfileRequest } from "../../../features/user/dto/updateProfile.type";
import type { WishlistItem } from "../../../features/user/models/wishlist.model";
import type { User } from "../../../features/user/models/user.model";
import { useToast } from "../../../components/toast/toast";
import type { ApiResponse } from "../../../core/api/apiResponse";
import { favoriteService } from "../../../features/products/services/favorite.service";

const WISHLIST_PAGE_SIZE = 40;

export const useProfileDashboardStore = () => {
    const { toast } = useToast();

    const currentUser = userStorageService.getUser();
    const [formData, setFormData] = useState<UpdateProfileRequest>({
        fullName: currentUser?.fullName ?? "",
        phone: "",
        gender: undefined,
        dateOfBirth: "",
    });
    const [isSaving, setIsSaving] = useState(false);

    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [wishlistPagination, setWishlistPagination] = useState<ApiResponse<WishlistItem[]>["pagination"]>();
    const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
    const [removingFavoriteId, setRemovingFavoriteId] = useState<string | null>(null);

    const loadFormData = async () => {
        try {
            const result = await userService.getProfile();
            const profile = result.data;
            setFormData({
                fullName: profile.fullName,
                phone: profile.phone,
                gender: profile.gender,
                dateOfBirth: profile.dateOfBirth,
            });
        } catch {
            toast("Không thể tải thông tin hồ sơ", "error");
        }
    };

    const loadWishlist = async (page: number) => {
        setIsLoadingWishlist(true);
        try {
            const result = await userService.getWishlist(page, WISHLIST_PAGE_SIZE);
            setWishlistItems(result.data.items);
            setWishlistPagination(result.pagination);
        } catch {
            toast("Không thể tải danh sách yêu thích", "error");
        } finally {
            setIsLoadingWishlist(false);
        }
    };

    const saveProfile = async (user: User | null): Promise<boolean> => {
        setIsSaving(true);
        try {
            await userService.updateProfile(formData);
            if (user && formData.fullName) {
                const updated = { ...user, fullName: formData.fullName };
                userStorageService.setUser(updated);
            }
            toast("Cập nhật hồ sơ thành công", "success");
            return true;
        } catch {
            toast("Cập nhật hồ sơ thất bại", "error");
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const removeFavorite = async (productId: string): Promise<boolean> => {
        if (removingFavoriteId) return false;
        setRemovingFavoriteId(productId);
        try {
            const response = await favoriteService.toggleFavorite(productId);
            if (response.success) {
                setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
                setWishlistPagination((prev) => {
                    if (!prev) return prev;
                    const newTotalItems = Math.max(0, prev.totalItems - 1);
                    return {
                        ...prev,
                        totalItems: newTotalItems,
                        totalPages: Math.max(1, Math.ceil(newTotalItems / prev.pageSize)),
                    };
                });
                toast(response.message || "Đã xóa khỏi bộ sưu tập yêu thích", "success");
                return true;
            } else {
                toast(response.message || "Không thể bỏ yêu thích sản phẩm", "error");
                return false;
            }
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || error?.message || "Không thể bỏ yêu thích sản phẩm";
            toast(errorMsg, "error");
            return false;
        } finally {
            setRemovingFavoriteId(null);
        }
    };

    return {
        formData,
        setFormData,
        isSaving,
        wishlistItems,
        wishlistPagination,
        isLoadingWishlist,
        removingFavoriteId,
        loadFormData,
        loadWishlist,
        saveProfile,
        removeFavorite,
    };
};
