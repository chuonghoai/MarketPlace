import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { axiosInstance } from '../../core/api/axios';
import type { Auction, AuctionItem } from '../../features/auction/models/auction.model';
import { AuctionStatus } from '../../features/auction/models/auction.model';
import { userStorageService } from '../../features/user/services/userStorage.service';

const AuctionBiddingRoomPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [auction, setAuction] = useState<Auction | null>(null);
    const [activeItem, setActiveItem] = useState<AuctionItem | null>(null);
    const [bidAmount, setBidAmount] = useState<string>('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isAutoBidModalOpen, setIsAutoBidModalOpen] = useState(false);
    const [autoBidData, setAutoBidData] = useState({ ceilingPrice: '', stepPrice: '' });

    const user = userStorageService.getUser();

    // Fetch auction details
    useEffect(() => {
        const fetchAuctionDetails = async () => {
            try {
                // In a real app we need an endpoint GET /auctions/:id
                // But since we only have GET /auctions, we fetch all and filter
                const res = await axiosInstance.get('/auctions');
                const found = res.data.find((a: Auction) => a.id === id);
                if (found) {
                    setAuction(found);
                    // Set the first active item by default, or just the first item
                    const active = found.items.find((i: AuctionItem) => i.status === AuctionStatus.ACTIVE) || found.items[0];
                    setActiveItem(active);
                    
                    if (active) {
                        setBidAmount((active.currentPrice + found.minStepPrice).toString());
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchAuctionDetails();
    }, [id]);

    // Setup Socket.IO
    useEffect(() => {
        if (!activeItem || !user) return;

        const newSocket = io('http://localhost:3000/auctions', {
            withCredentials: true
        });

        newSocket.on('connect', () => {
            console.log('Connected to auction room');
            newSocket.emit('joinRoom', { auctionItemId: activeItem.id });
        });

        newSocket.on('bidUpdated', (data: any) => {
            console.log('Bid updated:', data);
            setActiveItem(prev => prev ? { ...prev, currentPrice: data.currentPrice } : null);
            if (auction) {
                setBidAmount((data.currentPrice + auction.minStepPrice).toString());
            }
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [activeItem?.id, user]);

    const handleManualBid = () => {
        if (!socket || !activeItem) return;
        const price = parseInt(bidAmount, 10);
        
        if (price <= activeItem.currentPrice) {
            setError('Giá đấu phải cao hơn giá hiện tại');
            return;
        }

        setError(null);
        // Emitting placeBid
        socket.emit('placeBid', { auctionItemId: activeItem.id, price }, (response: any) => {
            if (response?.status === 'error') {
                setError(response.message);
            }
        });
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

    if (!auction) return <div className="p-8 text-center">Đang tải...</div>;

    return (
        <div className="min-h-screen bg-background-page pt-8 pb-16">
            <div className="max-w-6xl mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate('/auctions')} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-card border border-border-subtle hover:bg-surface-container transition-colors shadow-sm">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="font-headline text-2xl md:text-3xl font-bold text-text-ink">{auction.title}</h1>
                        <p className="font-body text-sm text-text-muted mt-1">Kết thúc vào lúc {new Date(auction.endTime).toLocaleString()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Main Bidding Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {activeItem ? (
                            <div className="bg-surface-card rounded-2xl border border-border-subtle shadow-lg overflow-hidden">
                                {/* Product Showcase */}
                                <div className="relative h-64 md:h-96 bg-surface-container">
                                    {activeItem.product?.imageUrl ? (
                                        <img src={activeItem.product.imageUrl} alt={activeItem.product.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-6xl text-text-muted">image</span></div>
                                    )}
                                    
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 ${
                                            activeItem.status === AuctionStatus.ACTIVE ? 'bg-error text-white animate-pulse' : 
                                            'bg-surface-card text-text-muted border border-border-subtle'
                                        }`}>
                                            {activeItem.status === AuctionStatus.ACTIVE && <span className="w-2 h-2 rounded-full bg-white"></span>}
                                            {activeItem.status === AuctionStatus.ACTIVE ? 'ĐANG ĐẤU GIÁ LIVE' : 'ĐANG CHỜ MỞ BÁN'}
                                        </span>
                                    </div>
                                </div>

                                {/* Bidding Controls */}
                                <div className="p-6 md:p-8">
                                    <h2 className="font-headline text-2xl font-bold text-text-ink mb-2">{activeItem.product?.name}</h2>
                                    
                                    <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between py-6 border-y border-border-subtle my-6">
                                        <div>
                                            <p className="text-text-muted font-semibold text-sm uppercase tracking-wider mb-1">Giá đấu cao nhất hiện tại</p>
                                            <div className="font-mono text-4xl md:text-5xl font-bold text-primary">
                                                {activeItem.currentPrice?.toLocaleString()}đ
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-text-muted font-semibold text-sm uppercase tracking-wider mb-1">Thời gian đếm ngược</p>
                                            <div className="font-mono text-3xl font-bold text-error flex items-center gap-2 justify-end">
                                                <span className="material-symbols-outlined">timer</span>
                                                00:30 <span className="text-sm font-body text-text-muted font-normal">(Giả lập)</span>
                                            </div>
                                        </div>
                                    </div>

                                    {error && <div className="bg-[#fee2e2] text-error px-4 py-3 rounded-lg mb-6 text-sm font-semibold">{error}</div>}

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="relative flex-1">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-text-muted">₫</span>
                                            <input 
                                                type="number" 
                                                value={bidAmount}
                                                onChange={e => setBidAmount(e.target.value)}
                                                className="w-full pl-8 pr-4 py-3.5 bg-surface-container border-2 border-border-subtle rounded-xl font-mono text-lg font-bold focus:outline-none focus:border-primary focus:bg-surface-card transition-colors"
                                                disabled={activeItem.status !== AuctionStatus.ACTIVE}
                                            />
                                        </div>
                                        <button 
                                            onClick={handleManualBid}
                                            disabled={activeItem.status !== AuctionStatus.ACTIVE}
                                            className="btn-primary px-8 py-3.5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined">pan_tool_alt</span>
                                            Ra Giá Ngay
                                        </button>
                                    </div>
                                    
                                    <div className="mt-4 flex justify-between items-center text-sm font-semibold">
                                        <span className="text-text-muted">Bước giá tối thiểu: {auction.minStepPrice?.toLocaleString()}đ</span>
                                        <button 
                                            onClick={() => setIsAutoBidModalOpen(true)}
                                            className="text-primary hover:underline flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                                            Thiết lập Auto-Bid (Bắn tỉa tự động)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-surface-card p-8 rounded-2xl border border-border-subtle text-center">
                                Chọn một sản phẩm bên phải để bắt đầu theo dõi.
                            </div>
                        )}
                    </div>

                    {/* Right: Items List */}
                    <div className="space-y-4">
                        <h3 className="font-headline text-lg font-bold text-text-ink px-1">Danh sách sản phẩm ({auction.items?.length})</h3>
                        <div className="flex flex-col gap-3 h-[600px] overflow-y-auto pr-2 no-scrollbar">
                            {auction.items?.map(item => (
                                <button 
                                    key={item.id}
                                    onClick={() => setActiveItem(item)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                                        activeItem?.id === item.id 
                                            ? 'border-primary bg-primary-container/10 shadow-md' 
                                            : 'border-border-subtle bg-surface-card hover:border-border-medium'
                                    }`}
                                >
                                    <div className="w-16 h-16 bg-surface-container rounded-lg shrink-0 overflow-hidden relative">
                                        {item.product?.imageUrl && <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />}
                                        {item.status === AuctionStatus.ACTIVE && (
                                            <div className="absolute top-1 left-1 w-2 h-2 bg-error rounded-full animate-ping"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-bold truncate ${activeItem?.id === item.id ? 'text-primary' : 'text-text-ink'}`}>
                                            {item.product?.name}
                                        </p>
                                        <p className="text-xs font-mono font-medium text-text-muted mt-1">{item.currentPrice?.toLocaleString()}đ</p>
                                        <p className="text-[10px] uppercase font-bold text-text-muted mt-1">
                                            {item.status === AuctionStatus.ACTIVE ? <span className="text-error">Đang mở bán</span> : 
                                             item.status === AuctionStatus.CLOSED ? 'Đã chốt' : 'Chờ mở bán'}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Auto Bid Modal */}
            {isAutoBidModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-surface-card rounded-2xl max-w-md w-full p-6 shadow-2xl border border-border-subtle">
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
                            <p className="text-text-muted">Hệ thống sẽ tự động giành lại vị trí top 1 cho bạn mỗi khi có người trả giá cao hơn, cho đến khi đạt tới Giá Trần.</p>
                            
                            <div>
                                <label className="block text-text-ink font-semibold mb-1">Mức giá tối đa (Giá trần)</label>
                                <input 
                                    type="number" 
                                    value={autoBidData.ceilingPrice}
                                    onChange={e => setAutoBidData({...autoBidData, ceilingPrice: e.target.value})}
                                    className="w-full px-4 py-2 border border-border-medium rounded-lg bg-background-page font-mono"
                                    placeholder="Vd: 5000000"
                                />
                            </div>
                            <div>
                                <label className="block text-text-ink font-semibold mb-1">Cộng thêm mỗi lần (Bước giá)</label>
                                <input 
                                    type="number" 
                                    value={autoBidData.stepPrice}
                                    onChange={e => setAutoBidData({...autoBidData, stepPrice: e.target.value})}
                                    className="w-full px-4 py-2 border border-border-medium rounded-lg bg-background-page font-mono"
                                    placeholder={`Tối thiểu: ${auction.minStepPrice}`}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button onClick={() => setIsAutoBidModalOpen(false)} className="px-4 py-2 font-semibold text-text-muted hover:bg-surface-container rounded-lg transition-colors">
                                Hủy bỏ
                            </button>
                            <button onClick={handleSetAutoBid} className="btn-primary px-6 py-2 rounded-lg font-semibold shadow-md">
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
