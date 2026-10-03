import React from 'react';
import { AuctionStatus } from '../../../../features/auction/models/auction.model';
import type { Auction } from '../../../../features/auction/models/auction.model';

interface AuctionTableProps {
    auctions: Auction[];
    loading: boolean;
    onStartItem: (itemId: string) => void;
}

export const AuctionTable: React.FC<AuctionTableProps> = ({ auctions, loading, onStartItem }) => {
    if (loading) {
        return (
            <div className="w-full h-64 flex flex-col items-center justify-center gap-4 bg-surface-card rounded-xl">
                <div className="w-8 h-8 border-4 border-border-medium border-t-primary rounded-full animate-spin"></div>
                <p className="font-body text-sm text-text-muted">Đang tải danh sách đấu giá...</p>
            </div>
        );
    }

    if (!auctions || auctions.length === 0) {
        return (
            <div className="w-full h-64 flex flex-col items-center justify-center gap-4 bg-surface-card rounded-xl border border-border-subtle">
                <span className="material-symbols-outlined text-4xl text-text-muted">gavel</span>
                <p className="font-body text-sm text-text-muted">Chưa có phiên đấu giá nào</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto w-full pb-4">
            <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-surface-container font-body text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle">
                    <tr>
                        <th className="px-4 py-3 whitespace-nowrap">TÊN PHIÊN / ID</th>
                        <th className="px-4 py-3 whitespace-nowrap">SẢN PHẨM</th>
                        <th className="px-4 py-3 whitespace-nowrap">BẮT ĐẦU / KẾT THÚC</th>
                        <th className="px-4 py-3 whitespace-nowrap">BƯỚC GIÁ</th>
                        <th className="px-4 py-3 whitespace-nowrap">TỔNG DOANH THU</th>
                        <th className="px-4 py-3 whitespace-nowrap">TRẠNG THÁI</th>
                        <th className="px-4 py-3 whitespace-nowrap">THAO TÁC</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle font-body text-sm text-text-ink bg-surface-card">
                    {auctions.map((auction) => (
                        <tr key={auction.id} className="hover:bg-surface-container/50 transition-colors">
                            <td className="px-4 py-4 min-w-[200px]">
                                <div className="font-semibold text-text-ink mb-1">{auction.title}</div>
                                <div className="text-xs text-text-muted truncate max-w-[150px]">{auction.id}</div>
                            </td>
                            <td className="px-4 py-4 max-w-[200px]">
                                {auction.items && auction.items.length > 0 ? (
                                    <div className="flex flex-col gap-2">
                                        {auction.items.map(item => (
                                            <div key={item.id} className="flex items-center gap-2 border border-border-subtle p-2 rounded-md bg-surface-container">
                                                <div className="w-10 h-10 bg-border-medium rounded overflow-hidden shrink-0">
                                                    {item.product?.imageUrl ? (
                                                        <img src={item.product.imageUrl} alt="product" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="material-symbols-outlined w-full h-full flex items-center justify-center text-text-muted">image</span>
                                                    )}
                                                </div>
                                                <div className="flex flex-col overflow-hidden w-full">
                                                    <span className="text-xs font-semibold truncate">{item.product?.name || 'Sản phẩm'}</span>
                                                    <span className="text-[10px] text-text-muted font-mono">{item.currentPrice?.toLocaleString()}đ</span>
                                                    {item.status === AuctionStatus.PENDING && (
                                                        <button 
                                                            onClick={() => onStartItem(item.id)}
                                                            className="mt-1 text-[10px] bg-primary-container text-on-primary-container px-2 py-0.5 rounded font-bold hover:bg-primary-container/80 text-left self-start"
                                                        >
                                                            BẮT ĐẦU SP NÀY
                                                        </button>
                                                    )}
                                                    {item.status === AuctionStatus.ACTIVE && (
                                                        <span className="mt-1 text-[10px] bg-success/20 text-success px-2 py-0.5 rounded font-bold self-start">ĐANG DIỄN RA</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-text-muted italic text-xs">Không có SP</span>
                                )}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-xs">
                                <div>{new Date(auction.startTime).toLocaleString()}</div>
                                <div className="text-text-muted">đến {new Date(auction.endTime).toLocaleString()}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                                <div className="font-mono font-medium">{auction.minStepPrice?.toLocaleString()}đ</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                                <div className="font-mono font-bold text-primary">
                                    {auction.items?.reduce((sum, item) => sum + (auction.status === AuctionStatus.CLOSED ? (item.currentPrice || 0) : (item.startPrice || 0)), 0).toLocaleString()}đ
                                </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    auction.status === AuctionStatus.ACTIVE ? 'bg-[#dcfce7] text-[#166534] border border-[#bbf7d0]' : 
                                    auction.status === AuctionStatus.CLOSED ? 'bg-surface-container text-text-muted border border-border-subtle' : 
                                    'bg-[#fef9c3] text-[#854d0e] border border-[#fef08a]'
                                }`}>
                                    {auction.status === AuctionStatus.PENDING ? 'Sắp diễn ra' : 
                                     auction.status === AuctionStatus.ACTIVE ? 'Đang hoạt động' : 'Đã kết thúc'}
                                </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                    <button 
                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-primary hover:bg-surface-container transition-colors"
                                        title="Chỉnh sửa"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                    </button>
                                    <button 
                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-error hover:bg-[#fee2e2] transition-colors"
                                        title="Xóa"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
