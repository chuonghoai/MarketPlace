import React, { useEffect, useState, useCallback } from 'react';
import { walletService } from '../../../features/wallet/services/wallet.service';
import type { WalletWithdrawal } from '../../../features/wallet/models/wallet.model';
import { useToast } from '../../../components/toast/toast';

export const AdminWithdrawalsPage: React.FC = () => {
  const { toast } = useToast();
  const [withdrawals, setWithdrawals] = useState<WalletWithdrawal[]>([]);
  const [totalPendingAmount, setTotalPendingAmount] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Modal complete
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WalletWithdrawal | null>(null);
  const [billProofUrl, setBillProofUrl] = useState<string>('');
  const [adminNote, setAdminNote] = useState<string>('');
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState<boolean>(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchWithdrawals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await walletService.adminGetWithdrawals(page, 20, statusFilter || undefined);
      if (res.success && res.data) {
        setWithdrawals(res.data.items);
        setTotal(res.data.total);
        setTotalPendingAmount(res.data.totalPendingAmount || 0);
      }
    } catch {
      toast('Không thể tải danh sách yêu cầu rút tiền', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, toast]);

  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

  const handleOpenComplete = (w: WalletWithdrawal) => {
    setSelectedWithdrawal(w);
    setBillProofUrl('');
    setAdminNote('');
    setIsCompleteModalOpen(true);
  };

  const handleOpenReject = (w: WalletWithdrawal) => {
    setSelectedWithdrawal(w);
    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  const handleConfirmComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWithdrawal) return;
    if (!billProofUrl.trim()) {
      toast('Vui lòng nhập đường dẫn/link ảnh hóa đơn chuyển khoản', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const res = await walletService.adminCompleteWithdrawal(
        selectedWithdrawal.id,
        billProofUrl.trim(),
        adminNote.trim() || undefined,
      );
      if (res.success) {
        toast('Đã hoàn tất yêu cầu rút tiền', 'success');
        setIsCompleteModalOpen(false);
        fetchWithdrawals();
      } else {
        toast(res.message || 'Lỗi khi hoàn tất', 'error');
      }
    } catch {
      toast('Lỗi khi duyệt rút tiền', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWithdrawal) return;
    if (!rejectReason.trim()) {
      toast('Vui lòng nhập lý do từ chối', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const res = await walletService.adminRejectWithdrawal(selectedWithdrawal.id, rejectReason.trim());
      if (res.success) {
        toast('Đã từ chối yêu cầu và hoàn lại số dư cho khách hàng', 'success');
        setIsRejectModalOpen(false);
        fetchWithdrawals();
      } else {
        toast(res.message || 'Lỗi khi từ chối', 'error');
      }
    } catch {
      toast('Lỗi khi từ chối yêu cầu rút tiền', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <span className="material-symbols-outlined text-sm">schedule</span>
            Chờ xử lý
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Đã hoàn thành
          </span>
        );
      case 'REJECTED':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-800">
            <span className="material-symbols-outlined text-sm">cancel</span>
            Đã từ chối
          </span>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Lora',serif] text-2xl font-bold text-stone-900 dark:text-stone-100">
            Quản lý yêu cầu rút tiền (UC18)
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Xử lý chuyển khoản ngân hàng thủ công và tải hóa đơn xác nhận
          </p>
        </div>
      </div>

      {/* Ràng buộc UC18: Card hiển thị tổng số tiền cần chuẩn bị của tất cả yêu cầu rút tiền */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Tổng số tiền cần chuẩn bị (Đang chờ duyệt)
            </span>
            <div className="font-['Lora',serif] text-3xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              {totalPendingAmount.toLocaleString('vi-VN')} ₫
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Bộ phận vận hành/kế toán chuẩn bị hạn mức tiền mặt để chuyển khoản cho khách hàng
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">Chờ xử lý</option>
            <option value="COMPLETED">Đã hoàn thành</option>
            <option value="REJECTED">Đã từ chối</option>
          </select>
          <button
            onClick={() => fetchWithdrawals()}
            className="p-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50 transition-colors"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-stone-400">Đang tải dữ liệu...</div>
        ) : withdrawals.length === 0 ? (
          <div className="p-12 text-center text-stone-400">Không có yêu cầu rút tiền nào</div>
        ) : (
          <div className="overflow-x-auto">
            <div className="px-4 py-2.5 bg-stone-50/50 dark:bg-stone-800/40 border-b border-stone-200 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400 font-medium">
              Tìm thấy {total} yêu cầu rút tiền
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 text-xs text-stone-500 uppercase font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Khách hàng / STK</th>
                  <th className="py-3.5 px-4">Ngân hàng</th>
                  <th className="py-3.5 px-4">Số tiền rút</th>
                  <th className="py-3.5 px-4">Trạng thái</th>
                  <th className="py-3.5 px-4">Ngày tạo</th>
                  <th className="py-3.5 px-4">Hóa đơn CK</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-semibold text-stone-900 dark:text-stone-100">
                        {w.accountHolder}
                      </div>
                      <div className="text-xs font-mono text-stone-500 mt-0.5">
                        {w.accountNumber}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-stone-800 dark:text-stone-200">{w.bankName}</span>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">
                      {Number(w.amount).toLocaleString('vi-VN')} ₫
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(w.status)}</td>
                    <td className="py-4 px-4 text-xs text-stone-500">
                      {new Date(w.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="py-4 px-4 text-xs">
                      {w.billProofUrl ? (
                        <a
                          href={w.billProofUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">visibility</span>
                          Xem bill
                        </a>
                      ) : (
                        <span className="text-stone-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {w.status === 'PENDING' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenComplete(w)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-1 shadow-xs"
                          >
                            <span className="material-symbols-outlined text-sm">upload_file</span>
                            Duyệt & Tải Bill
                          </button>
                          <button
                            onClick={() => handleOpenReject(w)}
                            className="px-2.5 py-1.5 rounded-lg border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          >
                            Từ chối
                          </button>
                        </div>
                      )}
                      {w.status === 'REJECTED' && w.adminNote && (
                        <span className="text-xs text-stone-500 italic max-w-[150px] truncate block" title={w.adminNote}>
                          Lý do: {w.adminNote}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Complete with Bill Proof (UC18 - Bước 4 & 5) */}
      {isCompleteModalOpen && selectedWithdrawal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <h3 className="font-['Lora',serif] text-lg font-bold text-stone-900 dark:text-stone-100">
              Xác nhận chuyển khoản & Đăng tải hóa đơn
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Sau khi chuyển khoản thủ công cho khách qua ngân hàng, nhân viên/admin cần đính kèm link ảnh bill giao dịch để hoàn tất yêu cầu.
            </p>

            <div className="bg-stone-50 dark:bg-stone-800 p-4 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Chủ tài khoản:</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">{selectedWithdrawal.accountHolder}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Số tài khoản:</span>
                <span className="font-mono font-bold text-stone-900 dark:text-stone-100">{selectedWithdrawal.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Ngân hàng:</span>
                <span className="font-medium text-stone-900 dark:text-stone-100">{selectedWithdrawal.bankName}</span>
              </div>
              <div className="flex justify-between border-t border-stone-200 dark:border-stone-700 pt-2 font-semibold">
                <span className="text-stone-700 dark:text-stone-300">Số tiền cần chuyển:</span>
                <span className="text-amber-600 dark:text-amber-400 font-mono text-sm">
                  {Number(selectedWithdrawal.amount).toLocaleString('vi-VN')} ₫
                </span>
              </div>
            </div>

            <form onSubmit={handleConfirmComplete} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase mb-1">
                  Đường dẫn ảnh hóa đơn / Bill Proof <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={billProofUrl}
                  onChange={(e) => setBillProofUrl(e.target.value)}
                  placeholder="https://res.cloudinary.com/... hoặc link ảnh bill"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase mb-1">
                  Ghi chú nội bộ
                </label>
                <input
                  type="text"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Ví dụ: Đã CK qua Internet Banking lúc 10:30"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsCompleteModalOpen(false)}
                  disabled={submitting}
                  className="px-4 py-2 text-sm rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={submitting || !billProofUrl.trim()}
                  className="px-5 py-2 text-sm font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  {submitting ? 'Đang lưu...' : 'Hoàn tất yêu cầu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Reject */}
      {isRejectModalOpen && selectedWithdrawal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <h3 className="font-['Lora',serif] text-lg font-bold text-red-600 dark:text-red-400">
              Từ chối yêu cầu rút tiền
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Số tiền {Number(selectedWithdrawal.amount).toLocaleString('vi-VN')} ₫ sẽ được hoàn trả lại vào ví điện tử của khách hàng.
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase mb-1">
                  Lý do từ chối <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Ví dụ: Sai số tài khoản ngân hàng, tên chủ tài khoản không khớp..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  disabled={submitting}
                  className="px-4 py-2 text-sm rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting || !rejectReason.trim()}
                  className="px-5 py-2 text-sm font-semibold rounded-xl text-white bg-red-600 hover:bg-red-700 transition-colors shadow-xs"
                >
                  {submitting ? 'Đang xử lý...' : 'Xác nhận từ chối'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
