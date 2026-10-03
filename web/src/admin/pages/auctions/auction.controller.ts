import { useCallback } from 'react';
import { useAuctionStore } from './auction.store';

export const useAuctionController = () => {
    const store = useAuctionStore();

    const fetchAuctions = useCallback(() => {
        store.fetchAuctions();
    }, []);

    const handleOpenCreateModal = useCallback(() => {
        store.setIsCreateModalOpen(true);
    }, []);

    const handleCloseCreateModal = useCallback(() => {
        store.setIsCreateModalOpen(false);
    }, []);

    const handleStartItem = useCallback(async (itemId: string) => {
        return await store.startItem(itemId);
    }, []);

    return {
        auctions: store.auctions,
        loading: store.loading,
        error: store.error,
        isCreateModalOpen: store.isCreateModalOpen,
        fetchAuctions,
        handleOpenCreateModal,
        handleCloseCreateModal,
        handleStartItem,
    };
};
