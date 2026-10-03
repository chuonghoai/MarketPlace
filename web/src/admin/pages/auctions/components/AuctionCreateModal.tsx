import React from 'react';
import { useAuctionController } from '../auction.controller';

export const AuctionCreateModal: React.FC = () => {
    const ctrl = useAuctionController();

    if (!ctrl.isCreateModalOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-surface-card rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-border-subtle max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-headline text-2xl font-bold text-text-ink flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">add_circle</span>
                        Tạo phiên đấu giá mới
                    </h3>
                    <button onClick={ctrl.handleCloseCreateModal} className="text-text-muted hover:text-text-ink">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div className="space-y-6 font-body text-sm">
                    <p className="text-text-muted">Tính năng tạo phiên đấu giá đang được phát triển. Trong tương lai, bạn sẽ có thể chọn danh sách sản phẩm từ kho hàng, thiết lập giá khởi điểm cho từng sản phẩm và ấn định thời gian diễn ra phiên đấu giá tại đây.</p>
                    
                    <div className="bg-surface-container p-6 rounded-xl border border-border-medium flex flex-col items-center justify-center gap-4 text-center">
                        <span className="material-symbols-outlined text-5xl text-primary animate-bounce">construction</span>
                        <h4 className="font-bold text-lg">Đang hoàn thiện giao diện</h4>
                        <p className="text-text-muted">Chúng tôi đang xây dựng form tích hợp chọn sản phẩm. Vui lòng quay lại sau!</p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <button onClick={ctrl.handleCloseCreateModal} className="btn-primary px-6 py-2 rounded-lg font-semibold shadow-md">
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};
