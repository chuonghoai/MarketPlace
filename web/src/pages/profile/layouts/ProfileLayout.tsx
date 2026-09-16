import { Outlet } from "react-router-dom";
import { useProfileLayoutController } from "./profileLayout.controller";
import { ProfileHeroSection } from "../components/ProfileHeroSection";
import { UserInfoSidebar } from "../components/userInfoSidebar";
import { ChangePasswordModal } from "../components/changePasswordModal";

export const ProfileLayout = () => {
    const controller = useProfileLayoutController();

    return (
        <div className="w-full min-h-screen bg-stone-50/50">
            <ProfileHeroSection user={controller.user} />

            <div className="max-w-400 mx-auto px-6 lg:px-10 py-8">
                <div className="flex flex-col lg:flex-row gap-6 items-start relative">
                    
                    {controller.isMobileSidebarOpen && (
                        <div 
                            className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity"
                            onClick={controller.handleCloseMobileSidebar}
                            aria-hidden="true"
                        />
                    )}

                    <aside className={`
                        fixed inset-y-0 left-0 z-50 w-[70%] max-w-75 bg-stone-50 shadow-2xl overflow-y-auto transition-transform duration-300 ease-in-out lg:w-65 xl:w-70 lg:shrink-0 lg:bg-transparent lg:shadow-none lg:overflow-visible lg:translate-x-0 lg:sticky lg:top-22 lg:z-auto
                        ${controller.isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    `}>
                        <div className="p-4 lg:p-0 min-h-full">
                            <UserInfoSidebar
                                user={controller.user}
                                onChangePasswordClick={controller.handleOpenChangePassword}
                            />
                        </div>
                    </aside>

                    <div className="flex-1 min-w-0 w-full">
                        {/* Mobile Menu Button (Fixed Icon) */}
                        <button
                            onClick={controller.handleToggleMobileSidebar}
                            className="lg:hidden fixed top-22 left-2 z-40 w-11 h-11 flex items-center justify-center text-stone-700 focus:outline-none"
                            aria-label="Mở menu hồ sơ"
                        >
                            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <Outlet />
                    </div>
                </div>
            </div>

            <ChangePasswordModal
                isOpen={controller.isChangePasswordOpen}
                onClose={controller.handleCloseChangePassword}
            />
        </div>
    );
};
