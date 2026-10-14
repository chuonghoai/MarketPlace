import { useEffect, useState } from 'react';
import { apiClient } from '../../../core/api/apiClient';
import type { ApiResponse } from '../../../core/api/apiResponse';
import { getDeviceId } from '../../../core/utils/device.util';
import { authService } from '../../../features/auth/services/auth.service';
import { useNavigate } from 'react-router-dom';

interface Device {
  id: string;
  deviceId: string;
  deviceName: string;
  isActive: boolean;
  lastLoginAt: string;
}

const DeviceManagementPage = () => {
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
    <div className="flex flex-col gap-6">
      <div className="bg-white border border-border-subtle rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center gap-3">
          <span className="text-market-primary">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </span>
          <div>
            <h2 className="font-['Lora',serif] text-lg font-bold text-stone-900">Thiết bị đăng nhập</h2>
            <p className="text-stone-500 text-sm mt-0.5">Quản lý các thiết bị đã đăng nhập vào tài khoản của bạn.</p>
          </div>
        </div>
        
        <div className="p-6 bg-stone-50/30">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="w-6 h-6 border-2 border-market-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : devices.length === 0 ? (
            <p className="text-stone-500 text-center py-8">Không có dữ liệu thiết bị</p>
          ) : (
            <div className="space-y-4">
              {devices.map((device) => {
                const isCurrent = device.deviceId === currentDeviceId;
                return (
                  <div key={device.id} className="flex items-center justify-between p-4 bg-white border border-stone-200 rounded-xl hover:border-stone-300 transition-colors shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${device.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-100 text-stone-400'}`}>
                        {device.deviceName?.toLowerCase().includes('mobile') ? (
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-stone-900">
                            {device.deviceName || 'Thiết bị không xác định'}
                          </p>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-market-primary/10 text-market-primary uppercase tracking-wide">
                              Hiện tại
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-stone-500 mt-1">
                          Hoạt động lần cuối: {new Date(device.lastLoginAt).toLocaleString('vi-VN')}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className={`w-2 h-2 rounded-full ${device.isActive ? 'bg-emerald-500' : 'bg-stone-300'}`}></span>
                          <span className={`text-xs font-semibold ${device.isActive ? 'text-emerald-600' : 'text-stone-500'}`}>
                            {device.isActive ? 'Đang đăng nhập' : 'Đã đăng xuất'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {device.isActive && (
                      <button
                        onClick={() => handleRevoke(device.deviceId)}
                        className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
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
    </div>
  );
};

export default DeviceManagementPage;
