import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { axiosInstance } from '../../core/api/axios';
import type { Auction, AuctionItem } from '../../features/auction/models/auction.model';
import { AuctionStatus } from '../../features/auction/models/auction.model';
import { userStorageService } from '../../features/user/services/userStorage.service';
import { tokenService } from '../../core/auth/token.service';
import { walletService } from '../../features/wallet/services/wallet.service';

const AuctionBiddingRoomPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [auction, setAuction] = useState<Auction | null>(null);
    const [activeItem, setActiveItem] = useState<AuctionItem | null>(null);
    const [bidAmount, setBidAmount] = useState<string>('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [isAutoBidModalOpen, setIsAutoBidModalOpen] = useState(false);
    const [autoBidData, setAutoBidData] = useState({ ceilingPrice: '', stepPrice: '' });

    // Live countdown & bidding state
    const [timeLeft, setTimeLeft] = useState<number>(30);
    const [targetEndTime, setTargetEndTime] = useState<number | null>(null);
    const [highestBidder, setHighestBidder] = useState<string | null>(null);
    const [highestBidderId, setHighestBidderId] = useState<string | null>(null);
    const [isClosed, setIsClosed] = useState<boolean>(false);
    const [isBidding, setIsBidding] = useState(false);

    // E-Wallet balance state
    const [walletBalance, setWalletBalance] = useState<number | null>(null);

    const user = userStorageService.getUser();
    const bidTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Fetch user wallet
    const fetchWallet = async () => {
        try {
            const res = await walletService.getMyWallet();
            if (res.success && res.data) {
                setWalletBalance(res.data.balance);
            }
        } catch (e) {
            console.warn('Could not fetch wallet balance', e);
        }
    };

    useEffect(() => {
        if (user) {
            fetchWallet();
        }
    }, [user?.id]);

    // Fetch auction details
    useEffect(() => {
        const fetchAuctionDetails = async () => {
            try {
                let found: Auction | null = null;
                try {
                    const res = await axiosInstance.get(`/auctions/${id}`);
                    if (res.data) found = res.data;
                } catch {
                    const res = await axiosInstance.get('/auctions');
                    found = res.data.find((a: Auction) => a.id === id);
                }

                if (found) {
                    setAuction(found);
                    const active = found.items?.find((i: AuctionItem) => i.status === AuctionStatus.ACTIVE) || found.items?.[0];
                    setActiveItem(active || null);
                    
                    if (active) {
                        const cur = Number(active.currentPrice || active.startPrice || 0);
                        const step = Number(found.minStepPrice || 10000);
                        setBidAmount((cur + step).toString());
                        if (active.status === AuctionStatus.CLOSED) {
                            setIsClosed(true);
                            setTimeLeft(0);
                        }
                    }
                }
            } catch (err) {
                console.error('Error fetching auction details:', err);
            }
        };
        fetchAuctionDetails();
    }, [id]);

    // Setup Socket.IO for real-time bidding & countdown synchronization
    useEffect(() => {
        if (!activeItem) return;

        const token = tokenService.getAccessToken();
        const currentUser = userStorageService.getUser();

        const newSocket = io('http://localhost:3000/auctions', {
            withCredentials: true,
            auth: {
                token: token || undefined,
                userId: currentUser?.id || undefined,
            },
            extraHeaders: token ? {
                Authorization: `Bearer ${token}`,
            } : {},
        });

        const handleLiveState = (data: any) => {
            if (!data) return;
            console.log('Auction real-time event received:', data);

            if (data.currentPrice !== undefined) {
                const numericPrice = Number(data.currentPrice);
                setActiveItem(prev => prev ? { 
                    ...prev, 
                    currentPrice: numericPrice,
                    status: data.status || prev.status
                } : null);

                if (auction) {
                    const minStep = Number(auction.minStepPrice || 10000);
                    setBidAmount((numericPrice + minStep).toString());
                }
            }

            if (data.winnerName) {
                setHighestBidder(data.winnerName);
            }
            if (data.winnerId) {
                setHighestBidderId(data.winnerId);
            }

            if (data.status === AuctionStatus.CLOSED || data.isEnded) {
                setIsClosed(true);
                setTimeLeft(0);
                setTargetEndTime(null);
            } else if (data.endTimeMs && Number(data.endTimeMs) > Date.now()) {
                const end = Number(data.endTimeMs);
                setTargetEndTime(end);
                const seconds = Math.max(0, Math.ceil((end - Date.now()) / 1000));
                setTimeLeft(seconds);
                setIsClosed(false);
            }
        };

        newSocket.on('connect', () => {
            console.log('Connected to auction socket room');
            newSocket.emit('joinRoom', { auctionItemId: activeItem.id });
        });

        newSocket.on('itemState', handleLiveState);
        newSocket.on('bidUpdated', (data: any) => {
            handleLiveState(data);
            setSuccessMsg('⚡ Có lượt nâng giá mới từ người tham gia!');
            setTimeout(() => setSuccessMsg(null), 3500);
            fetchWallet();
        });

        newSocket.on('itemClosed', (data: any) => {
            console.log('Auction item closed event:', data);
            setIsClosed(true);
            setTimeLeft(0);
            setTargetEndTime(null);
            if (data.winnerName) setHighestBidder(data.winnerName);
            if (data.winnerId) setHighestBidderId(data.winnerId);
            setActiveItem(prev => prev ? { 
                ...prev, 
                status: AuctionStatus.CLOSED, 
                currentPrice: Number(data.finalPrice || prev.currentPrice) 
            } : null);
            fetchWallet();
        });

        newSocket.on('exception', (err: any) => {
            console.warn('Socket exception:', err);
            setIsBidding(false);
            if (bidTimeoutRef.current) clearTimeout(bidTimeoutRef.current);
            setError(err?.message || 'Có lỗi xảy ra từ máy chủ socket');
        });

        setSocket(newSocket);

        return () => {
            if (bidTimeoutRef.current) clearTimeout(bidTimeoutRef.current);
            newSocket.disconnect();
        };
    }, [activeItem?.id, user?.id]);

    // Real-time 30-second countdown effect
    useEffect(() => {
        if (!targetEndTime || isClosed) return;

        const interval = setInterval(() => {
            const now = Date.now();
            const diff = targetEndTime - now;
            const seconds = Math.max(0, Math.ceil(diff / 1000));
            setTimeLeft(seconds);

            if (seconds <= 0) {
                clearInterval(interval);
                if (socket && activeItem) {
                    socket.emit('checkTimeout', { auctionItemId: activeItem.id });
                }
            }
        }, 500);

        return () => clearInterval(interval);
    }, [targetEndTime, isClosed, socket, activeItem?.id]);

    // Handle manual bid with E-Wallet balance verification
    const handleManualBid = () => {
        if (!socket || !activeItem) {
            setError('Đang kết nối lại với phòng đấu giá, vui lòng chờ trong giây lát...');
            return;
        }

        const currentUser = userStorageService.getUser();
        if (!currentUser) {
            setError('Vui lòng đăng nhập để tham gia đặt giá');
            return;
        }

        const price = parseInt(bidAmount, 10);
        if (isNaN(price) || price <= 0) {
            setError('Vui lòng nhập số tiền đấu giá hợp lệ');
            return;
        }

        const currentP = Number(activeItem.currentPrice || activeItem.startPrice || 0);
        const minStep = Number(auction?.minStepPrice || 10000);

        if (highestBidderId) {
            if (price < currentP + minStep) {
                setError(`Giá đấu mới phải lớn hơn giá hiện tại tối thiểu ${minStep.toLocaleString('vi-VN')} ₫ (Mức tối thiểu: ${(currentP + minStep).toLocaleString('vi-VN')} ₫)`);
                return;
            }
        } else {
            if (price < currentP) {
                setError(`Giá đặt phải từ giá khởi điểm trở lên (${currentP.toLocaleString('vi-VN')} ₫)`);
                return;
            }
        }

        // Pre-validate E-Wallet balance on client
        if (walletBalance !== null && walletBalance < price) {
            setError(`Số dư ví điện tử của bạn không đủ (${walletBalance.toLocaleString('vi-VN')} ₫). Cần tối thiểu ${price.toLocaleString('vi-VN')} ₫ để đặt giá này. Vui lòng nạp thêm tiền vào ví!`);
            return;
        }

        setError(null);
        setIsBidding(true);

        // Safety timeout so button NEVER gets permanently stuck loading!
        if (bidTimeoutRef.current) clearTimeout(bidTimeoutRef.current);
        bidTimeoutRef.current = setTimeout(() => {
            setIsBidding(false);
        }, 6000);

        socket.emit('placeBid', { 
            auctionItemId: activeItem.id, 
            price, 
            userId: currentUser.id,
            token: tokenService.getAccessToken() || undefined
        }, (response: any) => {
            if (bidTimeoutRef.current) clearTimeout(bidTimeoutRef.current);
            setIsBidding(false);
            if (response?.status === 'error') {
                setError(response.message || 'Lỗi khi đặt giá');
            } else if (response?.status === 'success') {
                setError(null);
                setSuccessMsg(`🎉 Bạn đã nâng giá thành công: ${price.toLocaleString('vi-VN')} ₫!`);
                setTimeout(() => setSuccessMsg(null), 3500);
                fetchWallet();
            }
        });
    };

    // Quick add increment helper
    const handleQuickAdd = (delta: number) => {
        const cur = parseInt(bidAmount, 10);
        const base = isNaN(cur) ? Number(activeItem?.currentPrice || activeItem?.startPrice || 0) : cur;
        setBidAmount((base + delta).toString());
        setError(null);
    };

    const handleSetAutoBid = async () => {
        if (!activeItem) return;
        try {
            await axiosInstance.post('/auctions/auto-bid', {
                auctionItemId: activeItem.id,
                autoStepPrice: parseInt(autoBidData.stepPrice, 10),
                ceilingPrice: parseInt(autoBidData.ceilingPrice, 10)
            });
            alert('Đã thiết lập Auto-Bid thành công!');
            setIsAutoBidModalOpen(false);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Lỗi khi cài đặt auto-bid');
        }
    };

    if (!auction) return (
        <div className="min-h-96 flex flex-col items-center justify-center gap-3">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
            <p className="text-text-muted font-medium">Đang tải phòng đấu giá trực tiếp...</p>
        </div>
    );

    const currentDisplayPrice = Number(activeItem?.currentPrice || activeItem?.startPrice || 0);
    const startDisplayPrice = Number(activeItem?.startPrice || 0);
    const minStepPrice = Number(auction.minStepPrice || 10000);

    return (
        <div className="min-h-screen bg-background-page pt-4 pb-16">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button 
                        onClick={() => navigate('/auctions')} 
                        className="w-11 h-11 flex items-center justify-center rounded-2xl bg-surface-card border border-border-subtle hover:bg-surface-container transition-all shadow-sm"
                        title="Quay lại danh sách phiên đấu giá"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="font-headline text-2xl md:text-3xl font-black text-text-ink">{auction.title}</h1>
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-red-600/10 text-red-700 border border-red-200 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                                LIVE
                            </span>
                        </div>
                        <p className="font-body text-xs md:text-sm text-text-muted mt-0.5">
                            Thời gian phiên: {new Date(auction.startTime).toLocaleString('vi-VN')} — {new Date(auction.endTime).toLocaleString('vi-VN')}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Main Bidding Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {activeItem ? (
                            <div className="bg-surface-card rounded-3xl border border-border-subtle shadow-xl overflow-hidden">
                                {/* Product Showcase */}
                                <div className="relative h-72 md:h-96 bg-surface-container flex items-center justify-center p-6">
                                    {activeItem.product?.imageUrl ? (
                                        <img 
                                            src={activeItem.product.imageUrl} 
                                            alt={activeItem.product.name} 
                                            className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-300 hover:scale-105" 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-text-muted">
                                            <span className="material-symbols-outlined text-6xl mb-2">image</span>
                                            <span className="text-sm">Chưa có ảnh sản phẩm</span>
                                        </div>
                                    )}
                                    
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-2 ${
                                            isClosed || activeItem.status === AuctionStatus.CLOSED 
                                                ? 'bg-neutral-800 text-white border border-neutral-700' 
                                                : 'bg-red-600 text-white animate-pulse'
                                        }`}>
                                            {!isClosed && activeItem.status !== AuctionStatus.CLOSED && (
                                                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                                            )}
                                            {isClosed || activeItem.status === AuctionStatus.CLOSED ? 'ĐÃ KẾT THÚC' : 'ĐANG ĐẤU GIÁ TRỰC TIẾP'}
                                        </span>
                                    </div>
                                </div>

                                {/* Bidding Controls & Price Box */}
                                <div className="p-6 md:p-8">
                                    <h2 className="font-headline text-2xl font-bold text-text-ink mb-1">{activeItem.product?.name}</h2>
                                    
                                    {/* E-Wallet Info Banner */}
                                    <div className="flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/25 rounded-2xl my-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                                            </div>
                                            <div>
                                                <span className="text-xs text-amber-900/80 font-medium block">Số dư Ví điện tử của bạn:</span>
                                                <span className="font-mono font-black text-lg text-amber-950">
                                                    {walletBalance !== null ? `${Number(walletBalance).toLocaleString('vi-VN')} ₫` : 'Đang tải số dư...'}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate('/profile/wallet')}
                                            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm transform hover:-translate-y-0.5"
                                        >
                                            <span className="material-symbols-outlined text-base">add_card</span>
                                            Nạp tiền ví
                                        </button>
                                    </div>

                                    {/* Price & Countdown Display */}
                                    <div className="p-5 rounded-2xl bg-surface-container/70 border border-border-subtle my-5">
                                        <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between">
                                            {/* Current Highest Price */}
                                            <div>
                                                <p className="text-text-muted font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-sm text-primary">sell</span>
                                                    Giá đấu cao nhất hiện tại
                                                </p>
                                                <div className="font-mono text-4xl md:text-5xl font-black text-primary tracking-tight">
                                                    {currentDisplayPrice.toLocaleString('vi-VN')} ₫
                                                </div>

                                                <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                                                    <span className="text-xs bg-surface-card px-3 py-1 rounded-lg text-text-muted font-medium border border-border-subtle">
                                                        Giá khởi điểm: <strong className="text-text-ink font-mono">{startDisplayPrice.toLocaleString('vi-VN')} ₫</strong>
                                                    </span>
                                                    <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-lg font-bold border border-primary/20">
                                                        Bước giá: +{minStepPrice.toLocaleString('vi-VN')} ₫
                                                    </span>
                                                </div>

                                                <div className="mt-3 text-xs md:text-sm text-text-muted flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-primary text-base">person</span>
                                                    {highestBidder ? (
                                                        <span>
                                                            Người giữ giá cao nhất: <strong className="text-text-ink font-semibold">{highestBidder}</strong>
                                                            {highestBidderId === user?.id && (
                                                                <span className="ml-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 text-[11px] font-bold border border-emerald-400/30">
                                                                    (Bạn đang dẫn đầu)
                                                                </span>
                                                            )}
                                                        </span>
                                                    ) : (
                                                        <span className="italic text-text-muted">Chưa có ai đặt giá (đang ở giá sàn khởi điểm)</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Countdown clock */}
                                            <div className="text-right shrink-0">
                                                <p className="text-text-muted font-bold text-xs uppercase tracking-wider mb-1">Thời gian đếm ngược</p>
                                                <div className={`font-mono text-3xl md:text-4xl font-black inline-flex items-center gap-2 px-4 py-2 rounded-2xl border shadow-sm ${
                                                    isClosed 
                                                        ? 'text-neutral-500 bg-neutral-100 border-neutral-300' 
                                                        : timeLeft <= 10 
                                                        ? 'text-red-600 bg-red-50 border-red-300 animate-pulse' 
                                                        : 'text-primary bg-surface-card border-primary/30'
                                                }`}>
                                                    <span className={`material-symbols-outlined text-2xl ${timeLeft <= 5 && !isClosed ? 'animate-bounce text-red-600' : ''}`}>
                                                        timer
                                                    </span>
                                                    <span>
                                                        {isClosed ? '00:00' : `00:${timeLeft < 10 ? '0' : ''}${timeLeft}`}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-text-muted mt-1.5">
                                                    {isClosed ? 'Đã kết thúc phiên sản phẩm này' : 'Tự động gia hạn 30s mỗi khi có giá mới'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Winner Announcement Banner */}
                                    {isClosed && (
                                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl mb-6 text-center animate-fadeIn">
                                            <div className="flex items-center justify-center gap-2 text-emerald-800 font-bold text-lg mb-1">
                                                <span className="material-symbols-outlined text-2xl text-emerald-600">verified</span>
                                                Phiên đấu giá sản phẩm này đã kết thúc!
                                            </div>
                                            <p className="text-text-muted text-sm">
                                                {highestBidder ? (
                                                    <>Người chiến thắng: <strong className="text-text-ink">{highestBidder}</strong> với mức giá chốt <strong className="text-primary font-mono font-bold">{currentDisplayPrice.toLocaleString('vi-VN')} ₫</strong> (đã được thanh toán qua Ví điện tử)</>
                                                ) : (
                                                    'Không có người trả giá cho sản phẩm này.'
                                                )}
                                            </p>
                                        </div>
                                    )}

                                    {error && (
                                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm font-semibold flex items-center gap-2 animate-fadeIn">
                                            <span className="material-symbols-outlined text-lg">error</span>
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    {successMsg && (
                                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl mb-4 text-sm font-semibold flex items-center gap-2 animate-fadeIn">
                                            <span className="material-symbols-outlined text-lg">check_circle</span>
                                            <span>{successMsg}</span>
                                        </div>
                                    )}

                                    {/* Action row */}
                                    {!isClosed && activeItem.status !== AuctionStatus.CLOSED && (
                                        <div className="space-y-3">
                                            {/* Quick Increment Buttons */}
                                            <div className="flex items-center gap-2 flex-wrap text-xs font-bold">
                                                <span className="text-text-muted text-xs">Cộng nhanh:</span>
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleQuickAdd(10000)}
                                                    className="px-2.5 py-1 rounded-lg bg-surface-card hover:bg-surface-container border border-border-subtle text-text-ink transition-colors"
                                                >
                                                    +10.000 ₫
                                                </button>
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleQuickAdd(50000)}
                                                    className="px-2.5 py-1 rounded-lg bg-surface-card hover:bg-surface-container border border-border-subtle text-text-ink transition-colors"
                                                >
                                                    +50.000 ₫
                                                </button>
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleQuickAdd(100000)}
                                                    className="px-2.5 py-1 rounded-lg bg-surface-card hover:bg-surface-container border border-border-subtle text-text-ink transition-colors"
                                                >
                                                    +100.000 ₫
                                                </button>
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleQuickAdd(500000)}
                                                    className="px-2.5 py-1 rounded-lg bg-surface-card hover:bg-surface-container border border-border-subtle text-text-ink transition-colors"
                                                >
                                                    +500.000 ₫
                                                </button>
                                                <button 
                                                    type="button" 
                                                    onClick={() => {
                                                        const p = currentDisplayPrice + minStepPrice;
                                                        setBidAmount(p.toString());
                                                    }}
                                                    className="px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-colors ml-auto"
                                                >
                                                    Mức tối thiểu (+{minStepPrice.toLocaleString('vi-VN')} ₫)
                                                </button>
                                            </div>

                                            {/* Input & Big Bid Button */}
                                            <div className="flex flex-col sm:flex-row gap-3 pt-1">
                                                <div className="relative flex-1">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-text-muted text-lg">₫</span>
                                                    <input 
                                                        type="number" 
                                                        value={bidAmount}
                                                        onChange={e => {
                                                            setBidAmount(e.target.value);
                                                            setError(null);
                                                        }}
                                                        className="w-full pl-9 pr-4 py-4 bg-surface-card border-2 border-border-subtle focus:border-primary rounded-2xl font-mono text-xl font-bold focus:outline-none transition-all shadow-inner"
                                                        placeholder="Nhập mức giá muốn đặt"
                                                    />
                                                </div>

                                                <button 
                                                    type="button"
                                                    onClick={handleManualBid}
                                                    disabled={isBidding}
                                                    className="btn-primary px-8 py-4 rounded-2xl font-bold text-base md:text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2 whitespace-nowrap min-w-[200px]"
                                                >
                                                    {isBidding ? (
                                                        <>
                                                            <span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>
                                                            <span>Đang gửi giá...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="material-symbols-outlined text-xl">gavel</span>
                                                            <span>Đặt giá ngay</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-5 pt-4 border-t border-border-subtle flex justify-between items-center text-xs md:text-sm font-semibold">
                                        <span className="text-text-muted flex items-center gap-1">
                                            <span className="material-symbols-outlined text-base">info</span>
                                            Bước giá tối thiểu: {minStepPrice.toLocaleString('vi-VN')} ₫
                                        </span>
                                        <button 
                                            onClick={() => setIsAutoBidModalOpen(true)}
                                            disabled={isClosed || activeItem.status === AuctionStatus.CLOSED}
                                            className="text-primary hover:underline flex items-center gap-1 disabled:opacity-50"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                                            Thiết lập Auto-Bid (Tự động đấu giá)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-surface-card p-12 rounded-3xl border border-border-subtle text-center text-text-muted">
                                <span className="material-symbols-outlined text-5xl mb-2 text-primary">touch_app</span>
                                <p className="font-semibold">Vui lòng chọn một sản phẩm trong danh sách bên phải để tham gia đấu giá.</p>
                            </div>
                        )}
                    </div>

                    {/* Right: Items List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="font-headline text-lg font-bold text-text-ink">
                                Sản phẩm trong phiên ({auction.items?.length || 0})
                            </h3>
                            <span className="text-xs text-text-muted">Chọn để theo dõi</span>
                        </div>

                        <div className="flex flex-col gap-3 max-h-[640px] overflow-y-auto pr-1 no-scrollbar">
                            {auction.items?.map(item => {
                                const isItemActive = item.status === AuctionStatus.ACTIVE;
                                const isItemClosed = item.status === AuctionStatus.CLOSED;
                                const isSelected = activeItem?.id === item.id;
                                const itemP = Number(item.currentPrice || item.startPrice || 0);

                                return (
                                    <button 
                                        key={item.id}
                                        onClick={() => {
                                            setActiveItem(item);
                                            const p = Number(item.currentPrice || item.startPrice || 0);
                                            const step = Number(auction.minStepPrice || 10000);
                                            setBidAmount((p + step).toString());
                                            setIsClosed(item.status === AuctionStatus.CLOSED);
                                            setError(null);
                                        }}
                                        className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl border-2 transition-all text-left ${
                                            isSelected 
                                                ? 'border-primary bg-primary/5 shadow-md' 
                                                : 'border-border-subtle bg-surface-card hover:border-border-medium hover:bg-surface-container/50'
                                        }`}
                                    >
                                        <div className="w-16 h-16 bg-surface-container rounded-xl shrink-0 overflow-hidden relative border border-border-subtle flex items-center justify-center">
                                            {item.product?.imageUrl ? (
                                                <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="material-symbols-outlined text-2xl text-text-muted">image</span>
                                            )}
                                            {isItemActive && (
                                                <div className="absolute top-1 left-1 w-2.5 h-2.5 bg-red-600 rounded-full animate-ping"></div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-bold truncate ${isSelected ? 'text-primary' : 'text-text-ink'}`}>
                                                {item.product?.name || 'Sản phẩm'}
                                            </p>
                                            <p className="text-xs font-mono font-bold text-text-ink mt-0.5">
                                                {itemP.toLocaleString('vi-VN')} ₫
                                            </p>
                                            <div className="mt-1 flex items-center gap-1.5">
                                                <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${
                                                    isItemClosed 
                                                        ? 'bg-neutral-200 text-neutral-600' 
                                                        : isItemActive 
                                                        ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse' 
                                                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                }`}>
                                                    {isItemClosed ? 'Đã chốt' : isItemActive ? 'Đang live' : 'Chờ mở bán'}
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Auto Bid Modal */}
            {isAutoBidModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-surface-card rounded-3xl max-w-md w-full p-6 shadow-2xl border border-border-subtle">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-headline text-xl font-bold text-text-ink flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">smart_toy</span>
                                Auto-Bid Thông Minh
                            </h3>
                            <button onClick={() => setIsAutoBidModalOpen(false)} className="text-text-muted hover:text-text-ink">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        
                        <div className="space-y-4 font-body text-sm mb-6">
                            <p className="text-text-muted">
                                Hệ thống sẽ tự động nâng giá cho bạn mỗi khi có người trả giá cao hơn, cho đến khi chạm mức Giá Trần.
                            </p>
                            
                            <div>
                                <label className="block text-text-ink font-semibold mb-1">Mức giá tối đa bạn chấp nhận (Giá trần) *</label>
                                <input 
                                    type="number" 
                                    value={autoBidData.ceilingPrice}
                                    onChange={e => setAutoBidData({...autoBidData, ceilingPrice: e.target.value})}
                                    className="w-full px-4 py-2.5 border border-border-medium rounded-xl bg-background-page font-mono text-base font-bold focus:border-primary focus:outline-none"
                                    placeholder="Vd: 2000000"
                                />
                            </div>
                            <div>
                                <label className="block text-text-ink font-semibold mb-1">Cộng thêm mỗi lần (Bước giá tự động) *</label>
                                <input 
                                    type="number" 
                                    value={autoBidData.stepPrice}
                                    onChange={e => setAutoBidData({...autoBidData, stepPrice: e.target.value})}
                                    className="w-full px-4 py-2.5 border border-border-medium rounded-xl bg-background-page font-mono text-base font-bold focus:border-primary focus:outline-none"
                                    placeholder={`Tối thiểu: ${auction.minStepPrice?.toLocaleString('vi-VN')} ₫`}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button onClick={() => setIsAutoBidModalOpen(false)} className="px-5 py-2.5 font-semibold text-text-muted hover:bg-surface-container rounded-xl transition-colors">
                                Hủy bỏ
                            </button>
                            <button onClick={handleSetAutoBid} className="btn-primary px-6 py-2.5 rounded-xl font-bold shadow-md">
                                Kích hoạt Auto-Bid
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuctionBiddingRoomPage;
