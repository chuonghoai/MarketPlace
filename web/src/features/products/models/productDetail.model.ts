import type { SellerInfo } from "../../seller/models/seller.model";
import type { ProductItem } from "./product.model";

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
    sellerInfo: SellerInfo;
}