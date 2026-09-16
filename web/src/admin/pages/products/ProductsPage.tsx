import { useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import type { HeaderOptions } from '../../layout/AdminLayout';
import { useProductController } from './products.controller';
import { ProductTable } from './components/ProductTable';

export const ProductsPage = () => {
    const { setHeaderOptions } = useOutletContext<{ setHeaderOptions: (options: HeaderOptions) => void }>();
    const navigate = useNavigate();
    const {
        products, loading, error, page, totalPages,
        fetchProducts, handlePageChange, handleDeleteProduct,
    } = useProductController();

    useEffect(() => {
        setHeaderOptions({
            links: [
                { label: 'Tất cả sản phẩm', href: '/admin/products', active: true },
                { label: 'Danh mục', href: '/admin/categories' },
            ],
            showSearch: true,
            rightActions: (
                <button
                    onClick={() => navigate('/admin/products/create')}
                    className="btn-primary font-body text-sm font-semibold px-4 py-2 hover:-translate-y-0.5 flex items-center gap-1"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Thêm sản phẩm
                </button>
            ),
        });
    }, [setHeaderOptions, navigate]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <div className="max-w-7xl mx-auto space-y-8 w-full pb-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="font-headline text-4xl font-semibold text-text-ink">Quản lý Sản phẩm</h2>
                    <p className="font-body text-lg text-text-muted mt-2">Danh sách tất cả các sản phẩm trên hệ thống.</p>
                </div>
            </div>

            {error && (
                <div className="bg-[#fee2e2] text-error rounded-xl px-6 py-4 font-body text-sm">{error}</div>
            )}

            <div className="bg-surface-card border border-border-subtle rounded-xl shadow-sm">
                <ProductTable
                    products={products}
                    loading={loading}
                    onEdit={(id) => navigate(`/admin/products/${id}/edit`)}
                    onDelete={handleDeleteProduct}
                    onViewDetail={(id) => navigate(`/admin/products/${id}`)}
                />

                {totalPages > 1 && (
                    <div className="p-4 border-t border-border-subtle flex justify-between items-center">
                        <button disabled={page <= 1} onClick={() => handlePageChange(page - 1)} className="px-3 py-1 bg-surface-container rounded-md disabled:opacity-50 text-sm font-semibold">
                            Trang trước
                        </button>
                        <span className="text-sm font-semibold text-text-muted">Trang {page} / {totalPages}</span>
                        <button disabled={page >= totalPages} onClick={() => handlePageChange(page + 1)} className="px-3 py-1 bg-surface-container rounded-md disabled:opacity-50 text-sm font-semibold">
                            Trang sau
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};