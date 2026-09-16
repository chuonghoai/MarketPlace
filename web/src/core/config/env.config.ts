export const ENV = {
    API_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
    API_TIMEOUT: Number(
        import.meta.env.VITE_API_TIMEOUT || 10000
    ),
};