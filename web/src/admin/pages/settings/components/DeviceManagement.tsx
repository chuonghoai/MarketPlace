import { useEffect, useState } from 'react';
import { apiClient } from '../../../../core/api/apiClient';
import type { ApiResponse } from '../../../../core/api/apiResponse';
import { getDeviceId } from '../../../../core/utils/device.util';
import { authService } from '../../../../features/auth/services/auth.service';
import { useNavigate } from 'react-router-dom';

interface Device {
  id: string;
  deviceId: string;
  deviceName: string;
  isActive: boolean;
  lastLoginAt: string;
}

export const DeviceManagement = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const currentDeviceId = getDeviceId();
  const navigate = useNavigate();

  const fetchDevices = async () => {
    try {
      const res = await apiClient.get<ApiResponse<Device[]>>('/auth/devices');
      if (res.success) {
        setDevices(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch devices', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleRevoke = async (deviceId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn đăng xuất khỏi thiết bị này?')) return;
    try {
      const res = await apiClient.post<ApiResponse<null>>(`/auth/devices/${deviceId}/revoke`);
      if (res.success) {
        if (deviceId === currentDeviceId) {
          // Revoked current device, logout
          await authService.logout();
          navigate('/login');
        } else {
          fetchDevices();
        }
      }
    } catch (error) {
      console.error('Failed to revoke device', error);
      alert('Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  return (
    <div className="bg-surface-card border border-border-subtle rounded-2xl overflow-hidden col-span-full">
      <div className="p-6 border-b border-border-subtle">
        <div className="flex items-center gap-3 text-text-ink">
          <span className="material-symbols-outlined text-primary">devices</span>
          <h2 className="text-lg font-bold">Thiết bị đăng nhập</h2>
        </div>
        <p className="text-text-muted text-sm mt-2">Quản lý các thiết bị đã đăng nhập vào tài khoản của bạn.</p>
      </div>
      <div className="p-6 bg-surface-container">
        {loading ? (
          <div className="flex justify-center p-4">
            <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
          </div>
        ) : devices.length === 0 ? (
          <p className="text-text-muted text-center">Không có dữ liệu thiết bị</p>
        ) : (
          <div className="space-y-4">
            {devices.map((device) => {
              const isCurrent = device.deviceId === currentDeviceId;
              return (
                <div key={device.id} className="flex items-center justify-between p-4 bg-surface-card border border-border-subtle rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${device.isActive ? 'bg-success/10 text-success' : 'bg-border-subtle text-text-muted'}`}>
                      <span className="material-symbols-outlined">
                        {device.deviceName?.toLowerCase().includes('mobile') ? 'smartphone' : 'computer'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-text-ink">
                          {device.deviceName || 'Thiết bị không xác định'}
                        </p>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase">
                            Hiện tại
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-text-muted mt-1">
                        Hoạt động lần cuối: {new Date(device.lastLoginAt).toLocaleString('vi-VN')}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className={`w-2 h-2 rounded-full ${device.isActive ? 'bg-success' : 'bg-border-medium'}`}></span>
                        <span className={`text-xs font-semibold ${device.isActive ? 'text-success' : 'text-text-muted'}`}>
                          {device.isActive ? 'Đang đăng nhập' : 'Đã đăng xuất'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {device.isActive && (
                    <button
                      onClick={() => handleRevoke(device.deviceId)}
                      className="px-4 py-2 text-sm font-semibold text-error hover:bg-error/10 rounded-lg transition-colors border border-error/20"
                    >
                      Đăng xuất
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
