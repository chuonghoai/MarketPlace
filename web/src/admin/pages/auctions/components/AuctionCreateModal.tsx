import React, { useState, useEffect } from 'react';
import { useAuctionController } from '../auction.controller';
import { productService } from '../../../features/products/services/product.service';
import type { Product } from '../../../features/products/models/product.model';
export const AuctionCreateModal: React.FC = () => {
    const ctrl = useAuctionController();
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [countdownDuration, setCountdownDuration] = useState(30);
    const [minStepPrice, setMinStepPrice] = useState(10000);
    const [selectedItems, setSelectedItems] = useState<{ productId: string, startPrice: string }[]>([]);
    
    // Temp state for adding item
    const [tempProductId, setTempProductId] = useState('');
    const [tempStartPrice, setTempStartPrice] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Add item to list
    const handleAddItem = () => {
        if (!tempProductId || !tempStartPrice) return;
        if (selectedItems.find(i => i.productId === tempProductId)) {
            alert('Sản phẩm này đã được chọn!');
            return;
        }
        setSelectedItems([...selectedItems, { productId: tempProductId, startPrice: tempStartPrice }]);
        setTempProductId('');
        setTempStartPrice('');
    };

    const handleRemoveItem = (id: string) => {
        setSelectedItems(selectedItems.filter(i => i.productId !== id));
    };

    useEffect(() => {
        if (ctrl.isCreateModalOpen) {
            fetchProducts();
        } else {
            setTitle('');
            setStartTime('');
            setEndTime('');
            setCountdownDuration(30);
            setMinStepPrice(10000);
            setSelectedItems([]);
            setTempProductId('');
            setTempStartPrice('');
        }
    }, [ctrl.isCreateModalOpen]);

    const fetchProducts = async () => {
        setLoadingProducts(true);
        try {
            const res = await productService.fetchProducts({ page: 1, pageSize: 50 });
            if (res.success && res.data) {
                setProducts(res.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !startTime || !endTime) {
            alert('Vui lòng điền đầy đủ các thông tin bắt buộc');
            return;
        }

        const now = new Date().getTime();
        const start = new Date(startTime).getTime();
        const end = new Date(endTime).getTime();

        if (start < now - 60000) {
            alert('Thời gian bắt đầu không được trong quá khứ!');
            return;
        }
        
        if (start >= end) {
            alert('Thời gian kết thúc phải sau thời gian bắt đầu!');
            return;
        }

        if (selectedItems.length === 0) {
            alert('Vui lòng thêm ít nhất 1 sản phẩm vào phiên đấu giá!');
            return;
        }

        setIsSubmitting(true);
        const data = {
            title,
            startTime,
            endTime,
            countdownDuration,
            minStepPrice,
            auctionItems: selectedItems.map(item => ({
                productId: item.productId,
                startPrice: parseInt(item.startPrice, 10)
            }))
        };

        const success = await ctrl.handleCreateAuction(data);
        if (success) {
            alert('Tạo phiên đấu giá thành công!');
        } else {
            alert('Lỗi: ' + ctrl.error);
        }
        setIsSubmitting(false);
    };

    if (!ctrl.isCreateModalOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-surface-card rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-border-subtle my-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-headline text-2xl font-bold text-text-ink flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">add_circle</span>
                        Tạo phiên đấu giá mới
                    </h3>
                    <button onClick={ctrl.handleCloseCreateModal} className="text-text-muted hover:text-text-ink">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 font-body text-sm">
                    {ctrl.error && <div className="text-error bg-[#fee2e2] p-3 rounded-lg font-semibold">{ctrl.error}</div>}

                    <div>
                        <label className="block text-text-ink font-semibold mb-1">Tên phiên đấu giá *</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-4 py-2 border border-border-medium rounded-lg" placeholder="VD: Phiên đấu giá Mùa Xuân" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-text-ink font-semibold mb-1">Thời gian bắt đầu *</label>
                            <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required className="w-full px-4 py-2 border border-border-medium rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-text-ink font-semibold mb-1">Thời gian kết thúc *</label>
                            <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required className="w-full px-4 py-2 border border-border-medium rounded-lg" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-text-ink font-semibold mb-1">Bước giá tối thiểu (VNĐ) *</label>
                            <input type="number" min="1000" value={minStepPrice} onChange={e => setMinStepPrice(parseInt(e.target.value) || 0)} required className="w-full px-4 py-2 border border-border-medium rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-text-ink font-semibold mb-1">Thời gian bù giờ / Reset đếm ngược (giây)</label>
                            <input type="number" min="5" value={countdownDuration} onChange={e => setCountdownDuration(parseInt(e.target.value) || 0)} required className="w-full px-4 py-2 border border-border-medium rounded-lg" />
                        </div>
                    </div>

                    <div className="p-4 border border-border-subtle rounded-xl bg-surface-container mt-4">
                        <h4 className="font-semibold text-text-ink mb-3 text-base flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-sm">playlist_add</span>
                            Thêm sản phẩm vào phiên đấu giá
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-text-ink font-semibold mb-1">Chọn sản phẩm *</label>
                                <select
                                    value={tempProductId}
                                    onChange={e => setTempProductId(e.target.value)}
                                    className="w-full px-4 py-2 border border-border-medium rounded-lg bg-surface-card"
                                >
                                    <option value="">-- Hãy chọn 1 sản phẩm --</option>
                                    {loadingProducts ? <option disabled>Đang tải danh sách...</option> :
                                        products.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} (Kho: {p.stock})</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div>
                                <label className="block text-text-ink font-semibold mb-1">Giá khởi điểm cho SP này (VNĐ) *</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="number" 
                                        min="1000" 
                                        value={tempStartPrice} 
                                        onChange={e => setTempStartPrice(e.target.value)} 
                                        className="w-full px-4 py-2 border border-border-medium rounded-lg bg-surface-card" 
                                        placeholder="VD: 50000" 
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddItem}
                                        disabled={!tempProductId || !tempStartPrice}
                                        className="btn-primary px-4 py-2 rounded-lg font-semibold whitespace-nowrap disabled:opacity-50 flex items-center gap-1"
                                    >
                                        <span className="material-symbols-outlined text-sm">add</span>
                                        Thêm
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* List of selected items */}
                        <div className="mt-4">
                            <label className="block text-text-ink font-semibold mb-2">
                                Danh sách sản phẩm trong phiên ({selectedItems.length})
                            </label>
                            {selectedItems.length === 0 ? (
                                <p className="text-text-muted text-xs italic py-2">Chưa có sản phẩm nào được thêm. Hãy chọn sản phẩm và nhập giá khởi điểm rồi bấm "Thêm".</p>
                            ) : (
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {selectedItems.map((item, idx) => {
                                        const prod = products.find(p => p.id === item.productId);
                                        return (
                                            <div key={item.productId} className="flex items-center justify-between p-2.5 bg-surface-card rounded-lg border border-border-subtle">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                                                        {idx + 1}
                                                    </span>
                                                    <div>
                                                        <p className="font-semibold text-text-ink text-sm">{prod?.name || 'Sản phẩm #' + item.productId}</p>
                                                        <p className="text-xs text-text-muted font-mono">Giá khởi điểm: {parseInt(item.startPrice, 10).toLocaleString()}đ</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveItem(item.productId)}
                                                    className="p-1.5 text-error hover:bg-error/10 rounded-md transition-colors"
                                                    title="Xóa khỏi phiên"
                                                >
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-border-subtle">
                        <button type="button" onClick={ctrl.handleCloseCreateModal} disabled={isSubmitting} className="px-6 py-2 rounded-lg font-semibold text-text-muted hover:bg-surface-container transition-colors">
                            Hủy bỏ
                        </button>
                        <button type="submit" disabled={isSubmitting} className="btn-primary px-6 py-2 rounded-lg font-semibold shadow-md disabled:opacity-50 flex items-center gap-2">
                            {isSubmitting ? 'Đang tạo...' : 'Tạo Phiên Mới'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
