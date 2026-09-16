import React from 'react';
import { Link } from 'react-router-dom';

export const CartEmptyState: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-[#FFFBF5]">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-32 h-32 mx-auto border border-dashed border-[#D6D3D1] rounded-full flex items-center justify-center bg-white mb-8">
          <svg className="w-12 h-12 text-[#D4A373]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-3xl font-serif text-gray-900">Giỏ hàng của bạn đang trống</h2>
        <p className="text-gray-600 font-sans">
          Khám phá các sản phẩm thủ công độc đáo và ủng hộ các nghệ nhân độc lập trên toàn thế giới.
        </p>
        <div className="pt-4">
          <Link 
            to="/marketplace" 
            className="inline-block px-8 py-3.5 bg-[#C2410C] hover:bg-[#9A3412] active:bg-[#7C2D12] text-white rounded-[4px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#C2410C]/20"
          >
            Khám phá gian hàng
          </Link>
        </div>
      </div>
    </div>
  );
};
