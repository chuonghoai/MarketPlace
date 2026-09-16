import { useProfileDashboardController } from "./profileDashboard.controller";
import { ProfileInformationCard } from "../components/ProfileInformationCard";
import { WishlistTab } from "../components/wishlistTab";

const ProfileDashboardPage = () => {
    const controller = useProfileDashboardController();

    return (
        <div className="flex flex-col gap-6">
            {/* Profile Information */}
            <ProfileInformationCard
                user={controller.user}
                formData={controller.formData}
                isEditMode={controller.isEditMode}
                isSaving={controller.isSaving}
                onFieldChange={controller.handleFieldChange}
                onEnterEdit={controller.handleEnterEdit}
                onSave={controller.handleSaveProfile}
                onCancel={controller.handleCancelEdit}
            />

            {/* Wishlist */}
            <div className="bg-white border border-border-subtle rounded-2xl p-6 shadow-sm">
                <h2 className="font-['Lora',serif] text-lg font-bold text-stone-900 mb-6 border-b border-stone-100 pb-4">
                    Danh sách yêu thích
                </h2>
                <WishlistTab
                    items={controller.wishlistItems}
                    isLoading={controller.isLoadingWishlist}
                    pagination={controller.wishlistPagination}
                    currentPage={controller.wishlistPage}
                    onPageChange={controller.handleWishlistPageChange}
                />
            </div>
        </div>
    );
};

export default ProfileDashboardPage;
