import { Link, useNavigate } from "react-router-dom";
import type { ProductItem } from "../../../../features/products/models/product.model";
import { useCart } from "../../../../features/cart/contexts/CartContext";
import { useToast } from "../../../../components/toast/toast";
import { userStorageService } from "../../../../features/user/services/userStorage.service";
import { buildProductUrl } from "../../../../utils/slug";

interface ProductCardProps {
    product: ProductItem;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const { toast } = useToast();

    const isSale = product.originalPrice !== undefined && product.originalPrice > product.price;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        
        if (!userStorageService.getUser()) {
            toast("Bạn cần đăng nhập để sử dụng chức năng này", "warning");
            navigate("/login");
            return;
        }

        await addToCart(product.id, 1);
        toast("Thêm vào giỏ hàng thành công", "success");
    };

    let discountBadgeContent = null;
    if (isSale) {
        if (product.discountPercentage && product.discountPercentage > 0) {
            discountBadgeContent = `-${product.discountPercentage}%`;
        } else {
            const discountAmount = product.originalPrice! - product.price;
            discountBadgeContent = `-${discountAmount.toLocaleString('vi-VN')}đ`;
        }
    }

    return (
        <Link
            to={buildProductUrl(product)}
            className="group bg-white border border-border-subtle rounded-lg overflow-hidden transition-all duration-200 hover:border-border-medium flex flex-col h-full">
            <div className="aspect-square w-full overflow-hidden bg-[#F5F5F4] relative">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {discountBadgeContent && (
                    <div className="absolute top-3 left-3 bg-market-primary text-white text-[11px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
                        {discountBadgeContent}
                    </div>
                )}
            </div>

            <div className="p-3 md:p-4 flex flex-col flex-1">
                <h3 className="font-['Lora',serif] text-[14px] md:text-[16px] font-semibold text-text-ink mb-2 line-clamp-2 leading-snug group-hover:text-market-primary transition-colors">
                    {product.name}
                </h3>

                <div className="mt-auto flex items-end justify-between gap-2">
                    <div className="flex flex-col gap-0.5">
                        {isSale && (
                            <span className="text-[12px] md:text-[13px] text-[#A8A29E] line-through font-normal">
                                {product.originalPrice!.toLocaleString('vi-VN')}đ
                            </span>
                        )}
                        <span className="text-[14px] md:text-[16px] font-bold text-text-ink">
                            {product.price.toLocaleString('vi-VN')}đ
                        </span>
                    </div>

                    <button 
                        onClick={handleAddToCart}
                        className="p-1.5 md:p-2 border border-border-subtle rounded-sm hover:bg-market-primary hover:text-white hover:border-market-primary transition-colors text-[#57534E]"
                        title="Thêm vào giỏ hàng"
                    >
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </button>
                </div>
            </div>
        </Link>
    );
};