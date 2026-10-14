import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auctionBannerService } from '../../features/auction/services/auctionBanner.service';
import type { Auction } from '../../features/auction/models/auction.model';
import { AuctionStatus } from '../../features/auction/models/auction.model';

export const ActiveAuctionBanner: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeAuctions, setActiveAuctions] = useState<Auction[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDismissed, setIsDismissed] = useState(false);

    const loadActiveAuctions = async () => {
        const list = await auctionBannerService.getActiveAuctions();
        setActiveAuctions(list);
    };

    useEffect(() => {
        loadActiveAuctions();
        const interval = setInterval(loadActiveAuctions, 30000);
        return () => clearInterval(interval);
    }, []);

    // Cycle through multiple active auctions every 8 seconds
    useEffect(() => {
        if (activeAuctions.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % activeAuctions.length);
        }, 8000);
        return () => clearInterval(timer);
    }, [activeAuctions.length]);

    if (isDismissed || activeAuctions.length === 0 || location.pathname.startsWith('/auctions/')) return null;

    const currentAuction = activeAuctions[currentIndex] || activeAuctions[0];
    const liveItem = currentAuction.items?.find(i => i.status === AuctionStatus.ACTIVE) || currentAuction.items?.[0];
    const itemPrice = liveItem ? (liveItem.currentPrice || liveItem.startPrice || 0) : 0;

    return (
        <div className="relative overflow-hidden mb-6 rounded-2xl bg-gradient-to-r from-[#991b1b] via-[#b91c1c] to-[#c2410c] text-white shadow-xl border border-red-500/30 animate-fadeIn">
            {/* Background glow effects */}
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -left-10 -top-10 w-48 h-48 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Left info */}
                <div className="flex items-center gap-3.5 w-full md:w-auto">
                    <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20 shadow-inner">
                        <span className="material-symbols-outlined text-yellow-300 text-2xl animate-pulse">
                            gavel
                        </span>
                    </div>

                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-red-700 uppercase tracking-wider shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                                Đang đấu giá LIVE
                            </span>
                            {activeAuctions.length > 1 && (
                                <span className="text-white/70 text-xs font-medium hidden sm:inline">
                                    ({currentIndex + 1}/{activeAuctions.length})
                                </span>
                            )}
                        </div>

                        <div className="flex items-baseline gap-2 flex-wrap">
                            <h4 className="font-bold text-sm md:text-base text-white tracking-wide truncate max-w-xs md:max-w-md">
                                {currentAuction.title}
                            </h4>
                            {liveItem && (
                                <span className="text-white/90 text-xs sm:text-sm font-medium">
                                    • {liveItem.product?.name}: <strong className="text-yellow-300 font-mono font-bold">{Number(itemPrice).toLocaleString('vi-VN')} ₫</strong>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right action button */}
                <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                    <button
                        onClick={() => navigate(`/auctions/${currentAuction.id}`)}
                        className="px-5 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-bold text-xs md:text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-1.5 whitespace-nowrap"
                    >
                        <span>Vào phòng đấu giá</span>
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </button>

                    <button
                        onClick={() => setIsDismissed(true)}
                        className="w-8 h-8 rounded-lg hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors shrink-0"
                        title="Đóng thông báo"
                    >
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
