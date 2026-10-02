import type { ProductItem } from "./product.model";

export interface ArtisanInfo {
    id: string;
    name: string;
    avatarUrl?: string | null;
}

/**
 * Product's specifications
 * @example materials: ["Đất sét", "Men tro", "Gỗ sồi"])
 * @example dimensions: "Cao 15cm, Đường kính 10cm"
 * @example weight: "500g"
 * @example careInstructions: "Chỉ rửa bằng tay, không dùng máy rửa bát"
 */
export interface ProductDetail extends ProductItem {
    images: string[];
    description: string;
    stock: number;
    categoryName: string;

    materials?: string[];
    dimensions?: string;
    weight?: string;
    careInstructions?: string;

    isFavorite?: boolean;
    artisanInfo?: ArtisanInfo | null;
}