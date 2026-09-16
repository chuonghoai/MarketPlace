import { useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import type { HeaderOptions } from '../../layout/AdminLayout';
import type { ProductFormData } from '../../features/products/models/product.model';
import { useProductController } from './products.controller';
import { ProductForm } from './components/ProductForm';

export const CreateProductPage = () => {
    const { setHeaderOptions } = useOutletContext<{ setHeaderOptions: (o: HeaderOptions) => void }>();
    const navigate = useNavigate();
    const { saving, handleSaveProduct, categories, fetchCategories } = useProductController();

    useEffect(() => {
        setHeaderOptions({
            links: [
                { label: 'Tất cả sản phẩm', href: '/admin/products' },
                { label: 'Thêm sản phẩm', href: '/admin/products/create', active: true },
            ],
            showSearch: false,
        });
    }, [setHeaderOptions]);

    const handleSave = async (data: ProductFormData) => {
        const success = await handleSaveProduct(data);
        if (success) navigate('/admin/products');
    };

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return (
        <div className="max-w-7xl mx-auto w-full pb-8">
            <div className="mb-6">
                <h2 className="font-headline text-4xl font-semibold text-text-ink">Thêm sản phẩm mới</h2>
                <p className="font-body text-lg text-text-muted mt-2">Điền thông tin sản phẩm bên dưới.</p>
            </div>
            <div className="bg-surface-card border border-border-subtle rounded-xl shadow-sm overflow-hidden">
                <ProductForm categories={categories} onSave={handleSave} saving={saving} onCancel={() => navigate('/admin/products')} />
            </div>
        </div>
    );
};