import { useState } from "react";
import { userService } from "../../../features/user/services/user.service";
import { useToast } from "../../../components/toast/toast";

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ChangePasswordModal = ({ isOpen, onClose }: ChangePasswordModalProps) => {
    const { toast } = useToast();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    const handleClose = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setError("");
        onClose();
    };

    const handleSave = async () => {
        setError("");
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("Vui lòng điền đầy đủ thông tin.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            return;
        }
        if (newPassword.length < 6) {
            setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
            return;
        }
        setIsSaving(true);
        try {
            await userService.changePassword(currentPassword, newPassword, confirmPassword);
            toast("Đổi mật khẩu thành công", "success");
        } catch (err: any) {
            setError(err.data?.message || err.response?.data?.message || err.message || "Có lỗi xảy ra");
            return;
        } finally {
            setIsSaving(false);
        }
        handleClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-surface-card card-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-text-ink">Đổi mật khẩu</h3>
                    <button
                        onClick={handleClose}
                        disabled={isSaving}
                        className="text-text-muted hover:text-text-ink transition-colors disabled:opacity-50 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-low cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="cp-current" className="text-sm font-medium text-text-ink">Mật khẩu hiện tại</label>
                        <input
                            id="cp-current"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Nhập mật khẩu hiện tại"
                            disabled={isSaving}
                            className="input-field h-11 px-4 rounded-lg text-sm text-text-ink placeholder:text-text-muted/60 transition-all disabled:opacity-60"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="cp-new" className="text-sm font-medium text-text-ink">Mật khẩu mới</label>
                        <input
                            id="cp-new"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Nhập mật khẩu mới"
                            disabled={isSaving}
                            className="input-field h-11 px-4 rounded-lg text-sm text-text-ink placeholder:text-text-muted/60 transition-all disabled:opacity-60"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="cp-confirm" className="text-sm font-medium text-text-ink">Xác nhận mật khẩu mới</label>
                        <input
                            id="cp-confirm"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Nhập lại mật khẩu mới"
                            disabled={isSaving}
                            className="input-field h-11 px-4 rounded-lg text-sm text-text-ink placeholder:text-text-muted/60 transition-all disabled:opacity-60"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                            {error}
                        </p>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-border-subtle flex justify-end gap-3 bg-surface-container-low/50">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSaving}
                        className="btn-secondary h-10 px-5 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="btn-primary h-10 px-6 text-sm font-semibold rounded-lg hover:brightness-110 transition-all flex items-center gap-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isSaving && (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        {isSaving ? "Đang lưu…" : "Lưu"}
                    </button>
                </div>
            </div>
        </div>
    );
};
