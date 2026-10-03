import React, { useEffect, useState } from 'react';
import { supportService } from '../../../features/support/services/support.service';
import { staffService, type Staff } from '../../../features/staff/services/staff.service';
import { userStorageService } from '../../../features/user/services/userStorage.service';
import { EUserRole } from '../../../features/user/models/user.model';
import {
  ESupportRequestStatus,
  type SupportRequest,
} from '../../../features/support/models/support.model';
import { tSupport } from '../../../features/support/constants/supportL10n';

const STATUS_BADGE_STYLE: Record<ESupportRequestStatus, string> = {
  [ESupportRequestStatus.OPEN]:
    'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
  [ESupportRequestStatus.ASSIGNED]:
    'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800',
  [ESupportRequestStatus.IN_PROGRESS]:
    'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
  [ESupportRequestStatus.RESOLVED]:
    'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
  [ESupportRequestStatus.CLOSED]:
    'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 border border-stone-200 dark:border-stone-700',
};

export const AdminSupportPage: React.FC = () => {
  const currentUser = userStorageService.getUser();
  const isAdmin = currentUser?.role === EUserRole.ADMIN;

  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');

  // Assign Staff Modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [assigning, setAssigning] = useState(false);

  // Message reply
  const [replyContent, setReplyContent] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const fetchDetail = React.useCallback(async (id: string) => {
    try {
      const res = await supportService.getDetail(id);
      setSelectedRequest(res.data);
    } catch (err: unknown) {
      console.error(err);
    }
  }, []);

  const fetchRequests = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let res;
      if (isAdmin) {
        res = await supportService.getAllRequests({
          status: filterStatus || undefined,
          pageSize: 50,
        });
      } else {
        res = await supportService.getAssignedRequests({
          status: filterStatus || undefined,
          pageSize: 50,
        });
      }
      setRequests(res.data || []);
      if (selectedRequest) {
        const updated = (res.data || []).find((r) => r.id === selectedRequest.id);
        if (updated) {
          fetchDetail(updated.id);
        }
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || tSupport('errorOccurred'));
    } finally {
      setLoading(false);
    }
  }, [filterStatus, isAdmin, selectedRequest, fetchDetail]);

  const loadStaffs = async () => {
    try {
      const res = await staffService.getAll(1, 100);
      setStaffList(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedStaffId(res.data[0].id);
      }
    } catch (err: unknown) {
      console.error(err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRequests();
      if (isAdmin) {
        loadStaffs();
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchRequests, isAdmin]);

  const handleAssignStaff = async () => {
    if (!selectedRequest || !selectedStaffId) return;

    setAssigning(true);
    try {
      await supportService.assignStaff(selectedRequest.id, { staffId: selectedStaffId });
      setIsAssignModalOpen(false);
      await fetchDetail(selectedRequest.id);
      await fetchRequests();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      alert(msg || tSupport('errorOccurred'));
    } finally {
      setAssigning(false);
    }
  };

  const handleResolve = async () => {
    if (!selectedRequest) return;
    try {
      await supportService.resolve(selectedRequest.id);
      await fetchDetail(selectedRequest.id);
      await fetchRequests();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      alert(msg || tSupport('errorOccurred'));
    }
  };

  const handleClose = async () => {
    if (!selectedRequest) return;
    if (!window.confirm('Bạn có chắc chắn muốn đóng yêu cầu hỗ trợ này?')) return;
    try {
      await supportService.close(selectedRequest.id);
      await fetchDetail(selectedRequest.id);
      await fetchRequests();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      alert(msg || tSupport('errorOccurred'));
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !replyContent.trim()) return;

    setSendingReply(true);
    try {
      await supportService.addMessage(selectedRequest.id, { content: replyContent.trim() });
      setReplyContent('');
      await fetchDetail(selectedRequest.id);
      await fetchRequests();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      alert(msg || tSupport('errorOccurred'));
    } finally {
      setSendingReply(false);
    }
  };

  const getStatusLabel = (status: ESupportRequestStatus) => {
    switch (status) {
      case ESupportRequestStatus.OPEN:
        return tSupport('open');
      case ESupportRequestStatus.ASSIGNED:
        return tSupport('assigned');
      case ESupportRequestStatus.IN_PROGRESS:
        return tSupport('inProgress');
      case ESupportRequestStatus.RESOLVED:
        return tSupport('resolved');
      case ESupportRequestStatus.CLOSED:
        return tSupport('closed');
      default:
        return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline text-2xl md:text-3xl font-bold text-text-ink dark:text-stone-100">
            {isAdmin ? tSupport('allRequests') : tSupport('assignedRequests')}
          </h1>
          <p className="font-body text-sm text-text-muted dark:text-stone-400 mt-1">
            {isAdmin
              ? 'Quản lý, phân công và kiểm soát chất lượng phản hồi hỗ trợ khách hàng'
              : 'Xử lý các yêu cầu hỗ trợ được phân công cho bạn, giải đáp thắc mắc và đảm bảo SLA'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="font-body text-xs bg-surface-card dark:bg-stone-900 border border-border-subtle dark:border-stone-800 rounded-lg px-3 py-2 text-text-ink dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-primary-container"
          >
            <option value="">{tSupport('allStatus')}</option>
            <option value={ESupportRequestStatus.OPEN}>{tSupport('open')}</option>
            <option value={ESupportRequestStatus.ASSIGNED}>{tSupport('assigned')}</option>
            <option value={ESupportRequestStatus.IN_PROGRESS}>{tSupport('inProgress')}</option>
            <option value={ESupportRequestStatus.RESOLVED}>{tSupport('resolved')}</option>
            <option value={ESupportRequestStatus.CLOSED}>{tSupport('closed')}</option>
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket List */}
        <div className="lg:col-span-1 space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-24 bg-surface-container dark:bg-stone-800/50 animate-pulse rounded-xl"
                />
              ))}
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-error rounded-xl text-xs">
              {error}
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-surface-card dark:bg-stone-900 border border-border-subtle dark:border-stone-800 rounded-xl p-8 text-center">
              <span className="material-symbols-outlined text-4xl text-text-muted dark:text-stone-500 mb-2">
                inbox
              </span>
              <p className="font-body text-sm text-text-muted dark:text-stone-400">
                {tSupport('emptyList')}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
              {requests.map((req) => {
                const isSelected = selectedRequest?.id === req.id;
                return (
                  <button
                    key={req.id}
                    onClick={() => fetchDetail(req.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-primary-container bg-surface-container-low dark:bg-stone-800/90 shadow-xs'
                        : 'border-border-subtle dark:border-stone-800 bg-surface-card dark:bg-stone-900 hover:border-border-medium dark:hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-body text-sm font-semibold text-text-ink dark:text-stone-100 line-clamp-1">
                        {req.title}
                      </h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          STATUS_BADGE_STYLE[req.status]
                        }`}
                      >
                        {getStatusLabel(req.status)}
                      </span>
                    </div>

                    <p className="font-body text-xs text-text-muted dark:text-stone-400 line-clamp-1 mt-1">
                      {req.content}
                    </p>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border-subtle/60 dark:border-stone-800/80 text-[11px] text-text-muted dark:text-stone-400">
                      <span>{req.requester?.fullName || req.requester?.email || 'User'}</span>
                      <span className="font-semibold text-primary-container">
                        {req.assignedStaff?.user?.fullName || tSupport('unassigned')}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Ticket Chat & Management Details */}
        <div className="lg:col-span-2 bg-surface-card dark:bg-stone-900 border border-border-subtle dark:border-stone-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between min-h-[550px]">
          {selectedRequest ? (
            <div className="flex flex-col h-full space-y-4">
              {/* Header / Actions toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-subtle dark:border-stone-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        STATUS_BADGE_STYLE[selectedRequest.status]
                      }`}
                    >
                      {getStatusLabel(selectedRequest.status)}
                    </span>
                    <span className="font-mono text-xs text-text-muted dark:text-stone-400">
                      #{selectedRequest.id.slice(0, 8)}
                    </span>
                  </div>
                  <h2 className="font-headline text-lg sm:text-xl font-bold text-text-ink dark:text-stone-100 mt-1">
                    {selectedRequest.title}
                  </h2>
                  <div className="flex items-center gap-4 text-xs text-text-muted dark:text-stone-400 mt-1">
                    <span>
                      {tSupport('requester')}:{' '}
                      <strong className="text-text-ink dark:text-stone-200">
                        {selectedRequest.requester?.fullName || selectedRequest.requester?.email}
                      </strong>
                    </span>
                    <span>
                      {tSupport('assignedStaff')}:{' '}
                      <strong className="text-primary-container">
                        {selectedRequest.assignedStaff?.user?.fullName || tSupport('unassigned')}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  {isAdmin && selectedRequest.status !== ESupportRequestStatus.CLOSED && (
                    <button
                      onClick={() => setIsAssignModalOpen(true)}
                      className="btn-secondary px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">person_add</span>
                      <span>{tSupport('assignStaff')}</span>
                    </button>
                  )}

                  {selectedRequest.status !== ESupportRequestStatus.RESOLVED &&
                    selectedRequest.status !== ESupportRequestStatus.CLOSED && (
                      <button
                        onClick={handleResolve}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        <span>{tSupport('resolveRequest')}</span>
                      </button>
                    )}

                  {selectedRequest.status !== ESupportRequestStatus.CLOSED && (
                    <button
                      onClick={handleClose}
                      className="border border-border-subtle dark:border-stone-700 hover:border-red-400 text-text-muted hover:text-error px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      {tSupport('closeRequest')}
                    </button>
                  )}
                </div>
              </div>

              {/* Conversation messages */}
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 max-h-[400px]">
                {selectedRequest.messages?.map((msg) => {
                  const isCustomer = msg.senderId === selectedRequest.requesterId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-center gap-2 mb-1 text-[11px] text-text-muted dark:text-stone-400 font-body">
                        <span className="font-semibold text-text-ink dark:text-stone-300">
                          {isCustomer
                            ? selectedRequest.requester?.fullName || 'Khách hàng'
                            : msg.sender?.fullName || 'Nhân viên hỗ trợ'}
                        </span>
                        <span>
                          {new Date(msg.createdAt).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div
                        className={`p-3.5 rounded-2xl max-w-[85%] text-sm font-body leading-relaxed ${
                          isCustomer
                            ? 'bg-surface-container dark:bg-stone-800 text-text-ink dark:text-stone-100 rounded-tl-xs border border-border-subtle dark:border-stone-700'
                            : 'bg-primary-container text-on-primary-container rounded-tr-xs'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Box */}
              {selectedRequest.status !== ESupportRequestStatus.CLOSED ? (
                <form
                  onSubmit={handleSendReply}
                  className="flex items-center gap-2 pt-3 border-t border-border-subtle dark:border-stone-800"
                >
                  <input
                    type="text"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder={tSupport('replyPlaceholder')}
                    className="flex-1 input-field px-4 py-2.5 text-sm dark:bg-stone-800 dark:text-stone-100 dark:border-stone-700 rounded-xl"
                  />
                  <button
                    type="submit"
                    disabled={sendingReply || !replyContent.trim()}
                    className="btn-primary px-4 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <span>{tSupport('sendReply')}</span>
                    <span className="material-symbols-outlined text-[16px]">send</span>
                  </button>
                </form>
              ) : (
                <div className="p-3 bg-stone-50 dark:bg-stone-800/50 text-text-muted dark:text-stone-400 text-xs rounded-xl text-center">
                  Phiếu hỗ trợ đã đóng.
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-text-muted dark:text-stone-500">
              <span className="material-symbols-outlined text-5xl mb-2 opacity-40">
                support_agent
              </span>
              <p className="font-body text-sm">
                Chọn một yêu cầu hỗ trợ bên trái để xem trao đổi và thao tác
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal gán nhân viên */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-surface-card dark:bg-stone-900 border border-border-subtle dark:border-stone-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle dark:border-stone-800">
              <h3 className="font-headline text-lg font-bold text-text-ink dark:text-stone-100">
                {tSupport('assignStaff')}
              </h3>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="text-text-muted hover:text-text-ink dark:hover:text-stone-200"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-stone-400">
                {tSupport('selectStaff')}
              </label>
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="w-full input-field px-3.5 py-2.5 text-sm rounded-lg dark:bg-stone-800 dark:text-stone-100 dark:border-stone-700"
              >
                {staffList.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.user?.fullName} ({st.user?.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-subtle dark:border-stone-800">
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="px-4 py-2 text-sm text-text-muted dark:text-stone-400 hover:bg-surface-container dark:hover:bg-stone-800 rounded-lg"
              >
                {tSupport('cancel')}
              </button>
              <button
                onClick={handleAssignStaff}
                disabled={assigning || !selectedStaffId}
                className="btn-primary px-5 py-2 text-sm font-semibold rounded-lg disabled:opacity-50"
              >
                {assigning ? tSupport('loading') : tSupport('confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSupportPage;
