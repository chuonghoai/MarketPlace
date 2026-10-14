import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { HeaderOptions } from '../../../admin/layout/AdminLayout';
import { useAuctionController } from './auction.controller';
import { AuctionTable } from './components/AuctionTable';
import { AuctionCreateModal } from './components/AuctionCreateModal';

export const AuctionsPage = () => {
    const { setHeaderOptions } = useOutletContext<{ setHeaderOptions: (options: HeaderOptions) => void }>();
    const ctrl = useAuctionController();

    useEffect(() => {
        setHeaderOptions({
            links: [
                { label: 'Danh sách phiên đấu giá', href: '/admin/auctions', active: true },
            ],
            showSearch: false,
        });
    }, [setHeaderOptions]);

    useEffect(() => {
        ctrl.fetchAuctions();
    }, [ctrl.fetchAuctions]);

    const handleStartItem = async (itemId: string) => {
        if (!window.confirm('Bạn có chắc chắn muốn mở bán (bắt đầu) món hàng này ngay bây giờ không?')) return;
        const ok = await ctrl.handleStartItem(itemId);
        if (ok) {
            alert('Đã mở phiên đấu giá cho sản phẩm thành công!');
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-4 md:space-y-8 w-full pb-8">
            {/* Title & Create Button */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="font-headline text-3xl md:text-4xl font-semibold text-text-ink">Quản lý Đấu giá</h2>
                    <p className="font-body text-base md:text-lg text-text-muted mt-1 md:mt-2">Tạo và theo dõi các phiên đấu giá trực tiếp.</p>
                </div>
                <button
                    onClick={ctrl.handleOpenCreateModal}
                    className="btn-primary font-body text-sm font-semibold px-4 py-2.5 flex items-center justify-center gap-1.5 w-full md:w-auto"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Thêm phiên đấu giá
                </button>
            </div>

            {ctrl.error && (
                <div className="bg-[#fee2e2] text-error rounded-xl px-6 py-4 font-body text-sm">{ctrl.error}</div>
            )}

            <div className="bg-surface-card border border-border-subtle md:rounded-xl shadow-sm -mx-4 md:mx-0 p-4">
                <AuctionTable
                    auctions={ctrl.auctions}
                    loading={ctrl.loading}
                    onStartItem={handleStartItem}
                />
            </div>

            <AuctionCreateModal />
        </div>
    );
};
