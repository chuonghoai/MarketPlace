import { axiosInstance } from "../../../core/api/axios";
import type { Auction } from "../models/auction.model";
import { AuctionStatus } from "../models/auction.model";

export class AuctionBannerService {
    async getActiveAuctions(): Promise<Auction[]> {
        try {
            const res = await axiosInstance.get('/auctions');
            const auctions: Auction[] = Array.isArray(res.data) ? res.data : [];
            
            // Filter auctions that are ACTIVE or have at least one ACTIVE item
            return auctions.filter(a => {
                if (a.status === AuctionStatus.ACTIVE) return true;
                return a.items?.some(item => item.status === AuctionStatus.ACTIVE);
            });
        } catch (error) {
            console.error("Error fetching active auctions for banner:", error);
            return [];
        }
    }
}

export const auctionBannerService = new AuctionBannerService();
