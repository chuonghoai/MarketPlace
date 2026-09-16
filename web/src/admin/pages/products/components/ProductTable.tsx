import type { Product } from '../../../features/products/models/product.model';
import { ProductTableRow } from './ProductTableRow';

interface Props {
    products: Product[];
    loading: boolean;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onViewDetail: (id: string) => void;
}

export const ProductTable = ({ products, loading, onEdit, onDelete, onViewDetail }: Props) => {
    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="hidden md:table-header-group">
                    <tr>
                        <th className="font-body text-xs font-semibold text-text-muted uppercase pb-3 pt-4 px-6 border-b-[1.5px] border-border-medium">Sản phẩm</th>
                        <th className="font-body text-xs font-semibold text-text-muted uppercase pb-3 pt-4 px-6 border-b-[1.5px] border-border-medium">Giá</th>
                        <th className="font-body text-xs font-semibold text-text-muted uppercase pb-3 pt-4 px-6 border-b-[1.5px] border-border-medium">Kho / Đã bán</th>
                        <th className="font-body text-xs font-semibold text-text-muted uppercase pb-3 pt-4 px-6 border-b-[1.5px] border-border-medium">Đánh giá</th>
                        <th className="font-body text-xs font-semibold text-text-muted uppercase pb-3 pt-4 px-6 border-b-[1.5px] border-border-medium text-right">Hành động</th>
                    </tr>
                </thead>
                <tbody className="font-body text-base text-text-ink">
                    {loading ? (
                        <tr><td colSpan={5} className="text-center py-8 text-text-muted">Đang tải dữ liệu...</td></tr>
                    ) : products.length === 0 ? (
                        <tr><td colSpan={5} className="text-center py-8 text-text-muted">Không có sản phẩm nào.</td></tr>
                    ) : (
                        products.map((item) => (
                            <ProductTableRow
                                key={item.id}
                                product={item}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onViewDetail={onViewDetail}
                            />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};