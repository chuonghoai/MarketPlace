import { create } from 'zustand';
import type { Auction } from '../../../features/auction/models/auction.model';
import { auctionService } from '../../../features/auction/services/auction.service';

interface AuctionState {
    auctions: Auction[];
    loading: boolean;
    error: string | null;
    isCreateModalOpen: boolean;
    
    fetchAuctions: () => Promise<void>;
    startItem: (itemId: string) => Promise<boolean>;
    createAuction: (data: any) => Promise<boolean>;
    setIsCreateModalOpen: (isOpen: boolean) => void;
}

export const useAuctionStore = create<AuctionState>((set, get) => ({
    auctions: [],
    loading: false,
    error: null,
    isCreateModalOpen: false,

    fetchAuctions: async () => {
        set({ loading: true, error: null });
        try {
            const data = await auctionService.getAuctions();
            set({ auctions: data, loading: false });
        } catch (error: any) {
            set({ error: error.message || 'Lỗi khi tải danh sách đấu giá', loading: false });
        }
    },

    startItem: async (itemId: string) => {
        try {
            await auctionService.startAuctionItem(itemId);
            // Refresh auctions after starting
            await get().fetchAuctions();
            return true;
        } catch (error: any) {
            set({ error: error.message || 'Không thể bắt đầu đấu giá món này' });
            return false;
        }
    },

    createAuction: async (data: any) => {
        try {
            await auctionService.createAuction(data);
            await get().fetchAuctions();
            return true;
        } catch (error: any) {
            set({ error: error.response?.data?.message || error.message || 'Lỗi khi tạo phiên đấu giá' });
            return false;
        }
    },

    setIsCreateModalOpen: (isOpen: boolean) => set({ isCreateModalOpen: isOpen })
}));
