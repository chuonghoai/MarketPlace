import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { UpdateProfileRequest } from "../../../features/user/dto/updateProfile.type";
import { useProfileStore } from "../profile.store";
import { useProfileDashboardStore } from "./profileDashboard.store";

export const useProfileDashboardController = () => {
    const { user } = useProfileStore();
    const dashboardStore = useProfileDashboardStore();

    const [searchParams, setSearchParams] = useSearchParams();

    const currentUrlState = useMemo(() => {
        return {
            page: Number(searchParams.get("page")) || 1,
        };
    }, [searchParams]);

    const [isEditMode, setIsEditMode] = useState(false);
    const [formDataSnapshot, setFormDataSnapshot] = useState<UpdateProfileRequest | null>(null);

    useEffect(() => {
        dashboardStore.loadFormData();
    }, []);

    useEffect(() => {
        dashboardStore.loadWishlist(currentUrlState.page);
    }, [currentUrlState.page]);

    const handleFieldChange = (field: keyof UpdateProfileRequest, value: string) => {
        dashboardStore.setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleEnterEdit = () => {
        setFormDataSnapshot({ ...dashboardStore.formData });
        setIsEditMode(true);
    };

    const handleCancelEdit = () => {
        if (formDataSnapshot) {
            dashboardStore.setFormData(() => formDataSnapshot);
        }
        setIsEditMode(false);
        setFormDataSnapshot(null);
    };

    const handleSaveProfile = async () => {
        const success = await dashboardStore.saveProfile(user);
        if (success) {
            setIsEditMode(false);
            setFormDataSnapshot(null);
        }
    };

    const handleWishlistPageChange = (newPage: number) => {
        if (dashboardStore.wishlistPagination && newPage >= 1 && newPage <= dashboardStore.wishlistPagination.totalPages) {
            searchParams.set("page", newPage.toString());
            setSearchParams(searchParams);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return {
        user,
        formData: dashboardStore.formData,
        isSaving: dashboardStore.isSaving,
        wishlistItems: dashboardStore.wishlistItems,
        wishlistPagination: dashboardStore.wishlistPagination,
        wishlistPage: currentUrlState.page,
        isLoadingWishlist: dashboardStore.isLoadingWishlist,
        isEditMode,
        handleFieldChange,
        handleEnterEdit,
        handleCancelEdit,
        handleSaveProfile,
        handleWishlistPageChange,
    };
};
