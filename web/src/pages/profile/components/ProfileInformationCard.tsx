import type { User } from "../../../features/user/models/user.model";
import type { UpdateProfileRequest } from "../../../features/user/dto/updateProfile.type";

interface ProfileInformationCardProps {
    user: User | null;
    formData: UpdateProfileRequest;
    isEditMode: boolean;
    isSaving: boolean;
    onFieldChange: (field: keyof UpdateProfileRequest, value: string) => void;
    onEnterEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
}

const genderLabel = (gender?: string) => {
    if (gender === "male") return "Nam";
    if (gender === "female") return "Nữ";
    if (gender === "other") return "Khác";
    return "";
};

const formatDateDisplay = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
        return new Intl.DateTimeFormat("vi-VN").format(new Date(dateStr));
    } catch {
        return dateStr;
    }
};

export const ProfileInformationCard = ({
    user,
    formData,
    isEditMode,
    isSaving,
    onFieldChange,
    onEnterEdit,
    onSave,
    onCancel,
}: ProfileInformationCardProps) => {
    const labelClass = "block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5";
    const readonlyFieldClass =
        "h-11 px-4 flex items-center bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm font-medium select-none";
    const editableInputClass =
        "h-11 w-full px-4 bg-white border border-stone-300 rounded-xl text-stone-900 text-sm font-medium outline-none " +
        "focus-visible:ring-2 focus-visible:ring-market-primary/25 focus-visible:border-market-primary " +
        "transition-all placeholder:text-stone-400";
    const disabledInputClass =
        "h-11 w-full px-4 bg-stone-50 border border-stone-200 rounded-xl text-stone-400 text-sm font-medium " +
        "outline-none cursor-not-allowed";

    return (
        <div className="bg-white border border-border-subtle rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                <h2 className="font-['Lora',serif] text-lg font-bold text-stone-900">
                    Thông tin cá nhân
                </h2>
                {!isEditMode && (
                    <button
                        onClick={onEnterEdit}
                        className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-stone-200 text-sm font-semibold text-stone-700 hover:bg-stone-50 hover:border-stone-300 transition-all"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Chỉnh sửa
                    </button>
                )}
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <label className={labelClass}>Email</label>
                    <div className={readonlyFieldClass}>
                        <span className="truncate">{user?.email || "Chưa cập nhật"}</span>
                        <span className="ml-auto shrink-0 text-[10px] font-semibold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                            Không thể đổi
                        </span>
                    </div>
                </div>

                <div>
                    <label htmlFor="pi-fullname" className={labelClass}>Họ và tên</label>
                    {isEditMode ? (
                        <input
                            id="pi-fullname"
                            type="text"
                            value={formData.fullName ?? ""}
                            onChange={(e) => onFieldChange("fullName", e.target.value)}
                            placeholder="Nhập họ và tên"
                            disabled={isSaving}
                            className={isSaving ? disabledInputClass : editableInputClass}
                        />
                    ) : (
                        <div className={readonlyFieldClass}>
                            {formData.fullName || "Chưa cập nhật"}
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="pi-phone" className={labelClass}>Số điện thoại</label>
                    {isEditMode ? (
                        <input
                            id="pi-phone"
                            type="tel"
                            value={formData.phone ?? ""}
                            onChange={(e) => onFieldChange("phone", e.target.value)}
                            placeholder="Nhập số điện thoại"
                            disabled={isSaving}
                            className={isSaving ? disabledInputClass : editableInputClass}
                        />
                    ) : (
                        <div className={readonlyFieldClass}>
                            {formData.phone || "Chưa cập nhật"}
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="pi-dob" className={labelClass}>Ngày sinh</label>
                    {isEditMode ? (
                        <input
                            id="pi-dob"
                            type="date"
                            value={formData.dateOfBirth ?? ""}
                            onChange={(e) => onFieldChange("dateOfBirth", e.target.value)}
                            disabled={isSaving}
                            className={isSaving ? disabledInputClass : editableInputClass}
                        />
                    ) : (
                        <div className={readonlyFieldClass}>
                            {formData.dateOfBirth
                                ? formatDateDisplay(formData.dateOfBirth)
                                : "Chưa cập nhật"}
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="pi-gender" className={labelClass}>Giới tính</label>
                    {isEditMode ? (
                        <div className="relative">
                            <select
                                id="pi-gender"
                                value={formData.gender ?? ""}
                                onChange={(e) => onFieldChange("gender", e.target.value)}
                                disabled={isSaving}
                                className={
                                    (isSaving ? disabledInputClass : editableInputClass) +
                                    " appearance-none pr-10 cursor-pointer"
                                }
                            >
                                <option value="">Chọn giới tính</option>
                                <option value="male">Nam</option>
                                <option value="female">Nữ</option>
                                <option value="other">Khác</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    ) : (
                        <div className={readonlyFieldClass}>
                            {genderLabel(formData.gender) || "Chưa cập nhật"}
                        </div>
                    )}
                </div>
            </div>

            {isEditMode && (
                <div className="px-6 py-4 border-t border-stone-100 flex justify-end gap-3 bg-stone-50/60">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSaving}
                        className="h-10 px-5 text-sm font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 rounded-xl transition-colors disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={isSaving}
                        className="h-10 px-6 bg-market-primary text-white text-sm font-semibold rounded-xl hover:brightness-110 transition-all flex items-center gap-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSaving && (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        {isSaving ? "Đang lưu…" : "Lưu thay đổi"}
                    </button>
                </div>
            )}
        </div>
    );
};
