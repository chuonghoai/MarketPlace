import type { ProductItem } from '../../products/models/product.model';

export const AuctionStatus = {
    PENDING: 'PENDING',
    ACTIVE: 'ACTIVE',
    CLOSED: 'CLOSED',
} as const;

export type AuctionStatus = typeof AuctionStatus[keyof typeof AuctionStatus];

export interface AuctionItem {
    id: string;
    startPrice: number;
    currentPrice: number;
    status: AuctionStatus;
    product: ProductItem;
}

export interface Auction {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    countdownDuration: number;
    minStepPrice: number;
    status: AuctionStatus;
    createdAt: string;
    items: AuctionItem[];
}
