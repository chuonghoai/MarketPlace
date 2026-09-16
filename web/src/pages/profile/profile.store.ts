import { useState } from "react";
import { userService } from "../../features/user/services/user.service";
import { userStorageService } from "../../features/user/services/userStorage.service";
import type { User } from "../../features/user/models/user.model";
import { useToast } from "../../components/toast/toast";

export const useProfileStore = () => {
    const { toast } = useToast();
    const [user, setUser] = useState<User | null>(userStorageService.getUser());

    const loadProfile = async () => {
        try {
            const result = await userService.getProfile();
            const profile = result.data;

            const updatedUser: User = {
                id: profile.id,
                email: profile.email,
                fullName: profile.fullName,
                role: user?.role || "USER",
                avatarUrl: profile.avatarUrl,
            };

            setUser(updatedUser);
            userStorageService.setUser(updatedUser);
        } catch {
            toast("Không thể tải thông tin hồ sơ", "error");
        }
    };

    return {
        user,
        setUser,
        loadProfile,
    };
};
