import { useNavigate, useLocation } from "react-router-dom";
import type { User } from "../../../features/user/models/user.model";
import { authService } from "../../../features/auth/services/auth.service";
import { useToast } from "../../../components/toast/toast";

interface UserInfoSidebarProps {
    user: User | null;
    onChangePasswordClick: () => void;
}

type NavItem = {
    id: string;
    label: string;
    path: string;
    icon: React.ReactNode;
};

type ActionItem = {
    id: string;
    label: string;
    icon: React.ReactNode;
    action: () => void;
    isDestructive?: boolean;
};

export const UserInfoSidebar = ({
    user,
    onChangePasswordClick,
}: UserInfoSidebarProps) => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    const navItems: NavItem[] = [
        {
            id: "dashboard",
            label: "Thông tin cá nhân",
            path: "/profile/dashboard",
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
        },
        {
            id: "addresses",
            label: "Địa chỉ giao hàng",
            path: "/profile/addresses",
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
        {
            id: "order-tracking",
            label: "Theo dõi đơn hàng",
            path: "/profile/order/tracking",
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
        },
    ];

    const actionItems: ActionItem[] = [
        {
            id: "password",
            label: "Đổi mật khẩu",
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            ),
            action: onChangePasswordClick,
        },
        {
            id: "logout",
            label: "Đăng xuất",
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
            ),
            action: () => {
                authService.logout(),
                toast("Đăng xuất thành công", "info");
                navigate("/login");
            },
            isDestructive: true,
        },
    ];

    const isActive = (path: string) => {
        if (path === "/profile/dashboard") return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="bg-white border border-border-subtle rounded-2xl overflow-hidden shadow-sm">
            {/* User Info */}
            <div className="p-6 flex flex-col items-center border-b border-stone-100">
                <div className="relative mb-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] bg-stone-100">
                        {user?.avatarUrl ? (
                            <img
                                src={user.avatarUrl}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-market-secondary flex items-center justify-center text-white font-bold text-3xl">
                                {user?.fullName?.charAt(0)?.toUpperCase() ?? "U"}
                            </div>
                        )}
                    </div>
                </div>
                <h2 className="text-base font-bold text-stone-900 text-center leading-tight">
                    {user?.fullName || "Người dùng"}
                </h2>
                <p className="text-stone-400 text-xs mt-0.5 text-center">{user?.email}</p>
            </div>

            {/* Navigation */}
            <nav className="p-3">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${isActive(item.path)
                                ? "bg-market-primary/8 text-market-primary"
                                : "text-stone-700 hover:bg-stone-50 hover:text-stone-900"
                            }`}
                    >
                        <span
                            className={`shrink-0 ${isActive(item.path) ? "text-market-primary" : "text-stone-500"
                                }`}
                        >
                            {item.icon}
                        </span>
                        {item.label}
                        {isActive(item.path) && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-market-primary shrink-0" />
                        )}
                    </button>
                ))}

                <div className="my-2 border-t border-stone-100" />

                {/* Action items */}
                {actionItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={item.action}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${item.isDestructive
                                ? "text-red-500 hover:bg-red-50 hover:text-red-600"
                                : "text-stone-700 hover:bg-stone-50 hover:text-stone-900"
                            }`}
                    >
                        <span
                            className={`shrink-0 ${item.isDestructive ? "text-red-400" : "text-stone-500"
                                }`}
                        >
                            {item.icon}
                        </span>
                        {item.label}
                    </button>
                ))}
            </nav>
        </div>
    );
};
