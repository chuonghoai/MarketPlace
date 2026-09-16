import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { DraftOrderModel } from '../../../features/order/checkout/models/checkout.model';
import { formatVND } from '../../../features/cart/services/cart.service';

interface DraftOrdersListProps {
  drafts: DraftOrderModel[];
}

const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;
  return `${Math.floor(diffInHours / 24)} ngày trước`;
};

export const DraftOrdersList: React.FC<DraftOrdersListProps> = ({ drafts }) => {
  const navigate = useNavigate();

  if (!drafts || drafts.length === 0) return null;

  return (
    <div className="mt-12 bg-white border border-[#E7E5E4] rounded-xl p-6 sm:p-10 shadow-sm">
      <h2 className="text-2xl font-serif text-gray-900 mb-6">Đơn hàng đang chuẩn bị</h2>
      <p className="text-sm text-gray-500 mb-6">Các đơn hàng bạn đã tiến hành thanh toán nhưng chưa hoàn tất.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {drafts.map((draft) => (
          <div key={draft.prepareTempId} className="border border-gray-200 rounded-lg p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-gray-50 rounded-md overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center">
                {draft.firstProductThumbnail ? (
                  <img src={draft.firstProductThumbnail} alt="Product" className="w-full h-full object-contain mix-blend-multiply" />
                ) : (
                  <span className="text-gray-300 text-xs">No Image</span>
                )}
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-900 line-clamp-2 text-sm">{draft.productNamesSummary || "Sản phẩm"}</h3>
                </div>
                <div className="mt-1 text-xs text-gray-500">Cập nhật {getTimeAgo(draft.updatedAt)}</div>
                
                <div className="mt-auto pt-3 flex justify-between items-end">
                  <div className="text-sm text-gray-500">
                    {draft.totalQuantity} sản phẩm
                  </div>
                  <div className="font-semibold text-market-primary">
                    {formatVND(Number(draft.estimatedTotalPrice))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-5 border-t border-gray-100 pt-4">
              <button
                onClick={() => navigate(`/order/checkout?temp=${draft.prepareTempId}`)}
                className="w-full py-2 bg-[#FFFBF5] text-market-primary font-medium text-sm border border-market-primary/20 rounded-lg hover:bg-market-primary hover:text-white transition-colors"
              >
                Tiếp tục đặt hàng
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
