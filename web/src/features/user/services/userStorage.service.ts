import { localStorageService } from "../../../core/storage/localStorage.service";
import type { User } from "../models/user.model";

class UserStorageService {
    setUser(user: User): void {
        localStorageService.set("user", user);
        window.dispatchEvent(new Event("auth_changed"));
    }

    getUser(): User | null {
        return localStorageService.get<User>("user");
    }

    removeUser(): void {
        localStorageService.remove("user");
        window.dispatchEvent(new Event("auth_changed"));
    }
}

export const userStorageService = new UserStorageService();