import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { userStorageService } from "../../../features/user/services/userStorage.service";
import { EUserRole, type User } from "../../../features/user/models/user.model";
import { useToast } from "../../toast/toast";
import { authService } from "../../../features/auth/services/auth.service";
import { cartService } from "../../../features/cart/services/cart.service";

export const Header = () => {
  const [user, setUser] = useState<User | null>(null);

  const [cartCount, setCartCount] = useState<number>(cartService.getCartCount());

  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const currentSearchParam = new URLSearchParams(location.search).get("search") || "";
  const [searchTerm, setSearchTerm] = useState(currentSearchParam);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => setIsMobileMenuOpen(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  // Cập nhật state nếu URL bị thay đổi từ bên ngoài (như xoá filter)
  useEffect(() => {
    setSearchTerm(currentSearchParam);
  }, [currentSearchParam]);

  // Debounce search tự động sau 500ms
  useEffect(() => {
    if (searchTerm === currentSearchParam) return;

    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const val = searchTerm.trim();
      if (val) {
        params.set("search", val);
      } else {
        params.delete("search");
      }
      params.set("page", "1");
      navigate(`/?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, currentSearchParam, navigate]);

  useEffect(() => {
    const loadUserAndCart = () => {
      const currentUser = userStorageService.getUser();
      setUser(currentUser);

      if (currentUser) {
        cartService.syncCartCount();
      } else {
        setCartCount(0);
      }
    };

    loadUserAndCart();

    window.addEventListener("auth_changed", loadUserAndCart);

    const unsubscribeCart = cartService.subscribe((newCount) => {
      setCartCount(newCount);
    });
    return () => {
      unsubscribeCart();
      window.removeEventListener("auth_changed", loadUserAndCart);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    toast("Đăng xuất thành công", "info");
    navigate("/login");
  };

  const handleNavigateProfile = () => {
    if (!user) return;
    const navPath = user.role === EUserRole.ADMIN ? "/admin" : "/profile";
    navigate(navPath);
  };

  const handleNavigateOrder = () => {
    if (!user) return;
    const navPath = user.role === EUserRole.ADMIN ? "/admin/orders" : "/profile/order/tracking";
    navigate(navPath);
  };

  return (
    <header className="bg-white border-b border-border-subtle sticky top-0 z-50">
      <div className="max-w-400 mx-auto px-4 md:px-8 h-18 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="font-['Lora',serif] text-[24px] font-bold text-text-ink flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-market-secondary flex items-center justify-center text-white text-[14px] italic shadow-none">MN</div>
          <span className="hidden md:inline">MarketNest</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-120 mx-3 md:mx-8 relative">
          <input
            type="text"
            placeholder="Tìm kiếm tác phẩm thủ công, nghệ nhân..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const val = e.currentTarget.value.trim();
                const params = new URLSearchParams(window.location.search);
                if (val) {
                  params.set("search", val);
                } else {
                  params.delete("search");
                }
                params.set("page", "1");
                navigate(`/?${params.toString()}`);
              }
            }}
            className="w-full bg-market-background border-[1.5px] border-border-medium rounded-sm h-10.5 px-4 pr-12 text-[15px] font-['Open_Sans',sans-serif] outline-none focus:border-market-primary focus:ring-[3px] focus:ring-market-primary/15 transition-all text-text-ink placeholder:text-[#A8A29E]"
          />
          <button 
            onClick={() => {
               const val = searchTerm.trim();
               const params = new URLSearchParams(window.location.search);
               if (val) {
                 params.set("search", val);
               } else {
                 params.delete("search");
               }
               params.set("page", "1");
               navigate(`/?${params.toString()}`);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-[#A8A29E] hover:text-market-primary transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-3 md:gap-6">
          <nav className="hidden lg:flex gap-6 text-[15px] font-semibold text-[#57534E]">
            <Link to="/" className="hover:text-market-primary transition-colors">Khám phá</Link>
            <Link to="/categories" className="hover:text-market-primary transition-colors">Danh mục</Link>
          </nav>

          <div className="flex items-center gap-3 md:gap-5 md:border-l border-border-subtle md:pl-6">
            {/* Cart button */}
            <Link
              to="/cart"
              onClick={(e) => {
                const currentUser = userStorageService.getUser();
                if (!currentUser) {
                  e.preventDefault();
                  toast("Bạn cần đăng nhập để sử dụng chức năng này", "warning");
                  navigate("/login");
                }
              }}
              className={`relative text-[#57534E] hover:text-market-primary transition-colors ${!user ? 'hidden md:block' : ''}`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>

              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-market-primary text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* User info || login button */}
            {user ? (
              <div 
                className="relative group flex items-center gap-3 cursor-pointer py-2"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.innerWidth < 768) {
                    setIsMobileMenuOpen(!isMobileMenuOpen);
                  }
                }}
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-9 h-9 rounded-full object-cover border-[1.5px] border-border-medium group-hover:border-market-primary transition-colors"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-market-secondary flex items-center justify-center text-white font-bold text-[14px]">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                <button onClick={handleNavigateProfile} className="hidden md:block">
                  <span className="text-[14px] font-semibold text-text-ink group-hover:text-market-primary transition-colors cursor-pointer">
                    {user.fullName}
                  </span>
                </button>

                <div className={`absolute top-full right-0 mt-1 w-50 bg-white border border-border-medium rounded-sm transition-all duration-200 z-50 shadow-[0_8px_24px_rgba(28,25,23,0.1)] ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible md:group-hover:opacity-100 md:group-hover:visible'}`}>
                  <div className="flex flex-col py-1">
                    {/* Button profile */}
                    <button onClick={handleNavigateProfile} className="cursor-pointer flex items-center h-12 px-4 text-[14px] font-medium text-text-ink hover:bg-market-background transition-colors">
                      Thông tin cá nhân
                    </button>

                    {/* Button order */}
                    <button onClick={handleNavigateOrder} className="cursor-pointer flex items-center h-12 px-4 text-[14px] font-medium text-text-ink hover:bg-market-background transition-colors border-t border-border-subtle">
                      Đơn hàng
                    </button>

                    {/* Button setting */}
                    <Link to="/settings" className="cursor-pointer flex items-center h-12 px-4 text-[14px] font-medium text-text-ink hover:bg-market-background transition-colors border-t border-border-subtle">
                      Cài đặt
                    </Link>

                    {/* Button logout */}
                    <button onClick={handleLogout} className="cursor-pointer flex items-center w-full h-12 px-4 text-[14px] font-semibold text-market-error hover:bg-market-background transition-colors border-t border-border-subtle text-left">
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-[13px] md:text-[14px] font-semibold text-market-primary border-[1.5px] border-market-primary px-3 py-1.5 md:px-4 rounded-sm hover:bg-market-background transition-colors whitespace-nowrap">
                Đăng nhập
              </Link>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};