import { localStorageService } from "../storage/localStorage.service";

const ACCESS_TOKEN_KEY = "access_token";

class TokenService {
    saveAccessToken(token: string): void {
        localStorageService.set(ACCESS_TOKEN_KEY, token);
    }

    getAccessToken(): string | null {
        return localStorageService.get<string>(ACCESS_TOKEN_KEY);
    }

    removeAccessToken(): void {
        localStorageService.remove(ACCESS_TOKEN_KEY);
    }

    clear(): void {
        localStorageService.clear();
    }
}

export const tokenService = new TokenService();