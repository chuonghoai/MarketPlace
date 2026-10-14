import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auctionService } from '../../features/auction/services/auction.service';
import type { Auction } from '../../features/auction/models/auction.model';
import { AuctionStatus } from '../../features/auction/models/auction.model';

const AuctionsCustomerPage: React.FC = () => {
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const data = await auctionService.getAuctions();
                // Filter only active or pending auctions for customers?
                setAuctions(data);
            } catch (error) {
                console.error("Lỗi tải đấu giá", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAuctions();
    }, []);

    if (loading) {
        return (
            <div className="w-full min-h-[50vh] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-border-subtle border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="w-full bg-background-page min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="mb-8">
                    <h1 className="font-headline text-3xl md:text-4xl font-bold text-text-ink">Sàn Đấu Giá Trực Tuyến</h1>
                    <p className="font-body text-text-muted mt-2">Tham gia trả giá thời gian thực để săn những vật phẩm thủ công độc bản với giá hời nhất.</p>
                </div>

                {auctions.length === 0 ? (
                    <div className="bg-surface-card rounded-2xl p-12 text-center border border-border-subtle">
                        <span className="material-symbols-outlined text-6xl text-text-muted mb-4">gavel</span>
                        <h3 className="font-headline text-xl font-semibold mb-2">Chưa có phiên đấu giá nào</h3>
                        <p className="font-body text-text-muted">Các phiên đấu giá mới đang được chuẩn bị. Hãy quay lại sau nhé!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {auctions.map(auction => (
                            <div key={auction.id} className="bg-surface-card rounded-2xl border border-border-subtle overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                                <div className="p-5 border-b border-border-subtle flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-headline text-xl font-bold text-text-ink line-clamp-2">{auction.title}</h3>
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                                            auction.status === AuctionStatus.ACTIVE ? 'bg-[#dcfce7] text-[#166534]' : 
                                            auction.status === AuctionStatus.PENDING ? 'bg-[#fef9c3] text-[#854d0e]' : 'bg-surface-container text-text-muted'
                                        }`}>
                                            {auction.status === AuctionStatus.ACTIVE ? 'Đang diễn ra' : 
                                             auction.status === AuctionStatus.PENDING ? 'Sắp diễn ra' : 'Đã đóng'}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-sm font-body text-text-muted mb-4">
                                        <span className="material-symbols-outlined text-[18px]">schedule</span>
                                        <span>Bắt đầu: {new Date(auction.startTime).toLocaleString()}</span>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Vật phẩm trong phiên ({auction.items?.length || 0})</p>
                                        <div className="flex flex-col gap-2">
                                            {auction.items?.slice(0, 3).map(item => (
                                                <div key={item.id} className="flex items-center gap-3 p-2 rounded-xl border border-border-subtle bg-background-page">
                                                    <div className="w-12 h-12 bg-surface-container rounded-lg overflow-hidden shrink-0">
                                                        {item.product?.imageUrl ? (
                                                            <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-border-subtle text-text-muted"><span className="material-symbols-outlined text-[20px]">image</span></div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-text-ink truncate">{item.product?.name || 'Sản phẩm'}</p>
                                                        <p className="text-xs font-mono text-primary font-bold">{item.currentPrice?.toLocaleString()}đ</p>
                                                    </div>
                                                    {item.status === AuctionStatus.ACTIVE && (
                                                        <span className="relative flex h-3 w-3 mr-1">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-error"></span>
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                            {auction.items && auction.items.length > 3 && (
                                                <div className="text-xs text-center text-text-muted font-medium py-1">
                                                    + {auction.items.length - 3} vật phẩm khác
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-surface-container flex items-center justify-between">
                                    <div className="font-mono text-xs">
                                        <span className="text-text-muted block">Bước giá tối thiểu</span>
                                        <span className="font-bold text-text-ink">{auction.minStepPrice?.toLocaleString()}đ</span>
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/auctions/${auction.id}`)}
                                        className="btn-primary px-5 py-2 text-sm font-semibold rounded-full flex items-center gap-2 hover:-translate-y-0.5 transition-transform shadow-md hover:shadow-lg"
                                    >
                                        Tham gia ngay
                                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuctionsCustomerPage;
