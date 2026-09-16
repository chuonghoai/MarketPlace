import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { userStorageService } from "../../../features/user/services/userStorage.service";
import { EUserRole, type User } from "../../../features/user/models/user.model";
import { authService } from "../../../features/auth/services/auth.service";

export const Sidebar = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadUser = () => {
            const currentUser = userStorageService.getUser();
            setUser(currentUser);
        }

        loadUser();
        window.addEventListener("auth_changed", loadUser);

        return () => {
            window.removeEventListener("auth_changed", loadUser);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Lỗi đăng xuất:", error);
        } finally {
            navigate('/login');
        }
    };

    const navItems = [
        { path: "/admin", icon: "dashboard", label: "Tổng quan" },
        { path: "/admin/orders", icon: "shopping_cart", label: "Đơn hàng" },
        { path: "/admin/products", icon: "inventory_2", label: "Sản phẩm" },
        { path: "/admin/vouchers", icon: "confirmation_number", label: "Voucher" },
        { path: "/admin/staff", icon: "people", label: "Nhân viên" },
        { path: "/admin/inventory", icon: "warehouse", label: "Kho hàng" },
        { path: "/admin/settings", icon: "settings", label: "Cài đặt" },
    ];

    return (
        <>
            <button
                className="md:hidden fixed top-4 left-4 z-45 w-11 h-11 flex items-center justify-center focus:outline-none bg-transparent border-none"
                onClick={() => setIsMobileOpen(true)}
                aria-label="Mở menu"
            >
                <span className="material-symbols-outlined text-text-ink text-[28px] drop-shadow-md">menu</span>
            </button>

            {isMobileOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
                    onClick={() => setIsMobileOpen(false)}
                    aria-hidden="true"
                />
            )}

            <nav className={`bg-background-page text-primary flex flex-col h-full py-6 px-4 fixed left-0 top-0 w-[70vw] max-w-70 md:max-w-none md:w-64 border-r-[1.5px] border-border-subtle transition-transform duration-300 ease-in-out z-50 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="mb-8 px-2 flex items-center gap-2">
                <h1 className="font-headline text-2xl italic text-text-ink font-bold">MarketNest</h1>
            </div>
            <p className="font-body text-xs text-text-muted mb-2 px-2 uppercase tracking-widest font-semibold">Artisan Dashboard</p>
            <ul className="flex flex-col gap-1 flex-1 overflow-y-auto no-scrollbar">
                {navItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path) && (item.path !== '/admin' || location.pathname === '/admin' || location.pathname === '/admin/overview');
                    return (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                onClick={() => setIsMobileOpen(false)}
                                className={`flex items-center gap-4 px-4 py-2 rounded-lg hover:-translate-y-0.5 transition-transform duration-200 ${isActive ? 'text-primary-container bg-surface-container font-bold' : 'text-text-muted hover:text-text-ink'}`}
                            >
                                <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
                                <span className="font-body text-sm font-semibold">{item.label}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>

            <div className="mt-auto pt-4 border-t-[1.5px] border-border-subtle relative" ref={menuRef}>
                {/* Pop up menu */}
                <div
                    className={`absolute bottom-full left-0 w-full mb-2 bg-surface-card border-[1.5px] border-border-subtle rounded-lg shadow-lg overflow-hidden z-50 flex flex-col transform transition-all duration-300 ease-in-out origin-bottom ${isMenuOpen
                        ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
                        }`}
                >
                    <button className="flex items-center gap-3 px-4 py-2.5 text-text-muted hover:text-text-ink hover:bg-surface-container transition-colors w-full text-left">
                        <span className="material-symbols-outlined text-[18px]">help</span>
                        <span className="font-body text-sm font-semibold">Hỗ trợ</span>
                    </button>
                    <button className="flex items-center gap-3 px-4 py-2.5 text-text-muted hover:text-text-ink hover:bg-surface-container transition-colors w-full text-left">
                        <span className="material-symbols-outlined text-[18px]">description</span>
                        <span className="font-body text-sm font-semibold">Tài liệu</span>
                    </button>
                    <Link
                        to="/admin/settings"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-text-muted hover:text-text-ink hover:bg-surface-container transition-colors w-full text-left"
                    >
                        <span className="material-symbols-outlined text-[18px]">settings</span>
                        <span className="font-body text-sm font-semibold">Cài đặt</span>
                    </Link>

                    <div className="w-full h-px bg-border-subtle my-1"></div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-error hover:bg-[#fee2e2] transition-colors w-full text-left"
                    >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        <span className="font-body text-sm font-semibold">Đăng xuất</span>
                    </button>
                </div>

                {/* Avatar */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="w-full flex items-center justify-between px-4 py-2 hover:bg-surface-container rounded-lg transition-colors cursor-pointer text-left focus:outline-none"
                >
                    <div className="flex items-center gap-4 overflow-hidden">
                        <img
                            alt="User profile"
                            className="w-8 h-8 rounded-full border-[1.5px] border-border-medium object-cover shrink-0"
                            src={user?.avatarUrl || ""}
                        />
                        <div className="overflow-hidden">
                            <span className="block font-body text-sm font-semibold text-text-ink truncate">{user?.fullName}</span>
                            <p className="block font-body text-[10px] text-text-muted truncate">{user?.role === EUserRole.ADMIN ? "Quản trị viên" : "Nhân viên"}</p>
                        </div>
                    </div>
                    <span
                        className={`material-symbols-outlined text-text-muted text-[20px] shrink-0 transform transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : 'rotate-0'
                            }`}
                    >
                        expand_less
                    </span>
                </button>
            </div>
        </nav>
        </>
    );
};