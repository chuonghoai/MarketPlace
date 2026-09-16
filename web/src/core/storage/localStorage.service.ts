class LocalStorageService {
    set(key: string, value: unknown): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    get<T>(key: string): T | null {
        const value = localStorage.getItem(key);

        if (!value) {
            return null;
        }

        return JSON.parse(value) as T;
    }

    remove(key: string): void {
        localStorage.removeItem(key);
    }

    clear(): void {
        localStorage.clear();
    }
}

export const localStorageService = new LocalStorageService();