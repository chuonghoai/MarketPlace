import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../../components/toast/toast";
import { useProductStore } from "./product.store";
import { buildProductUrl, extractProductIdFromSlug } from "../../utils/slug";

export const useProductController = () => {
    // Supports 3 route patterns:
    // 1. /:productSlug  (new, e.g. /ao-thun-nam-basic-p789)
    // 2. /product/:id   (legacy)
    // 3. /product/:slug/:id (legacy)
    const { productSlug, id } = useParams<{ productSlug?: string; slug?: string; id?: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    const store = useProductStore();

    // Parse product ID from any of the 3 URL formats
    const parsedId = useMemo(() => {
        // Legacy routes: /product/:id or /product/:slug/:id
        if (id) return id;
        // New route: /:productSlug (e.g. ao-thun-nam-basic-p789)
        if (productSlug) return extractProductIdFromSlug(productSlug);
        return null;
    }, [id, productSlug]);

    // UI States
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
    const [isTogglingFavorite, setIsTogglingFavorite] = useState<boolean>(false);
    const [activeImgIndex, setActiveImgIndex] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(1);
    const thumbnailContainerRef = useRef<HTMLDivElement>(null);

    // Init pages - load product detail
    useEffect(() => {
        if (!parsedId) {
            toast("Không tìm thấy mã sản phẩm", "error");
            navigate("/");
            return;
        }

        setIsLoading(true);
        store.loadProduct(parsedId)
            .catch(() => {
                toast("Đã xảy ra lỗi khi tải sản phẩm", "error");
                navigate("/");
            })
            .finally(() => {
                setIsLoading(false);
            });

        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [parsedId]);

    // Validate slug & backward compatibility redirect
    useEffect(() => {
        if (store.product && store.product.id === parsedId) {
            const expectedUrl = buildProductUrl(store.product);
            if (location.pathname !== expectedUrl) {
                navigate(expectedUrl, { replace: true });
            }
        }
    }, [store.product, parsedId, location.pathname, navigate]);

    // Control thumbnail slider (list product's images)
    const scrollThumbnails = (direction: "left" | "right") => {
        if (thumbnailContainerRef.current) {
            const scrollAmount = 200;
            thumbnailContainerRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    // Handlers action in UI, delegate to store to call services
    const handleAddToCart = async () => {
        setIsAddingToCart(true);
        try {
            await store.addToCart(quantity);
        } catch {
            toast("Lỗi kết nối. Vui lòng thử lại", "error");
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleToggleFavorite = async () => {
        setIsTogglingFavorite(true);
        try {
            await store.toggleFavorite();
        } catch {
            toast("Lỗi kết nối. Vui lòng thử lại", "error");
        } finally {
            setIsTogglingFavorite(false);
        }
    };

    const handleDecreaseQuantity = () => {
        setQuantity(prev => Math.max(1, prev - 1));
    };

    const handleIncreaseQuantity = () => {
        const maxStock = store.product?.stock ?? 1;
        setQuantity(prev => Math.min(maxStock, prev + 1));
    };

    // ViewModel derivations
    const formattedDimensions = useMemo(() => {
        if (!store.product?.dimensions || !Array.isArray(store.product.dimensions) || store.product.dimensions.length !== 3) {
            return null;
        }
        const [l, w, h] = store.product.dimensions;
        return `${l} cm × ${w} cm × ${h} cm`;
    }, [store.product?.dimensions]);

    return {
        // Data store
        product: store.product,
        formattedDimensions,

        // UI states
        isLoading,
        isAddingToCart,
        isTogglingFavorite,
        activeImgIndex,
        quantity,
        thumbnailContainerRef,

        // UI handlers
        setActiveImgIndex,
        scrollThumbnails,
        handleAddToCart,
        handleToggleFavorite,
        handleDecreaseQuantity,
        handleIncreaseQuantity,
    };
};