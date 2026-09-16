import { useState, useEffect } from "react";
import { useProfileStore } from "../profile.store";
import { useLocation } from "react-router-dom";

export const useProfileLayoutController = () => {
    const { user, loadProfile } = useProfileStore();
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        loadProfile();
    }, []);

    useEffect(() => {
        setIsMobileSidebarOpen(false);
    }, [location.pathname]);

    const handleOpenChangePassword = () => {
        setIsChangePasswordOpen(true);
    };

    const handleCloseChangePassword = () => {
        setIsChangePasswordOpen(false);
    };

    const handleToggleMobileSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    const handleCloseMobileSidebar = () => {
        setIsMobileSidebarOpen(false);
    };

    return {
        user,
        isChangePasswordOpen,
        isMobileSidebarOpen,
        handleOpenChangePassword,
        handleCloseChangePassword,
        handleToggleMobileSidebar,
        handleCloseMobileSidebar,
    };
};
