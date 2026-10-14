import { type Staff } from '../../../../features/staff/services/staff.service';

interface Props {
  staff: Staff;
  onClose: () => void;
  onEdit: () => void;
}

export const StaffDetailModal = ({ staff, onClose, onEdit }: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-surface-card w-full max-w-md rounded-2xl overflow-hidden shadow-xl border border-border-subtle">
        <div className="flex justify-between items-center p-6 border-b border-border-subtle">
          <h2 className="text-xl font-bold text-text-ink">Chi tiết nhân viên</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-ink transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-border-medium shrink-0">
              {staff.user?.avatarUrl ? (
                <img src={staff.user.avatarUrl} alt={staff.user.fullName} className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined w-full h-full flex items-center justify-center text-text-muted text-3xl">person</span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-ink">{staff.user?.fullName}</h3>
              <p className="text-text-muted text-sm">{staff.user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2 border-b border-border-subtle pb-4">
              <span className="text-text-muted text-sm">Số điện thoại:</span>
              <span className="col-span-2 text-text-ink font-medium">{staff.user?.phone}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 border-b border-border-subtle pb-4">
              <span className="text-text-muted text-sm">Mức lương:</span>
              <span className="col-span-2 text-text-ink font-medium">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(staff.salary || 0)}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 pb-2">
              <span className="text-text-muted text-sm">Ngày gia nhập:</span>
              <span className="col-span-2 text-text-ink font-medium">
                {new Date(staff.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border-subtle bg-surface-container flex gap-3 justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-semibold text-text-ink hover:bg-border-subtle transition-colors"
          >
            Đóng
          </button>
          <button 
            onClick={onEdit}
            className="px-4 py-2 rounded-lg font-semibold bg-primary text-white hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  );
};
