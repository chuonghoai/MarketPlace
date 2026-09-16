import { useEffect, useState } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import type { HeaderOptions } from '../../layout/AdminLayout';
import type { Product } from '../../features/products/models/product.model';
import { useProductController } from './products.controller';
import { ProductStatusBadge } from './components/ProductStatusBadge';
import { ProductSpecsInfo } from './components/ProductSpecsInfo';
import { ProductReviewList } from './components/ProductReviewList';
import type { Review } from '../../../features/review/models/review.model';

const formatVND = (v: number) => Number(v || 0).toLocaleString('vi-VN');

export const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { setHeaderOptions } = useOutletContext<{ setHeaderOptions: (o: HeaderOptions) => void }>();
    const navigate = useNavigate();
    const { fetchProductById, fetchProductReviews } = useProductController();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState<string>('');
    const [productReviews, setProductReviews] = useState<Review | null>(null);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [reviewsError, setReviewsError] = useState<string | null>(null);

    useEffect(() => {
        setHeaderOptions({
            links: [
                { label: 'Tất cả sản phẩm', href: '/admin/products' },
                { label: 'Chi tiết sản phẩm', href: '#', active: true },
            ],
            showSearch: false,
        });
    }, [setHeaderOptions]);

    useEffect(() => {
        if (id) {
            setLoading(true);
            fetchProductById(id).then(p => { 
                setProduct(p); 
                setCurrentImage(p?.imageUrl || '');
                setLoading(false); 
            });

            // Fetch reviews thực tế
            setReviewsLoading(true);
            setReviewsError(null);
            fetchProductReviews(id).then(res => {
                if (res) {
                    setProductReviews(res);
                } else {
                    setReviewsError('Không thể tải danh sách đánh giá');
                }
            }).catch(() => {
                setReviewsError('Đã xảy ra lỗi khi tải đánh giá');
            }).finally(() => {
                setReviewsLoading(false);
            });
        }
    }, [id, fetchProductById, fetchProductReviews]);

    if (loading) return <div className="max-w-7xl mx-auto py-16 text-center text-text-muted">Đang tải...</div>;
    if (!product) return <div className="max-w-7xl mx-auto py-16 text-center text-error">Không tìm thấy sản phẩm.</div>;

    const isSale = (product.originalPrice ?? 0) > product.price;
    const showBadge = isSale && product.discountPercentage > 0;
    const displayRating = productReviews?.averageRating ?? product.rating;

    return (
        <div className="max-w-7xl mx-auto w-full pb-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="font-headline text-4xl font-semibold text-text-ink">{product.name}</h2>
                    <p className="font-body text-lg text-text-muted mt-1">{product.categoryName || 'Chưa phân loại'}</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => navigate('/admin/products')} className="px-4 py-2 font-body text-sm font-semibold text-text-muted hover:bg-surface-container rounded-lg">← Quay lại</button>
                    <button onClick={() => navigate(`/admin/products/${id}/edit`)} className="btn-primary px-4 py-2 font-body text-sm font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px]">edit</span> Chỉnh sửa
                    </button>
                </div>
            </div>

            <div className="bg-surface-card border border-border-subtle rounded-xl shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Ảnh */}
                    <div className="p-6 space-y-4">
                        <div className="aspect-square bg-surface-container rounded-lg overflow-hidden">
                            <img src={currentImage || 'https://via.placeholder.com/400'} alt={product.name} className="w-full h-full object-cover transition-opacity duration-300" />
                        </div>
                        {product.images && product.images.length > 0 && (
                            <div>
                                <p className="text-sm text-text-muted mb-2">Ảnh chi tiết ({product.images.length})</p>
                                <div className="flex flex-wrap gap-2">
                                    <img 
                                        src={product.imageUrl || 'https://via.placeholder.com/400'} 
                                        alt="Main" 
                                        onClick={() => setCurrentImage(product.imageUrl || '')}
                                        className={`w-20 h-20 object-cover rounded-md border cursor-pointer hover:opacity-80 transition-opacity ${currentImage === product.imageUrl ? 'border-primary-container ring-2 ring-primary-container/50' : 'border-border-subtle'}`} 
                                    />
                                    {product.images.map((url, i) => (
                                        <img key={i} src={url} alt="" onClick={() => setCurrentImage(url)} className={`w-20 h-20 object-cover rounded-md border cursor-pointer hover:opacity-80 transition-opacity ${currentImage === url ? 'border-primary-container ring-2 ring-primary-container/50' : 'border-border-subtle'}`} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Thông tin */}
                    <div className="p-6 space-y-4 border-t lg:border-t-0 lg:border-l border-border-subtle">
                        <div className="flex items-baseline gap-3 flex-wrap">
                            <span className="font-headline text-2xl font-bold text-error">{formatVND(product.price)} đ</span>
                            {isSale && <span className="text-base text-text-muted line-through">{formatVND(product.originalPrice!)} đ</span>}
                            {showBadge && <span className="bg-error text-white text-xs font-bold px-2 py-1 rounded-md">-{product.discountPercentage}%</span>}
                        </div>

                        <div className="flex flex-col gap-1 mt-2">
                            <div className="flex items-center gap-2">
                                <span className="font-body text-sm font-semibold text-text-muted">Tình trạng:</span>
                                <ProductStatusBadge status={product.stock > 10 ? 'in_stock' : (product.stock > 0 ? 'low_stock' : 'out_of_stock')} />
                                <span className="font-body text-sm text-text-ink ml-1">({product.stock} sản phẩm)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-body text-sm font-semibold text-text-muted">Đã bán:</span>
                                <span className="font-body text-sm text-text-ink">{product.soldCount || 0}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-[#eab308]">star</span>
                            <span className="text-sm">{displayRating?.toFixed(1) || '0.0'}</span>
                            {productReviews !== null && (
                                <span className="text-xs text-text-muted">(từ {productReviews.totalReview} đánh giá)</span>
                            )}
                        </div>

                        {product.description && (
                            <div>
                                <p className="font-body text-sm font-semibold text-text-muted mb-1">Mô tả</p>
                                <p className="font-body text-sm text-text-ink whitespace-pre-line">{product.description}</p>
                            </div>
                        )}

                        <div className="pt-2">
                            <ProductSpecsInfo 
                                dimensions={product.dimensions}
                                weight={product.weight}
                                careInstructions={product.careInstructions}
                                materials={product.materials}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Danh sách đánh giá */}
            <ProductReviewList
                reviews={productReviews?.reviews || []}
                loading={reviewsLoading}
                error={reviewsError}
            />
        </div>
    );
};