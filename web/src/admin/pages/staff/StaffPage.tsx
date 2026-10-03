import { useEffect, useState } from 'react';
import { staffService, type Staff } from '../../../features/staff/services/staff.service';
import { StaffDetailModal } from './components/StaffDetailModal';
import { StaffFormModal } from './components/StaffFormModal';

export const StaffPage = () => {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const fetchStaffs = async () => {
    setLoading(true);
    try {
      const res = await staffService.getAll(page, 20, search);
      setStaffs(res.data);
      if (res.pagination) {
        setTotalPages(res.pagination.totalPages);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchStaffs();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [search, page]);

  const handleRowClick = (staff: Staff) => {
    setSelectedStaff(staff);
    setIsDetailOpen(true);
  };

  const handleAddNew = () => {
    setSelectedStaff(null);
    setIsFormOpen(true);
  };

  const handleEdit = (staff: Staff) => {
    setSelectedStaff(staff);
    setIsDetailOpen(false);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchStaffs();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-ink">Quản lý nhân viên</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">search</span>
            <input 
              type="text" 
              placeholder="Tìm kiếm nhân viên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-border-subtle bg-surface-container focus:outline-none focus:border-primary text-text-ink transition-colors"
            />
          </div>
          <button 
            onClick={handleAddNew}
            className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary-dark transition-colors"
          >
            <span className="material-symbols-outlined">add</span>
            Thêm mới
          </button>
        </div>
      </div>

      <div className="bg-surface-card rounded-xl border border-border-subtle overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-text-muted">Đang tải dữ liệu...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-surface-container border-b border-border-subtle">
              <tr>
                <th className="p-4 text-sm font-semibold text-text-muted w-16">STT</th>
                <th className="p-4 text-sm font-semibold text-text-muted">Nhân viên</th>
                <th className="p-4 text-sm font-semibold text-text-muted">Liên hệ</th>
                <th className="p-4 text-sm font-semibold text-text-muted">Mức lương</th>
                <th className="p-4 text-sm font-semibold text-text-muted">Ngày gia nhập</th>
              </tr>
            </thead>
            <tbody>
              {staffs.map((staff, index) => (
                <tr 
                  key={staff.id} 
                  onClick={() => handleRowClick(staff)}
                  className="border-b border-border-subtle hover:bg-surface-container/50 cursor-pointer transition-colors"
                >
                  <td className="p-4 text-text-muted">{(page - 1) * 20 + index + 1}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-border-medium overflow-hidden shrink-0">
                        {staff.user?.avatarUrl ? (
                          <img src={staff.user.avatarUrl} alt={staff.user.fullName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined w-full h-full flex items-center justify-center text-text-muted">person</span>
                        )}
                      </div>
                      <span className="font-semibold text-text-ink">{staff.user?.fullName}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-text-ink">{staff.user?.email}</span>
                      <span className="text-sm text-text-muted">{staff.user?.phone}</span>
                    </div>
                  </td>
                  <td className="p-4 text-text-ink font-medium">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(staff.salary || 0)}
                  </td>
                  <td className="p-4 text-text-muted">
                    {new Date(staff.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))}
              {staffs.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-muted">Không tìm thấy nhân viên nào</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="w-10 h-10 rounded-lg flex items-center justify-center border border-border-subtle disabled:opacity-50 text-text-ink"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <span className="flex items-center justify-center px-4 font-semibold text-text-ink">Trang {page} / {totalPages}</span>
          <button 
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="w-10 h-10 rounded-lg flex items-center justify-center border border-border-subtle disabled:opacity-50 text-text-ink"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      )}

      {isDetailOpen && selectedStaff && (
        <StaffDetailModal 
          staff={selectedStaff} 
          onClose={() => setIsDetailOpen(false)}
          onEdit={() => handleEdit(selectedStaff)}
        />
      )}

      {isFormOpen && (
        <StaffFormModal
          staff={selectedStaff}
          onClose={() => setIsFormOpen(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};
