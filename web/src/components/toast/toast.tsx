import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastMessage {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastContextType {
    toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

const ToastItem = ({ type, message, onRemove: _onRemove }: ToastMessage & { onRemove: () => void }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setIsVisible(true));
        const hideTimer = setTimeout(() => setIsVisible(false), 2700);
        return () => clearTimeout(hideTimer);
    }, []);

    const styles = {
        success: "bg-[#DCFCE7] text-[#166534] border-market-success",
        error: "bg-[#FEE2E2] text-[#991B1B] border-market-error",
        warning: "bg-[#FEF3C7] text-[#92400E] border-market-warning",
        info: "bg-[#DBEAFE] text-[#1E3A8A] border-market-info",
    }[type];

    const icons = {
        success: (
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        ),
        error: (
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        warning: (
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        info: (
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    }[type];

    return (
        <div
            className={`pointer-events-auto flex items-center gap-3 min-w-[300px] max-w-[400px] p-4 rounded-[4px] border-[1.5px] shadow-none ${styles} transition-all duration-300 ease-out transform ${isVisible ? "translate-y-0 opacity-100 scale-100" : "-translate-y-full opacity-0 scale-95"
                }`}
        >
            {icons}
            <span className="font-['Open_Sans',sans-serif] text-[14px] font-medium leading-tight">
                {message}
            </span>
        </div>
    );
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const addToast = useCallback((message: string, type: ToastType = "info") => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, type, message }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ toast: addToast }}>
            {children}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-9999 flex flex-col gap-3 pointer-events-none">
                {toasts.map((t) => (
                    <ToastItem key={t.id} {...t} onRemove={() => { }} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};