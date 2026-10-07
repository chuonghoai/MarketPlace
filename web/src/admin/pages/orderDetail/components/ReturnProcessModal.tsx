import React, { useState, useEffect } from 'react';
import type { OrderDetail } from '../../../features/order/model/orderDetail.model';
import { orderService } from '../../../features/order/services/order.service';
import { useToast } from '../../../../components/toast/toast';

interface ReturnProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderDetail;
  onSuccess: () => void;
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

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      orderService
        .getReturnRequests(1, 20)
        .then((listRes) => {
          const found = listRes.data?.items?.find((r: any) => r.orderId === order.id);
          if (found) {
            setActiveReq(found);
            if (found.type === 'EXCHANGE') {
              setActionType('EXCHANGE');
            } else {
              setActionType('RETURN_REFUND');
            }

            if (found.status === 'PICKING_UP') {
              setStep('RECEIVED');
            } else if (found.status === 'RECEIVED') {
              setStep('REFUND');
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
          onSuccess();
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
        onSuccess();
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
          if (step === 'PICKING_UP') setStep('RECEIVED');
          else if (step === 'RECEIVED') setStep('REFUND');
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
            onSuccess();
            onClose();
          } else {
            toast(res.message || 'Lỗi khi hoàn tiền', 'error');
          }
        }
      } else {
        toast(`Đã hoàn tất xử lý hoàn trả cho đơn hàng #${order.id}`, 'success');
        onSuccess();
        onClose();
      }
    } catch {
      toast('Lỗi khi cập nhật quy trình hoàn trả', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                Hỗ trợ & Đổi trả (UC23)
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
          {/* Tab switch */}
          <div className="flex p-1 bg-stone-100 dark:bg-stone-800 rounded-xl">
            <button
              type="button"
              onClick={() => setActionType('RETURN_REFUND')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                actionType === 'RETURN_REFUND'
                  ? 'bg-white dark:bg-stone-900 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              Trường hợp 2: Trả hàng hoàn tiền
            </button>
            <button
              type="button"
              onClick={() => setActionType('EXCHANGE')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                actionType === 'EXCHANGE'
                  ? 'bg-white dark:bg-stone-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              Trường hợp 1: Đổi món mới
            </button>
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
                <div className="pt-1">
                  <span className="text-[11px] font-semibold text-stone-500 block mb-1">Ảnh minh chứng:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeReq.proofImages.map((img: string, idx: number) => (
                      <a
                        key={idx}
                        href={img}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 bg-white dark:bg-stone-900 rounded border border-stone-300 dark:border-stone-700 text-blue-600 dark:text-blue-400 text-[11px] flex items-center gap-1 hover:underline truncate max-w-[200px]"
                      >
                        <span className="material-symbols-outlined text-xs">image</span>
                        Ảnh {idx + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Minh chứng video (UC23 - Mục 1.4) */}
              {activeReq.proofVideos && activeReq.proofVideos.length > 0 && (
                <div className="pt-1">
                  <span className="text-[11px] font-semibold text-stone-500 block mb-1">Video minh chứng:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeReq.proofVideos.map((vid: string, idx: number) => (
                      <a
                        key={idx}
                        href={vid}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 bg-blue-50 dark:bg-blue-950/40 rounded border border-blue-200 dark:border-blue-900/50 text-blue-700 dark:text-blue-300 text-[11px] flex items-center gap-1 hover:underline truncate max-w-[200px]"
                      >
                        <span className="material-symbols-outlined text-xs">videocam</span>
                        Video {idx + 1}
                      </a>
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
          )}

          {/* CASE 2: Trả hàng hoàn tiền (UC23 - 1.2) */}
          {actionType === 'RETURN_REFUND' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs text-amber-800 dark:text-amber-300">
                Quy trình: <strong>1. Shipper lấy hàng</strong> ➔ <strong>2. Đã nhận hàng về</strong> ➔ <strong>3. Hoàn tiền</strong> ({activeReq?.bankAccountNumber ? 'Chuyển khoản theo STK' : 'Cộng tự động vào Ví điện tử'}).
              </div>

              {/* Stepper */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
                <div
                  onClick={() => setStep('PICKING_UP')}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                    step === 'PICKING_UP'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold'
                      : 'border-stone-200 dark:border-stone-800 text-stone-500'
                  }`}
                >
                  1. Đi lấy hàng
                </div>
                <div
                  onClick={() => setStep('RECEIVED')}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                    step === 'RECEIVED'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold'
                      : 'border-stone-200 dark:border-stone-800 text-stone-500'
                  }`}
                >
                  2. Đã nhận hàng
                </div>
                <div
                  onClick={() => setStep('REFUND')}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                    step === 'REFUND'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold'
                      : 'border-stone-200 dark:border-stone-800 text-stone-500'
                  }`}
                >
                  3. Hoàn tiền
                </div>
              </div>

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
                  Ghi chú nội bộ
                </label>
                <input
                  type="text"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Ghi chú shipper hoặc lý do hoàn trả..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 text-sm rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  Đóng
                </button>
                {step === 'REFUND' ? (
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
                    className="px-5 py-2 text-sm font-semibold rounded-xl text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-xs"
                  >
                    {loading
                      ? 'Đang lưu...'
                      : step === 'PICKING_UP'
                      ? 'Xác nhận: Shipper đi lấy hàng'
                      : 'Xác nhận: Đã nhận hàng về kho'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
