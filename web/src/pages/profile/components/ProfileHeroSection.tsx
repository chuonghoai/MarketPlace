import type { User } from "../../../features/user/models/user.model";

interface ProfileHeroSectionProps {
    user: User | null;
}

export const ProfileHeroSection = ({ user }: ProfileHeroSectionProps) => {
    const avatarInitial = user?.fullName?.charAt(0)?.toUpperCase() ?? "U";

    return (
        <div className="relative w-full overflow-hidden bg-linear-to-br from-stone-100 via-stone-50 to-white border-b border-stone-200 hidden md:block">
            <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-market-primary/5 pointer-events-none" />
            <div className="absolute -bottom-8 left-1/3 w-48 h-48 rounded-full bg-market-secondary/5 pointer-events-none" />

            <div className="max-w-400 mx-auto px-6 lg:px-10 py-10">
                <div className="flex items-center gap-6">
                    {/* Avatar */}
                    <div className="shrink-0 w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] bg-stone-100">
                        {user?.avatarUrl ? (
                            <img
                                src={user.avatarUrl}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-market-secondary flex items-center justify-center text-white font-bold text-4xl select-none">
                                {avatarInitial}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0">
                        <h1 className="font-['Lora',serif] text-2xl lg:text-3xl font-bold text-stone-900 leading-tight truncate">
                            {user?.fullName || "Người dùng"}
                        </h1>
                        <p className="text-stone-500 text-sm mt-1 truncate">{user?.email}</p>
                        <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                            {user?.role && (
                                <span className="inline-flex items-center h-6 px-2.5 rounded-full text-[11px] font-semibold bg-market-primary/10 text-market-primary border border-market-primary/20">
                                    {user.role === "ADMIN"
                                        ? "Quản trị viên"
                                        : user.role === "STAFF"
                                            ? "Nhân viên"
                                            : "Khách hàng"}
                                </span>
                            )}
                            <span className="inline-flex items-center h-6 px-2.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-500 border border-stone-200">
                                Hồ sơ cá nhân
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
