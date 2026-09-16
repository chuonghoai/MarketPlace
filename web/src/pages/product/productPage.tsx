import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useProductController } from "./product.controller";
import { ProductReviews } from "./components/reviews/productReviews";
import { buildProductUrl } from "../../utils/slug";

function ProductPage() {
    const [reviewRating, setReviewRating] = useState<{ avg: number; total: number } | null>(null);

    const handleReviewsLoaded = useCallback((averageRating: number, totalReview: number) => {
        setReviewRating({ avg: averageRating, total: totalReview });
    }, []);
    const {
        product,
        isLoading,
        isAddingToCart,
        isTogglingFavorite,
        activeImgIndex,
        quantity,
        thumbnailContainerRef,
        setActiveImgIndex,
        scrollThumbnails,
        handleAddToCart,
        handleToggleFavorite,
        handleDecreaseQuantity,
        handleIncreaseQuantity,
        formattedDimensions
    } = useProductController();

    if (isLoading) {
        return (
            <div className="animate-pulse max-w-screen-2xl mx-auto px-6 py-8">
                <Helmet>
                    <title>Đang tải sản phẩm...</title>
                </Helmet>
                <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
                    <div className="w-full md:w-[55%] aspect-4/5 md:h-175 bg-[#F5F5F4]" />
                    <div className="w-full md:w-[45%] space-y-6 pt-4">
                        <div className="h-4 bg-[#F5F5F4] rounded w-1/4" />
                        <div className="h-12 bg-[#F5F5F4] rounded w-full" />
                        <div className="h-8 bg-[#F5F5F4] rounded w-1/3" />
                        <div className="h-32 bg-[#F5F5F4] rounded w-full" />
                        <div className="h-12 bg-[#F5F5F4] rounded w-full mt-8" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) return null;

    const allImages = [product.imageUrl, ...(product.images || [])];
    const isSale = product.originalPrice !== undefined && product.originalPrice > product.price;
    const isOutOfStock = product.stock === 0;
    const canonicalUrl = `${window.location.origin}${buildProductUrl(product)}`;

    const structuredData = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": allImages,
        "description": product.description.split('\n')[0],
        "sku": product.id,
        "offers": {
            "@type": "Offer",
            "url": canonicalUrl,
            "priceCurrency": "VND",
            "price": product.price,
            "availability": isOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition"
        },
        ...(reviewRating && reviewRating.total > 0 && {
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": reviewRating.avg,
                "reviewCount": reviewRating.total
            }
        })
    };

    return (
        <main className="min-h-screen bg-[#FFFBF5] font-['Open_Sans',sans-serif] text-[#1e1b17] selection:bg-[#ffdbd0] selection:text-[#390c00]">
            <Helmet>
                <title>{product.name}</title>
                <meta name="description" content={product.description.split('\n')[0]} />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:title" content={product.name} />
                <meta property="og:description" content={product.description.split('\n')[0]} />
                <meta property="og:image" content={product.imageUrl} />
                <meta property="og:type" content="product" />
                <meta property="og:url" content={canonicalUrl} />
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Helmet>

            <article className="max-w-screen-2xl mx-auto px-6 py-6 md:py-8">

                {/* ── Breadcrumbs ── */}
                <nav aria-label="Breadcrumb" className="mb-6 md:mb-8">
                    <ol className="flex items-center flex-wrap gap-2 text-[13px] text-[#78716C] font-medium tracking-wide">
                        <li>
                            <Link to="/" className="hover:text-market-primary transition-colors flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Trang chủ
                            </Link>
                        </li>
                        <li><span className="text-[#D6D3D1]">/</span></li>
                        <li>
                            <Link
                                to={`/?categories=${product.categoryId}`}
                                className="hover:text-market-primary transition-colors"
                            >
                                {product.categoryName}
                            </Link>
                        </li>
                        <li><span className="text-[#D6D3D1]">/</span></li>
                        <li className="text-[#1C1917] font-semibold">{product.name}</li>
                    </ol>
                </nav>

                {/* ── Product Hero ── */}
                <div className="flex flex-col md:flex-row gap-12 lg:gap-24 mb-24">

                    {/* Left – Images */}
                    <div className="w-full md:w-[55%]">
                        {/* Main image */}
                        <div className="relative w-full aspect-4/5 md:aspect-auto md:h-175 border border-[#E7E5E4] bg-[#FAF2EB] rounded-[8px] overflow-hidden group shadow-sm">
                            <img
                                src={allImages[activeImgIndex]}
                                alt={product.name}
                                loading="eager"
                                width="800"
                                height="1000"
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                            />
                            {/* Discount badge */}
                            {isSale && product.discountPercentage && (
                                <div className="absolute top-4 left-4 bg-[#DC2626] text-white text-[12px] font-bold px-3 py-1.5 rounded-[4px] uppercase tracking-widest shadow-sm">
                                    -{product.discountPercentage}%
                                </div>
                            )}
                            {/* Out of stock overlay */}
                            {isOutOfStock && (
                                <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[2px]">
                                    <span className="bg-white border border-[#E7E5E4] text-[#78716C] text-[13px] font-semibold px-6 py-2.5 rounded-[4px] uppercase tracking-widest shadow-sm">
                                        Hết hàng
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails slider */}
                        {allImages.length > 1 && (
                            <div className="relative group/slider mt-3">
                                <button
                                    onClick={() => scrollThumbnails('left')}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 flex items-center justify-center bg-white border border-border-subtle text-[#78716C] hover:text-text-ink hover:border-border-medium opacity-0 group-hover/slider:opacity-100 transition-all duration-200 shadow-sm"
                                    aria-label="Xem ảnh trước"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                </button>

                                <div
                                    ref={thumbnailContainerRef}
                                    className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
                                >
                                    {allImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImgIndex(idx)}
                                            aria-label={`Ảnh ${idx + 1}`}
                                            className={`relative w-[72px] h-[72px] shrink-0 border-2 transition-all duration-200 flex items-center justify-center bg-[#FAF2EB] overflow-hidden
                                                ${activeImgIndex === idx
                                                    ? 'border-[#c2410c] opacity-100'
                                                    : 'border-transparent opacity-50 hover:opacity-100 cursor-pointer'
                                                }`}
                                        >
                                            <img src={img} loading="lazy" width="72" height="72" className="w-full h-full object-cover" alt={`${product.name} - ảnh ${idx + 1}`} />
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => scrollThumbnails('right')}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 flex items-center justify-center bg-white border border-[#E7E5E4] text-[#78716C] hover:text-[#1C1917] hover:border-[#D6D3D1] opacity-0 group-hover/slider:opacity-100 transition-all duration-200 shadow-sm"
                                    aria-label="Xem ảnh tiếp theo"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right – Product Info */}
                    <div className="w-full md:w-[45%] flex flex-col justify-start md:pt-2">

                        {/* Category + sold count */}
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#9b2f00]">
                                {product.categoryName}
                            </span>
                            {product.soldCount !== undefined && (
                                <>
                                    <span className="w-1 h-1 rounded-full bg-[#D6D3D1]" />
                                    <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#59413a]">
                                        {product.soldCount.toLocaleString('vi-VN')} đã sưu tầm
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Product name */}
                        <h1 className="font-['Lora',serif] text-[28px] md:text-[40px] font-bold leading-[1.2] md:leading-[1.15] tracking-[0.01em] text-[#1C1917] mb-4">
                            {product.name}
                        </h1>

                        {/* Rating — lấy từ review thực tế, fallback về product.rating */}
                        {(() => {
                            const displayRating = reviewRating?.avg ?? product.rating;
                            if (displayRating === undefined) return null;
                            return (
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex items-center gap-0.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg
                                                key={star}
                                                className={`w-4 h-4 ${star <= Math.round(displayRating) ? 'text-[#D97706] fill-current' : 'text-[#E7E5E4] fill-current'}`}
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-[13px] text-[#59413a]">{displayRating.toFixed(1)}</span>
                                </div>
                            );
                        })()}

                        {/* Price */}
                        <div className="flex items-baseline gap-3 mb-6">
                            <span className="font-['Lora',serif] text-[26px] md:text-[32px] font-semibold text-[#1C1917] tracking-tight">
                                {Number(product.price).toLocaleString('vi-VN')} ₫
                            </span>
                            {isSale && (
                                <span className="text-[16px] md:text-[18px] text-[#A8A29E] line-through font-light">
                                    {Number(product.originalPrice).toLocaleString('vi-VN')} ₫
                                </span>
                            )}
                        </div>

                        {/* Short description / first 2 lines */}
                        <p className="text-[16px] leading-[1.6] text-[#1e1b17] mb-6">
                            {product.description.split('\n')[0]}
                        </p>

                        {/* Material chips */}
                        {product.materials && product.materials.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-8">
                                {product.materials.map((mat) => (
                                    <span
                                        key={mat}
                                        className="px-3 py-1 border border-[#3f5d1d] bg-[#3f5d1d]/5 text-[#3f5d1d] text-[12px] font-medium leading-[1.4] tracking-[0.02em] rounded"
                                    >
                                        {mat}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Dimensions */}
                        {formattedDimensions && (
                            <p className="text-[14px] text-[#59413a] mb-6">
                                <span className="font-semibold text-[#1e1b17]">Kích thước: </span>
                                {formattedDimensions}
                            </p>
                        )}

                        {/* Stock status */}
                        {!isOutOfStock && (
                            <div className="mb-6">
                                <span className={`inline-flex items-center gap-2 text-[13px] font-medium px-3 py-1 rounded-full
                                    ${product.stock < 10
                                        ? 'bg-[#FEF3C7] text-[#D97706]'
                                        : 'bg-[#f0f9eb] text-[#3f5d1d]'
                                    }`}>
                                    <span className={`w-2 h-2 rounded-full animate-pulse ${product.stock < 10 ? 'bg-[#D97706]' : 'bg-[#3f5d1d]'}`} />
                                    {product.stock < 10 ? `Chỉ còn ${product.stock} sản phẩm` : `Còn hàng (${product.stock})`}
                                </span>
                            </div>
                        )}

                        {/* ── Actions ── */}
                        {isOutOfStock ? (
                            <div className="flex gap-3 items-stretch h-[52px]">
                                <div className="flex-1 flex items-center justify-center gap-2 bg-[#FEF2F2] text-[#EF4444] border border-[#FCA5A5] font-medium text-[15px] px-4">
                                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <span>Rất tiếc, sản phẩm đã hết hàng</span>
                                </div>

                                {/* Favorite */}
                                <button
                                    onClick={handleToggleFavorite}
                                    disabled={isTogglingFavorite}
                                    className={`w-[52px] border flex items-center justify-center transition-all duration-200
                                        ${product.isFavorite
                                            ? 'bg-[#FEF2F2] border-[#FCA5A5] text-[#EF4444]'
                                            : 'bg-white border-[#D6D3D1] text-[#A8A29E] hover:border-[#1C1917] hover:text-[#1C1917]'
                                        } disabled:opacity-50 disabled:cursor-wait`}
                                    aria-label={product.isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
                                >
                                    <svg className={`w-5 h-5 transition-transform duration-200 ${product.isFavorite ? 'fill-current scale-110' : 'fill-none scale-100'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col md:flex-row gap-3 md:items-stretch md:h-13">
                                    {/* Quantity */}
                                    <div className="flex items-center border border-border-medium bg-white h-13 md:h-full w-30 shrink-0 overflow-hidden">
                                        <button onClick={handleDecreaseQuantity} aria-label="Giảm số lượng" className="flex-1 h-full text-[#78716C] hover:bg-[#FAF2EB] hover:text-text-ink transition-colors text-lg font-light">−</button>
                                        <input type="number" readOnly value={quantity} className="w-10 text-center bg-transparent font-medium text-text-ink outline-none text-[15px]" />
                                        <button onClick={handleIncreaseQuantity} aria-label="Tăng số lượng" className="flex-1 h-full text-[#78716C] hover:bg-[#FAF2EB] hover:text-text-ink transition-colors text-lg font-light">+</button>
                                    </div>

                                    {/* Actions Wrapper */}
                                    <div className="flex flex-1 gap-3 items-stretch h-13 md:h-full">
                                        {/* Add to cart */}
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={isAddingToCart}
                                            className="flex-1 bg-primary-container text-white h-full font-semibold text-[15px] flex items-center justify-center gap-2.5 hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#FFFBF5] transition-colors duration-200 disabled:opacity-75 disabled:cursor-not-allowed"
                                        >
                                            {isAddingToCart ? (
                                                <svg className="w-5 h-11 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                </svg>
                                            )}
                                            {isAddingToCart ? "Đang chuẩn bị..." : "Thêm vào giỏ"}
                                        </button>

                                        {/* Favorite */}
                                        <button
                                            onClick={handleToggleFavorite}
                                            disabled={isTogglingFavorite}
                                            className={`w-13 border flex items-center justify-center transition-all duration-200
                                                ${product.isFavorite
                                                    ? 'bg-[#FEF2F2] border-[#FCA5A5] text-[#EF4444]'
                                                    : 'bg-white border-border-medium text-[#A8A29E] hover:border-text-ink hover:text-text-ink'
                                                } disabled:opacity-50 disabled:cursor-wait`}
                                            aria-label={product.isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
                                        >
                                            <svg className={`w-5 h-5 transition-transform duration-200 ${product.isFavorite ? 'fill-current scale-110' : 'fill-none scale-100'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <p className="text-[12px] text-on-surface-variant text-center tracking-wide">
                                    Giao hàng toàn quốc · Đóng gói thân thiện môi trường
                                </p>
                            </div>
                        )}

                        {/* ── Meet the Maker ── */}
                        <div className="border-t border-[#E7E5E4] mt-8 md:mt-10 pt-6 md:pt-8">
                            <h2 className="font-['Lora',serif] text-[20px] md:text-[22px] font-semibold text-[#1C1917] mb-4 md:mb-5">
                                Gặp gỡ nghệ nhân
                            </h2>
                            <div className="flex items-start gap-4 group cursor-pointer">
                                <div className="w-16 h-16 rounded-full overflow-hidden border border-[#E7E5E4] shrink-0 bg-[#F5F5F4]">
                                    <img
                                        src={product.sellerInfo.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.sellerInfo.name)}&background=F5F5F4&color=1C1917`}
                                        alt={product.sellerInfo.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-['Open_Sans',sans-serif] text-[16px] font-semibold text-[#1e1b17] group-hover:text-[#9b2f00] transition-colors">
                                        {product.sellerInfo.name}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-1 text-[13px] text-[#59413a]">
                                        {product.sellerInfo.averageRating !== undefined && (
                                            <span className="flex items-center gap-1 text-[#D97706] font-semibold">
                                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                                {product.sellerInfo.averageRating}
                                            </span>
                                        )}
                                        {product.sellerInfo.averageRating !== undefined && product.sellerInfo.totalProducts !== undefined && (
                                            <span className="text-[#D6D3D1]">|</span>
                                        )}
                                        {product.sellerInfo.totalProducts !== undefined && (
                                            <span>{product.sellerInfo.totalProducts} tác phẩm</span>
                                        )}
                                    </div>
                                    <button className="mt-2 text-[13px] text-[#9b2f00] hover:text-[#c2410c] underline underline-offset-4 transition-colors">
                                        Xem hồ sơ nghệ nhân →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Story + Specs ── */}
                <section className="border-t border-[#E7E5E4] pt-20 pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                        {/* Description / Story */}
                        <div className="lg:col-span-8">
                            <h2 className="font-['Lora',serif] text-[24px] md:text-[32px] font-semibold text-[#1C1917] mb-6 md:mb-8">
                                Câu chuyện tác phẩm
                            </h2>
                            <div className="prose prose-stone max-w-none text-[17px] leading-[1.8] text-[#57534E]">
                                <p className="whitespace-pre-line m-0">{product.description}</p>
                                <blockquote className="border-l-2 border-[#c2410c] pl-6 my-10 italic font-['Lora',serif] text-[20px] text-[#1e1b17] leading-relaxed bg-gradient-to-r from-[#FAFAF9] to-transparent py-3 not-italic">
                                    "Mỗi dấu tay trên sản phẩm là một câu chuyện riêng, không tác phẩm nào giống tác phẩm nào."
                                </blockquote>
                            </div>
                        </div>

                        {/* Specifications */}
                        <aside className="lg:col-span-4 mt-8 lg:mt-0">
                            <h2 className="font-['Lora',serif] text-[20px] md:text-[22px] font-semibold text-[#1C1917] mb-5 md:mb-6">
                                Đặc tả kỹ thuật
                            </h2>
                            <div className="border border-[#E7E5E4] bg-white p-6 space-y-0">
                                {product.materials && product.materials.length > 0 && (
                                    <div className="flex flex-col gap-1 pb-4 border-b border-[#E7E5E4]">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#78716C]">Chất liệu</span>
                                        <span className="text-[14px] text-[#1e1b17] leading-relaxed">{product.materials.join(', ')}</span>
                                    </div>
                                )}
                                {formattedDimensions && (
                                    <div className="flex flex-col gap-1 py-4 border-b border-[#E7E5E4]">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#78716C]">Kích thước</span>
                                        <span className="text-[14px] text-[#1e1b17]">{formattedDimensions}</span>
                                    </div>
                                )}
                                {product.weight !== undefined && product.weight !== null && (
                                    <div className="flex flex-col gap-1 py-4 border-b border-[#E7E5E4]">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#78716C]">Trọng lượng</span>
                                        <span className="text-[14px] text-[#1e1b17]">{product.weight} kg</span>
                                    </div>
                                )}
                                <div className="flex flex-col gap-1 pt-4">
                                    <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#78716C]">Bảo quản</span>
                                    <span className="text-[14px] text-[#1e1b17] leading-relaxed whitespace-pre-line">
                                        {product.careInstructions || 'Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp.'}
                                    </span>
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>

                {/* ── Reviews ── */}
                <ProductReviews productId={product.id} onReviewsLoaded={handleReviewsLoaded} />

            </article>
        </main>
    );
}

export default ProductPage;