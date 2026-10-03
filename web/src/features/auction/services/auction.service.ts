import { axiosInstance } from '../../../core/api/axios';
import type { Auction } from '../models/auction.model';

export const auctionService = {
    async getAuctions(): Promise<Auction[]> {
        const response = await axiosInstance.get('/auctions');
        return response.data;
    },

    async startAuctionItem(itemId: string): Promise<any> {
        const response = await axiosInstance.patch(`/auctions/${itemId}/start`);
        return response.data;
    },

    // In a full implementation, createAuction would be here
    async createAuction(data: any): Promise<Auction> {
        const response = await axiosInstance.post('/auctions', data);
        return response.data;
    }
};
