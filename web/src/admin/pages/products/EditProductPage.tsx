import { useEffect, useState } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import type { HeaderOptions } from '../../layout/AdminLayout';
import type { Product, ProductFormData } from '../../features/products/models/product.model';
import { useProductController } from './products.controller';
import { ProductForm } from './components/ProductForm';

export const EditProductPage = () => {
    const { id } = useParams<{ id: string }>();
    const { setHeaderOptions } = useOutletContext<{ setHeaderOptions: (o: HeaderOptions) => void }>();
    const navigate = useNavigate();
    const { saving, handleSaveProduct, fetchProductById, categories, fetchCategories } = useProductController();
    const [product, setProduct] = useState<Product | null>(null);
    const [loadingProduct, setLoadingProduct] = useState(true);

    useEffect(() => {
        setHeaderOptions({
            links: [
                { label: 'Tất cả sản phẩm', href: '/admin/products' },
                { label: 'Chỉnh sửa sản phẩm', href: '#', active: true },
            ],
            showSearch: false,
        });
    }, [setHeaderOptions]);

    useEffect(() => {
        if (id) {
            setLoadingProduct(true);
            fetchProductById(id).then(p => {
                setProduct(p);
                setLoadingProduct(false);
            });
        }
    }, [id, fetchProductById]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleSave = async (data: ProductFormData) => {
        const success = await handleSaveProduct(data, id);
        if (success) navigate('/admin/products');
    };

    if (loadingProduct) {
        return <div className="max-w-7xl mx-auto w-full py-16 text-center text-text-muted">Đang tải sản phẩm...</div>;
    }

    if (!product) {
        return <div className="max-w-7xl mx-auto w-full py-16 text-center text-error">Không tìm thấy sản phẩm.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto w-full pb-8">
            <div className="mb-6">
                <h2 className="font-headline text-4xl font-semibold text-text-ink">Chỉnh sửa sản phẩm</h2>
                <p className="font-body text-lg text-text-muted mt-2">{product.name}</p>
            </div>
            <div className="bg-surface-card border border-border-subtle rounded-xl shadow-sm overflow-hidden">
                <ProductForm categories={categories} onSave={handleSave} editingProduct={product} saving={saving} onCancel={() => navigate('/admin/products')} />
            </div>
        </div>
    );
};