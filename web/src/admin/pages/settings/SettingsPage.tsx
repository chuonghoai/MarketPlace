import { useState } from 'react';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { DeviceManagement } from './components/DeviceManagement';

export const SettingsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSuccess = () => {
    setIsModalOpen(false);
    setSuccessMessage('Đổi mật khẩu thành công!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-ink">Cài đặt</h1>
          <p className="text-text-muted text-sm mt-1">Quản lý các thiết lập hệ thống và tài khoản của bạn</p>
        </div>
      </div>

      {successMessage && (
        <div className="bg-success/10 text-success p-4 rounded-lg flex items-center gap-2 border border-success/20">
          <span className="material-symbols-outlined">check_circle</span>
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Security Section */}
        <div className="bg-surface-card border border-border-subtle rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border-subtle">
            <div className="flex items-center gap-3 text-text-ink">
              <span className="material-symbols-outlined text-primary">security</span>
              <h2 className="text-lg font-bold">Bảo mật</h2>
            </div>
            <p className="text-text-muted text-sm mt-2">Bảo vệ tài khoản của bạn bằng cách cập nhật mật khẩu thường xuyên.</p>
          </div>
          <div className="p-6 bg-surface-container">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold bg-white border border-border-medium text-text-ink hover:bg-border-subtle transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">lock_reset</span>
              Đổi mật khẩu
            </button>
          </div>
        </div>

        {/* Devices Section */}
        <DeviceManagement />
      </div>

      {isModalOpen && (
        <ChangePasswordModal 
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};
