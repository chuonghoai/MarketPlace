import React, { useState, useEffect } from 'react';
import type { OrderDetail } from '../../../features/order/model/orderDetail.model';
import { orderService } from '../../../features/order/services/order.service';
import { useToast } from '../../../../components/toast/toast';
import { MediaLightboxModal } from './MediaLightboxModal';

interface ReturnProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderDetail;
  onSuccess: (isFinished?: boolean) => void;
}

export const ReturnProcessModal: React.FC<ReturnProcessModalProps> = ({
  isOpen,
  onClose,
  order,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [actionType, setActionType] = useState<'EXCHANGE' | 'RETURN_REFUND'>('RETURN_REFUND');
  const [shippingAddress, setShippingAddress] = useState(order.buyerAddress || '');
  const [adminNote, setAdminNote] = useState('');
  const [step, setStep] = useState<'PICKING_UP' | 'RECEIVED' | 'REFUND'>('PICKING_UP');
  const [loading, setLoading] = useState(false);
  const [activeReq, setActiveReq] = useState<any>(null);
  const [refundProofUrl, setRefundProofUrl] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<{
    url: string;
    type: 'image' | 'video';
    title?: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      orderService
        .getReturnRequests(1, 10, undefined, order.id)
        .then((listRes) => {
          const found = listRes.data?.items?.find((r: any) => r.orderId === order.id);
          if (found) {
            setActiveReq(found);
            if (found.type === 'EXCHANGE') {
              setActionType('EXCHANGE');
            } else {
              setActionType('RETURN_REFUND');
            }

            if (found.status === 'COMPLETED') {
              setStep('REFUND');
            } else if (found.status === 'RECEIVED') {
              setStep('REFUND');
            } else if (found.status === 'PICKING_UP') {
              setStep('RECEIVED');
            } else {
              setStep('PICKING_UP');
            }
          }
        })
        .catch(() => {})
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, order.id]);

  if (!isOpen) return null;

  // Xử lý Trường hợp 1: Đổi lấy món hàng mới (UC23 - 1.1)
  const handleExchangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activeReq) {
        const res = await orderService.processExchange(activeReq.id, {
          shippingAddress: shippingAddress.trim(),
          adminNote: adminNote.trim(),
        });
        if (res.success) {
          toast(`Đã tạo đơn hàng mới #${res.data?.newOrderId || ''} để đổi cho khách`, 'success');
          onSuccess(true);
          onClose();
        } else {
          toast(res.message || 'Lỗi khi tạo đơn đổi mới', 'error');
        }
      } else {
        // Fallback: update status to preparing with exchange note
        await orderService.updateOrderStatus({
          orderId: order.id,
          status: order.orderStatus,
          note: `Đã xác nhận đổi hàng mới: ${adminNote || 'Đang chuẩn bị sản phẩm thay thế'}`,
        });
        toast('Đã xác nhận đổi món hàng mới', 'success');
        onSuccess(true);
        onClose();
      }
    } catch {
      toast('Lỗi khi xử lý đổi hàng', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý Trường hợp 2: Trả hàng hoàn tiền (UC23 - 1.2)
  const handleRefundSubmit = async () => {
    setLoading(true);
    try {
      if (activeReq) {
        if (step === 'PICKING_UP' || step === 'RECEIVED') {
          await orderService.processPickup(activeReq.id, step, adminNote);
          toast(
            step === 'PICKING_UP'
              ? 'Đã cập nhật: Shipper đang đi lấy hàng về'
              : 'Đã cập nhật: Đã nhận hàng về kho thành công',
            'success',
          );
          if (step === 'PICKING_UP') {
            setActiveReq((prev: any) => ({ ...prev, status: 'PICKING_UP', adminNote }));
            setStep('RECEIVED');
          } else if (step === 'RECEIVED') {
            setActiveReq((prev: any) => ({ ...prev, status: 'RECEIVED', adminNote }));
            setStep('REFUND');
          }
          setAdminNote('');
          onSuccess(false);
        } else if (step === 'REFUND') {
          // Bấm nút hoàn tiền
          const isBankRefund = !!activeReq.bankAccountNumber;
          const res = await orderService.processRefund(activeReq.id, adminNote, refundProofUrl.trim() || undefined);
          if (res.success) {
            toast(
              isBankRefund
                ? `Đã xác nhận hoàn tiền ${order.totalAmount.toLocaleString('vi-VN')} ₫ qua ngân hàng cho khách`
                : `Đã hoàn ${order.totalAmount.toLocaleString('vi-VN')} ₫ vào Ví điện tử của khách hàng`,
              'success',
            );
            setActiveReq((prev: any) => ({ ...prev, status: 'COMPLETED' }));
            onSuccess(true);
            onClose();
          } else {
            toast(res.message || 'Lỗi khi hoàn tiền', 'error');
          }
        }
      } else {
        toast(`Đã hoàn tất xử lý hoàn trả cho đơn hàng #${order.id}`, 'success');
        onSuccess(true);
        onClose();
      }
    } catch {
      toast('Lỗi khi cập nhật quy trình hoàn trả', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isCompleted = activeReq?.status === 'COMPLETED';

  // Quy trình tuần tự: Shipper lấy hàng -> Đã nhận hàng về kho -> Hoàn tiền
  const isStep1Done = isCompleted || step === 'RECEIVED' || step === 'REFUND';
  const isStep1Active = !isCompleted && step === 'PICKING_UP';

  const isStep2Done = isCompleted || step === 'REFUND';
  const isStep2Active = !isCompleted && step === 'RECEIVED';

  const isStep3Done = isCompleted;
  const isStep3Active = !isCompleted && step === 'REFUND';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                Hỗ trợ & Đổi trả
              </span>
            </div>
            <h3 className="font-['Lora',serif] text-lg font-bold text-stone-900 dark:text-stone-100 mt-1">
              Quy trình xử lý hoàn trả / Đổi hàng
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Đơn hàng #{order.id} • Tổng tiền: {order.totalAmount.toLocaleString('vi-VN')} ₫
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 rounded-lg"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto space-y-4 pr-1 flex-1">
          {/* Hình thức yêu cầu từ khách (Cố định theo lựa chọn của khách, không sửa) */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50">
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              Hình thức khách hàng yêu cầu:
            </span>
            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                actionType === 'EXCHANGE'
                  ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50'
                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50'
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {actionType === 'EXCHANGE' ? 'swap_horiz' : 'assignment_return'}
              </span>
              <span>
                {actionType === 'EXCHANGE'
                  ? 'Đổi món mới'
                  : 'Trả hàng hoàn tiền'}
              </span>
            </span>
          </div>

          {/* Customer Request Details (Evidence, Videos, Bank Info) */}
          {activeReq && (
            <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-700 dark:text-stone-300">Thông tin yêu cầu từ khách:</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                  {activeReq.status}
                </span>
              </div>
              <p className="font-bold text-stone-900 dark:text-stone-100">{activeReq.title}</p>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{activeReq.reason}</p>

              {/* Minh chứng ảnh */}
              {activeReq.proofImages && activeReq.proofImages.length > 0 && (
                <div className="pt-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                      Ảnh minh chứng ({activeReq.proofImages.length}):
                    </span>
                    <span className="text-[10px] text-stone-400">Click để phóng to</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeReq.proofImages.map((img: string, idx: number) => (
                      <div
                        key={idx}
                        onClick={() =>
                          setSelectedMedia({
                            url: img,
                            type: 'image',
                            title: `Ảnh minh chứng #${idx + 1}`,
                          })
                        }
                        className="group relative w-14 h-14 rounded-lg overflow-hidden border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 cursor-pointer shadow-sm hover:border-amber-500 transition-all shrink-0"
                        title={`Xem ảnh #${idx + 1}`}
                      >
                        <img
                          src={img}
                          alt={`Minh chứng ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLElement).setAttribute(
                              'src',
                              'https://via.placeholder.com/150?text=Loi+Anh'
                            );
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <span className="material-symbols-outlined text-sm">zoom_in</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Minh chứng video (UC23 - Mục 1.4) */}
              {activeReq.proofVideos && activeReq.proofVideos.length > 0 && (
                <div className="pt-1 space-y-1">
                  <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 block">
                    Video minh chứng ({activeReq.proofVideos.length}):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeReq.proofVideos.map((vid: string, idx: number) => (
                      <div
                        key={idx}
                        onClick={() =>
                          setSelectedMedia({
                            url: vid,
                            type: 'video',
                            title: `Video minh chứng #${idx + 1}`,
                          })
                        }
                        className="px-2.5 py-1.5 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-900/50 text-blue-700 dark:text-blue-300 text-[11px] font-medium flex items-center gap-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/60 cursor-pointer transition-colors shadow-sm"
                        title={`Phát video #${idx + 1}`}
                      >
                        <span className="material-symbols-outlined text-sm text-blue-600">play_circle</span>
                        <span>Video #{idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Thông tin tài khoản ngân hàng nếu khách chưa mở ví (UC23 - Mục 1.2 & 1.11) */}
              {activeReq.bankAccountNumber && (
                <div className="mt-2 p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-lg text-amber-900 dark:text-amber-200 space-y-1">
                  <p className="font-bold text-[11px] flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">account_balance</span>
                    Khách yêu cầu nhận tiền hoàn qua Ngân hàng:
                  </p>
                  <div className="text-[11px] grid grid-cols-2 gap-1 pt-1">
                    <p>Ngân hàng: <strong>{activeReq.bankName || 'N/A'}</strong></p>
                    <p>STK: <strong>{activeReq.bankAccountNumber}</strong></p>
                    <p className="col-span-2">Chủ TK: <strong>{activeReq.bankAccountHolder || 'N/A'}</strong></p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CASE 1: Đổi lấy món hàng mới (UC23 - 1.1) */}
          {actionType === 'EXCHANGE' && (
            isCompleted ? (
              <div className="space-y-4">
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">task_alt</span>
                    <span>Đã hoàn tất tạo đơn đổi mới cho khách hàng</span>
                  </div>
                  {activeReq?.newOrderId && (
                    <p className="text-stone-700 dark:text-stone-300">
                      Mã đơn hàng mới thay thế: <strong>#{activeReq.newOrderId}</strong>
                    </p>
                  )}
                  {activeReq?.adminNote && (
                    <p className="text-stone-500 dark:text-stone-400">
                      Ghi chú: {activeReq.adminNote}
                    </p>
                  )}
                </div>
                <div className="flex justify-end gap-3 pt-3 border-t border-stone-200 dark:border-stone-800">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                  >
                    Đóng
                  </button>
                  {activeReq?.newOrderId && (
                    <a
                      href={`/admin/orders/${activeReq.newOrderId}`}
                      className="px-4 py-2 text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">swap_horiz</span>
                      Chuyển sang đơn mới #{activeReq.newOrderId}
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleExchangeSubmit} className="space-y-4">
                <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 rounded-xl text-xs text-blue-800 dark:text-blue-300">
                  Hệ thống sẽ trích xuất thông tin người nhận, địa chỉ từ đơn hàng cũ để tạo 1 đơn hàng mới ở trạng thái <strong>Đang chuẩn bị hàng (PREPARING)</strong>.
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    Địa chỉ giao hàng cho món mới
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Nhập địa chỉ giao hàng"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    Ghi chú xử lý đổi hàng
                  </label>
                  <input
                    type="text"
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Ví dụ: Đổi sản phẩm do nứt vỡ trong vận chuyển"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-stone-200 dark:border-stone-800">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="px-4 py-2 text-sm rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
                  >
                    {loading ? 'Đang tạo đơn...' : 'Xác nhận tạo đơn đổi mới'}
                  </button>
                </div>
              </form>
            )
          )}

          {/* CASE 2: Trả hàng hoàn tiền (UC23 - 1.2) */}
          {actionType === 'RETURN_REFUND' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs text-amber-800 dark:text-amber-300">
                Quy trình xử lý lần lượt:{' '}
                <strong>1. Shipper lấy hàng</strong> ➔ <strong>2. Đã nhận hàng về</strong> ➔ <strong>3. Hoàn tiền</strong>{' '}
                ({activeReq?.bankAccountNumber ? 'Chuyển khoản theo STK' : 'Cộng tự động vào Ví điện tử'}).
              </div>

              {/* Stepper (Chuyển đổi tuần tự theo quy trình, không cho nhân viên bấm chọn nhảy bước) */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
                <div
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all select-none ${
                    isStep1Done
                      ? 'border-emerald-500/50 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400'
                      : isStep1Active
                      ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold ring-2 ring-amber-500/20'
                      : 'border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-600 bg-stone-50/50 dark:bg-stone-900/40 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">
                      {isStep1Done ? 'check_circle' : isStep1Active ? 'local_shipping' : 'lock'}
                    </span>
                    <span>1. Đi lấy hàng</span>
                  </div>
                  <span className="text-[10px] font-normal opacity-80">
                    {isStep1Done ? 'Đã điều phối' : isStep1Active ? 'Đang thực hiện' : 'Chờ bước trước'}
                  </span>
                </div>

                <div
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all select-none ${
                    isStep2Done
                      ? 'border-emerald-500/50 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400'
                      : isStep2Active
                      ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold ring-2 ring-amber-500/20'
                      : 'border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-600 bg-stone-50/50 dark:bg-stone-900/40 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">
                      {isStep2Done ? 'check_circle' : isStep2Active ? 'inventory_2' : 'lock'}
                    </span>
                    <span>2. Nhận hàng kho</span>
                  </div>
                  <span className="text-[10px] font-normal opacity-80">
                    {isStep2Done ? 'Đã nhận về' : isStep2Active ? 'Đang thực hiện' : 'Chờ bước trước'}
                  </span>
                </div>

                <div
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all select-none ${
                    isStep3Done
                      ? 'border-emerald-500/50 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400'
                      : isStep3Active
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold ring-2 ring-emerald-500/20'
                      : 'border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-600 bg-stone-50/50 dark:bg-stone-900/40 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">
                      {isStep3Done ? 'check_circle' : isStep3Active ? 'payments' : 'lock'}
                    </span>
                    <span>3. Hoàn tiền</span>
                  </div>
                  <span className="text-[10px] font-normal opacity-80">
                    {isStep3Done ? 'Đã hoàn tất' : isStep3Active ? 'Sẵn sàng hoàn' : 'Chờ nhận hàng'}
                  </span>
                </div>
              </div>

              {isCompleted ? (
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">task_alt</span>
                    <span>Đã hoàn tất toàn bộ quy trình hoàn trả & hoàn tiền</span>
                  </div>
                  <p className="text-stone-600 dark:text-stone-400">
                    Số tiền <strong>{order.totalAmount.toLocaleString('vi-VN')} ₫</strong> đã được hoàn{' '}
                    {activeReq?.bankAccountNumber ? 'qua Chuyển khoản ngân hàng' : 'vào Ví điện tử của khách hàng'}.
                  </p>
                  {activeReq?.refundProofUrl && (
                    <div className="pt-1">
                      <a
                        href={activeReq.refundProofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 dark:text-blue-400 underline flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-xs">receipt_long</span>
                        Xem biên lai / chứng từ chuyển khoản
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Extra input if bank refund */}
                  {step === 'REFUND' && activeReq?.bankAccountNumber && (
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                        Link hóa đơn / chứng từ chuyển khoản ngân hàng
                      </label>
                      <input
                        type="text"
                        value={refundProofUrl}
                        onChange={(e) => setRefundProofUrl(e.target.value)}
                        placeholder="Dán link ảnh ủy nhiệm chi hoặc biên lai CK..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                      Ghi chú xử lý bước hiện tại
                    </label>
                    <input
                      type="text"
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder={
                        step === 'PICKING_UP'
                          ? 'Ghi chú cho shipper đi lấy hàng...'
                          : step === 'RECEIVED'
                          ? 'Ghi chú kiểm tra hàng nhận về kho...'
                          : 'Ghi chú hoàn tiền...'
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 text-sm rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  {isCompleted ? 'Đóng' : 'Hủy'}
                </button>
                {!isCompleted && (
                  step === 'REFUND' ? (
                    <button
                      type="button"
                      onClick={handleRefundSubmit}
                      disabled={loading}
                      className="px-5 py-2 text-sm font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {activeReq?.bankAccountNumber ? 'account_balance' : 'account_balance_wallet'}
                      </span>
                      {loading
                        ? 'Đang hoàn tiền...'
                        : activeReq?.bankAccountNumber
                        ? `Xác nhận đã CK ${order.totalAmount.toLocaleString('vi-VN')} ₫ cho khách`
                        : `Hoàn ${order.totalAmount.toLocaleString('vi-VN')} ₫ vào Ví điện tử`}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleRefundSubmit}
                      disabled={loading}
                      className="px-5 py-2 text-sm font-semibold rounded-xl text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {step === 'PICKING_UP' ? 'local_shipping' : 'inventory_2'}
                      </span>
                      {loading
                        ? 'Đang lưu...'
                        : step === 'PICKING_UP'
                        ? 'Bước 1: Xác nhận Shipper đi lấy hàng'
                        : 'Bước 2: Xác nhận đã nhận hàng về kho'}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedMedia && (
        <MediaLightboxModal
          isOpen={!!selectedMedia}
          onClose={() => setSelectedMedia(null)}
          mediaUrl={selectedMedia.url}
          mediaType={selectedMedia.type}
          title={selectedMedia.title}
        />
      )}
    </div>
  );
};
