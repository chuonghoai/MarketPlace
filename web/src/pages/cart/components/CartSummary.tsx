import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  finalTotal: number;
  selectedCount: number;
  onCheckout: () => void;
  formatMoney: (val: number) => string;
}

export const CartSummary: React.FC<Props> = ({ finalTotal, selectedCount, onCheckout, formatMoney }) => {
  return (
    <div className="sticky top-8 bg-white border border-[#E7E5E4] rounded-lg p-6 flex flex-col font-sans">
      <h2 className="text-xl font-serif text-gray-900 mb-6 pb-4 border-b border-[#E7E5E4]">Tóm tắt đơn hàng</h2>

      {/* Total Section */}
      <div className="mb-8">
        <div className="flex justify-between items-baseline">
          <span className="text-base font-semibold text-gray-900">Tổng tiền</span>
          <span className="text-3xl font-serif text-market-primary">{formatMoney(finalTotal)}</span>
        </div>
        <p className="text-sm text-gray-500 mt-2 text-right">Đã bao gồm thuế (nếu có)</p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onCheckout}
          disabled={selectedCount === 0}
          className="w-full py-3.5 bg-market-primary hover:bg-market-primary/90 active:bg-market-primary/80 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-[4px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-market-primary/20"
        >
          Tiến hành thanh toán ({selectedCount})
        </button>
        <Link
          to="/marketplace"
          className="w-full flex items-center justify-center py-3.5 border border-[#D6D3D1] text-gray-700 hover:border-gray-400 hover:bg-white bg-[#FFFBF5] rounded-[4px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400/20"
        >
          Tiếp tục mua sắm
        </Link>
      </div>

      {/* Trust Block */}
      <div className="mt-8 space-y-4 pt-6 border-t border-[#E7E5E4]">
        <div className="flex items-start gap-3">
          <span className="text-[#365314] text-lg leading-none mt-0.5">⚲</span>
          <p className="text-xs text-gray-600 leading-relaxed">Hỗ trợ trực tiếp cho các nghệ nhân độc lập & cộng đồng địa phương.</p>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-[#365314] text-lg leading-none mt-0.5">☻</span>
          <p className="text-xs text-gray-600 leading-relaxed">Thanh toán bảo mật, mã hóa an toàn. Minh bạch nguồn gốc vận chuyển.</p>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-[#365314] text-lg leading-none mt-0.5">↻</span>
          <p className="text-xs text-gray-600 leading-relaxed">Đổi trả miễn phí trong vòng 7 ngày đối với sản phẩm lỗi do nhà sản xuất.</p>
        </div>
      </div>

      {/* Support Info */}
      <div className="mt-6 pt-6 border-t border-[#E7E5E4]">
        <p className="text-xs font-semibold text-gray-900 mb-2 uppercase tracking-wider">Cần hỗ trợ?</p>
        <p className="text-xs text-gray-600 mb-1">Hotline: <span className="font-medium text-gray-900">1900 1234</span> (8:00 - 22:00)</p>
        <p className="text-xs text-gray-600">Email: <a href="mailto:support@marketnest.vn" className="text-market-primary hover:underline font-medium">support@marketnest.vn</a></p>
      </div>
    </div>
  );
};