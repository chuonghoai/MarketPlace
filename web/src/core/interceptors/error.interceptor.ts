import axios from "axios";
import { axiosInstance } from "../api/axios";
import { userStorageService } from "../../features/user/services/userStorage.service";

axiosInstance.interceptors.response.use(
    (response) => response,

    (error) => {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const requestUrl = error.config?.url || "";

            if (status === 401 && !requestUrl.includes("/auth/login")) {
                const currentUser = userStorageService.getUser();
                let reason = "unauthorized";
                if (currentUser) {
                    reason = "expired";
                }
                userStorageService.removeUser();

                window.location.href = `/login?reason=${reason}`;
            }

            if (status === 403) {
                alert("Forbidden");
            }

            if (status === 500) {
                alert("Server error");
            }
        }

        return Promise.reject(error);
    }
);