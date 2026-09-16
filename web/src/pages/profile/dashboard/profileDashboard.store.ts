import { useState } from "react";
import { userService } from "../../../features/user/services/user.service";
import { userStorageService } from "../../../features/user/services/userStorage.service";
import type { UpdateProfileRequest } from "../../../features/user/dto/updateProfile.type";
import type { WishlistItem } from "../../../features/user/models/wishlist.model";
import type { User } from "../../../features/user/models/user.model";
import { useToast } from "../../../components/toast/toast";
import type { ApiResponse } from "../../../core/api/apiResponse";

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

    return {
        formData,
        setFormData,
        isSaving,
        wishlistItems,
        wishlistPagination,
        isLoadingWishlist,
        loadFormData,
        loadWishlist,
        saveProfile,
    };
};
