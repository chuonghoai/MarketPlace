import { useState } from 'react';
import { userService } from '../../../../features/user/services/user.service';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export const ChangePasswordModal = ({ onClose, onSuccess }: Props) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleShowPassword = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Vui lòng điền đầy đủ các trường.');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);
    try {
      const res = await userService.changePassword(
        formData.oldPassword,
        formData.newPassword,
        formData.confirmPassword
      );
      if (res.success) {
        onSuccess();
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại';
      setError(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-surface-card w-full max-w-md rounded-2xl overflow-hidden shadow-xl border border-border-subtle">
        <div className="flex justify-between items-center p-6 border-b border-border-subtle">
          <h2 className="text-xl font-bold text-text-ink">Đổi mật khẩu</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-ink transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {error && (
              <div className="bg-error/10 text-error p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-1 relative">
              <label className="text-sm font-semibold text-text-ink">Mật khẩu hiện tại *</label>
              <div className="relative">
                <input
                  type={showPassword.old ? 'text' : 'password'}
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu hiện tại"
                  className="w-full px-4 py-2 pr-10 rounded-lg border border-border-subtle bg-surface-container focus:outline-none focus:border-primary text-text-ink transition-colors"
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('old')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-ink"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword.old ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-1 relative">
              <label className="text-sm font-semibold text-text-ink">Mật khẩu mới *</label>
              <div className="relative">
                <input
                  type={showPassword.new ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu mới"
                  className="w-full px-4 py-2 pr-10 rounded-lg border border-border-subtle bg-surface-container focus:outline-none focus:border-primary text-text-ink transition-colors"
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('new')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-ink"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword.new ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-1 relative">
              <label className="text-sm font-semibold text-text-ink">Xác nhận mật khẩu mới *</label>
              <div className="relative">
                <input
                  type={showPassword.confirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full px-4 py-2 pr-10 rounded-lg border border-border-subtle bg-surface-container focus:outline-none focus:border-primary text-text-ink transition-colors"
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('confirm')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-ink"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword.confirm ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-border-subtle bg-surface-container flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg font-semibold text-text-ink hover:bg-border-subtle transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg font-semibold bg-primary text-white hover:bg-primary-dark transition-colors flex items-center justify-center min-w-30 disabled:opacity-50"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
              ) : (
                'Lưu thay đổi'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
