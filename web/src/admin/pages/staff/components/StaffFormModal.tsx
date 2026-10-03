import { useState } from 'react';
import { staffService, type Staff, type CreateStaffDto, type UpdateStaffDto } from '../../../../features/staff/services/staff.service';

interface Props {
  staff: Staff | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const StaffFormModal = ({ staff, onClose, onSuccess }: Props) => {
  const isEdit = !!staff;
  const [formData, setFormData] = useState({
    fullName: staff?.user?.fullName || '',
    email: staff?.user?.email || '',
    phone: staff?.user?.phone || '',
    salary: staff?.salary || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.fullName || !formData.email || !formData.phone || !formData.salary) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        const updateData: UpdateStaffDto = {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          salary: Number(formData.salary)
        };
        await staffService.update(staff.id, updateData);
      } else {
        const createData: CreateStaffDto = {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          salary: Number(formData.salary)
        };
        await staffService.create(createData);
      }
      onSuccess();
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
          <h2 className="text-xl font-bold text-text-ink">{isEdit ? 'Sửa thông tin nhân viên' : 'Thêm nhân viên mới'}</h2>
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
            
            <div className="space-y-1">
              <label className="text-sm font-semibold text-text-ink">Họ và tên *</label>
              <input 
                type="text" 
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                className="w-full px-4 py-2 rounded-lg border border-border-subtle bg-surface-container focus:outline-none focus:border-primary text-text-ink transition-colors"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-semibold text-text-ink">Email *</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập địa chỉ email"
                className="w-full px-4 py-2 rounded-lg border border-border-subtle bg-surface-container focus:outline-none focus:border-primary text-text-ink transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-text-ink">Số điện thoại *</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                className="w-full px-4 py-2 rounded-lg border border-border-subtle bg-surface-container focus:outline-none focus:border-primary text-text-ink transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-text-ink">Mức lương *</label>
              <input 
                type="number" 
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                min="0"
                placeholder="Nhập mức lương (VNĐ)"
                className="w-full px-4 py-2 rounded-lg border border-border-subtle bg-surface-container focus:outline-none focus:border-primary text-text-ink transition-colors"
              />
            </div>

            {!isEdit && (
              <p className="text-xs text-text-muted mt-2">
                * Mật khẩu sẽ được hệ thống tạo ngẫu nhiên và gửi vào email của nhân viên.
              </p>
            )}
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
              className="px-4 py-2 rounded-lg font-semibold bg-primary text-white hover:bg-primary-dark transition-colors flex items-center justify-center min-w-25 disabled:opacity-50"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
              ) : (
                isEdit ? 'Lưu' : 'Thêm'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
