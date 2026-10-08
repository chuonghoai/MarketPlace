import React, { useEffect, useState, useRef } from 'react';
import { supportService } from '../../features/support/services/support.service';
import { supportSocketService } from '../../features/support/services/supportSocket.service';
import {
  ESupportRequestStatus,
  type SupportRequest,
} from '../../features/support/models/support.model';
import { tSupport } from '../../features/support/constants/supportL10n';

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

export const UserSupportPage: React.FC = () => {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');

  // Create Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createTitle, setCreateTitle] = useState('');
  const [createContent, setCreateContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Reply state
  const [replyContent, setReplyContent] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
      const res = await supportService.getMyRequests({
        status: filterStatus || undefined,
        pageSize: 50,
      });
      setRequests(res.data || []);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || tSupport('errorOccurred'));
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Real-time WebSocket connection for selected ticket
  useEffect(() => {
    if (!selectedRequest?.id) return;

    const requestId = selectedRequest.id;
    supportSocketService.joinRoom(requestId);

    const unsubscribeMessage = supportSocketService.onNewMessage((newMsg) => {
      if (newMsg.requestId === requestId) {
        setSelectedRequest((prev) => {
          if (!prev || prev.id !== requestId) return prev;
          const exists = prev.messages?.some((m) => m.id === newMsg.id);
          if (exists) return prev;
          return {
            ...prev,
            messages: [...(prev.messages || []), newMsg],
          };
        });
        setTimeout(scrollToBottom, 50);
      }
    });

    const unsubscribeUpdate = supportSocketService.onRequestUpdated((updatedReq) => {
      if (updatedReq.id === requestId) {
        setSelectedRequest((prev) => {
          if (!prev || prev.id !== requestId) return prev;
          return {
            ...prev,
            ...updatedReq,
          };
        });
        fetchRequests();
      }
    });

    return () => {
      unsubscribeMessage();
      unsubscribeUpdate();
      supportSocketService.leaveRoom(requestId);
    };
  }, [selectedRequest?.id, fetchRequests]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedRequest?.messages]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createTitle.trim() || !createContent.trim()) return;

    setSubmitting(true);
    try {
      const res = await supportService.create({
        title: createTitle.trim(),
        content: createContent.trim(),
      });
      setIsCreateOpen(false);
      setCreateTitle('');
      setCreateContent('');
      await fetchRequests();
      if (res.data) {
        fetchDetail(res.data.id);
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      alert(msg || tSupport('errorOccurred'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !replyContent.trim()) return;

    const content = replyContent.trim();
    setSendingReply(true);
    try {
      // Ưu tiên gửi tin nhắn qua WebSocket
      let sentMessage;
      try {
        sentMessage = await supportSocketService.sendMessage(selectedRequest.id, content);
      } catch (wsErr) {
        console.warn('[UserSupport] WebSocket failed, falling back to REST API:', wsErr);
        const res = await supportService.addMessage(selectedRequest.id, { content });
        sentMessage = res.data;
      }

      if (sentMessage) {
        setSelectedRequest((prev) => {
          if (!prev || prev.id !== selectedRequest.id) return prev;
          const exists = prev.messages?.some((m) => m.id === sentMessage.id);
          if (exists) return prev;
          return {
            ...prev,
            messages: [...(prev.messages || []), sentMessage],
          };
        });
      }

      setReplyContent('');
      setTimeout(scrollToBottom, 50);
      await fetchRequests();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      alert(msg || tSupport('errorOccurred'));
    } finally {
      setSendingReply(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!selectedRequest) return;
    if (!window.confirm(tSupport('confirmCloseRequest'))) return;

    try {
      await supportService.close(selectedRequest.id);
      await fetchDetail(selectedRequest.id);
      await fetchRequests();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      alert(msg || tSupport('errorOccurred'));
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
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-subtle dark:border-stone-800 pb-5">
        <div>
          <h1 className="font-headline text-2xl sm:text-3xl font-bold text-text-ink dark:text-stone-100">
            {tSupport('title')}
          </h1>
          <p className="font-body text-sm text-text-muted dark:text-stone-400 mt-1">
            {tSupport('subtitle')}
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="btn-primary px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>{tSupport('createRequest')}</span>
        </button>
      </div>

      {/* Filter and Content layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: List of requests */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-body text-xs font-bold uppercase tracking-wider text-text-muted dark:text-stone-400">
              {tSupport('myRequests')} ({requests.length})
            </span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="font-body text-xs bg-surface-card dark:bg-stone-900 border border-border-subtle dark:border-stone-800 rounded-lg px-2.5 py-1.5 text-text-ink dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-primary-container"
            >
              <option value="">{tSupport('allStatus')}</option>
              <option value={ESupportRequestStatus.OPEN}>{tSupport('open')}</option>
              <option value={ESupportRequestStatus.ASSIGNED}>{tSupport('assigned')}</option>
              <option value={ESupportRequestStatus.IN_PROGRESS}>{tSupport('inProgress')}</option>
              <option value={ESupportRequestStatus.RESOLVED}>{tSupport('resolved')}</option>
              <option value={ESupportRequestStatus.CLOSED}>{tSupport('closed')}</option>
            </select>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-20 bg-surface-container dark:bg-stone-800/50 animate-pulse rounded-xl"
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
                contact_support
              </span>
              <p className="font-body text-sm text-text-muted dark:text-stone-400">
                {tSupport('emptyList')}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
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
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-subtle/50 dark:border-stone-800/80 text-[11px] text-text-muted dark:text-stone-400 font-mono">
                      <span>{new Date(req.createdAt).toLocaleDateString('vi-VN')}</span>
                      <span>
                        {req.assignedStaff?.user?.fullName || tSupport('unassigned')}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Selected Ticket Detail & Messages */}
        <div className="lg:col-span-2 bg-surface-card dark:bg-stone-900 border border-border-subtle dark:border-stone-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between min-h-[500px]">
          {selectedRequest ? (
            <div className="flex flex-col h-full space-y-4">
              {/* Ticket Top bar */}
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
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>{tSupport('realtimeConnected')}</span>
                    </span>
                  </div>
                  <h2 className="font-headline text-lg sm:text-xl font-bold text-text-ink dark:text-stone-100 mt-1">
                    {selectedRequest.title}
                  </h2>
                </div>

                {selectedRequest.status !== ESupportRequestStatus.CLOSED && (
                  <button
                    onClick={handleCloseTicket}
                    className="text-xs text-text-muted hover:text-error dark:hover:text-red-400 px-3 py-1.5 rounded-lg border border-border-subtle dark:border-stone-700 hover:border-red-300 transition-colors self-start sm:self-auto cursor-pointer"
                  >
                    {tSupport('closeRequest')}
                  </button>
                )}
              </div>

              {/* Message thread */}
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 max-h-[420px]">
                {selectedRequest.messages?.map((msg) => {
                  const isRequester = msg.senderId === selectedRequest.requesterId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isRequester ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-2 mb-1 text-[11px] text-text-muted dark:text-stone-400 font-body">
                        <span className="font-semibold text-text-ink dark:text-stone-300">
                          {isRequester
                            ? tSupport('you')
                            : msg.sender?.fullName || tSupport('assignedStaff')}
                        </span>
                        <span>{new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div
                        className={`p-3.5 rounded-2xl max-w-[85%] text-sm font-body leading-relaxed ${
                          isRequester
                            ? 'bg-primary-container text-on-primary-container rounded-tr-xs'
                            : 'bg-surface-container dark:bg-stone-800 text-text-ink dark:text-stone-100 rounded-tl-xs border border-border-subtle dark:border-stone-700'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message input */}
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
                  {tSupport('ticketClosedNotice')}
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-text-muted dark:text-stone-500">
              <span className="material-symbols-outlined text-5xl mb-2 opacity-40">
                chat_bubble_outline
              </span>
              <p className="font-body text-sm">
                {tSupport('selectRequestToView')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal tạo yêu cầu hỗ trợ mới */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-surface-card dark:bg-stone-900 border border-border-subtle dark:border-stone-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle dark:border-stone-800">
              <h3 className="font-headline text-lg font-bold text-text-ink dark:text-stone-100">
                {tSupport('createRequest')}
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-text-muted hover:text-text-ink dark:hover:text-stone-200 p-1 rounded-md"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-stone-400 mb-1.5">
                  {tSupport('requestTitle')} *
                </label>
                <input
                  type="text"
                  required
                  value={createTitle}
                  onChange={(e) => setCreateTitle(e.target.value)}
                  placeholder={tSupport('requestTitlePlaceholder')}
                  className="w-full input-field px-3.5 py-2 text-sm rounded-lg dark:bg-stone-800 dark:text-stone-100 dark:border-stone-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-stone-400 mb-1.5">
                  {tSupport('requestContent')} *
                </label>
                <textarea
                  rows={4}
                  required
                  value={createContent}
                  onChange={(e) => setCreateContent(e.target.value)}
                  placeholder={tSupport('requestContentPlaceholder')}
                  className="w-full input-field px-3.5 py-2 text-sm rounded-lg dark:bg-stone-800 dark:text-stone-100 dark:border-stone-700"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-subtle dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-sm text-text-muted dark:text-stone-400 hover:bg-surface-container dark:hover:bg-stone-800 rounded-lg"
                >
                  {tSupport('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary px-5 py-2 text-sm font-semibold rounded-lg disabled:opacity-50"
                >
                  {submitting ? tSupport('loading') : tSupport('confirm')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSupportPage;
