import { useState, useRef, useEffect } from 'react';
import type { Product } from '../../../features/products/models/product.model';
import { ProductStatusBadge } from './ProductStatusBadge';

interface Props {
    product: Product;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onViewDetail: (id: string) => void;
}

export const ProductTableRow = ({ product, onEdit, onDelete, onViewDetail }: Props) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <tr className="hover:bg-surface-container transition-colors border-b border-border-subtle flex flex-col md:table-row relative group">
            {/* MOBILE ONLY VIEW */}
            <td className="p-4 md:hidden block w-full">
                <div className="flex flex-col gap-3 w-full">
                    {/* Ảnh + Tên + Nút More */}
                    <div className="flex items-start gap-3 relative">
                        <img
                            src={product.imageUrl || 'https://via.placeholder.com/64'}
                            alt={product.name}
                            className="w-16 h-16 rounded object-cover border border-border-subtle shrink-0 cursor-pointer"
                            onClick={() => onViewDetail(product.id)}
                        />
                        <div className="flex-1 min-w-0 pr-8 cursor-pointer" onClick={() => onViewDetail(product.id)}>
                            <p className="font-headline text-[15px] font-semibold text-text-ink line-clamp-2 leading-snug mb-0.5 hover:text-primary-container transition-colors">
                                {product.name}
                            </p>
                            <p className="text-xs text-text-muted truncate">{product.categoryName || 'Chưa phân loại'}</p>
                        </div>
                        <div className="absolute top-0 right-0" ref={menuRef}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMenu(!showMenu);
                                }}
                                className="p-1 text-text-muted hover:text-text-ink rounded-full hover:bg-surface-container-highest transition-colors"
                            >
                                <span className="material-symbols-outlined">more_vert</span>
                            </button>

                            {/* Dropdown Menu */}
                            {showMenu && (
                                <div className="absolute top-full right-0 mt-1 w-44 bg-white rounded-md shadow-lg border border-border-subtle z-50 overflow-hidden">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setShowMenu(false); onViewDetail(product.id); }}
                                        className="w-full text-left px-4 py-3 text-sm text-text-ink hover:bg-surface-container flex items-center gap-3 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[20px] text-text-muted">visibility</span>
                                        Xem chi tiết
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setShowMenu(false); onEdit(product.id); }}
                                        className="w-full text-left px-4 py-3 text-sm text-text-ink hover:bg-surface-container flex items-center gap-3 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[20px] text-text-muted">edit</span>
                                        Chỉnh sửa
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete(product.id); }}
                                        className="w-full text-left px-4 py-3 text-sm text-error hover:bg-surface-container flex items-center gap-3 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                        Xóa
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Giá + Đánh giá */}
                    <div className="flex items-center justify-between mt-1">
                        <span className="font-semibold text-text-ink text-[15px]">
                            {product.price.toLocaleString('vi-VN')} đ
                        </span>
                        <div className="flex items-center text-[#eab308]">
                            <span className="material-symbols-outlined text-[16px]">star</span>
                            <span className="ml-1 text-sm text-text-ink font-medium">{product.rating?.toFixed(1) || '0.0'}</span>
                        </div>
                    </div>

                    {/* Kho + Đã bán */}
                    <div className="flex items-center justify-between text-sm text-text-muted mt-1">
                        <div className="flex items-center gap-2">
                            <span>Kho: {product.stock}</span>
                            <ProductStatusBadge status={product.stock > 10 ? 'in_stock' : (product.stock > 0 ? 'low_stock' : 'out_of_stock')} />
                        </div>
                        <span>Đã bán: {product.soldCount || 0}</span>
                    </div>
                </div>
            </td>

            {/* DESKTOP VIEW - Hides on Mobile */}
            <td className="py-4 px-6 hidden md:table-cell">
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => onViewDetail(product.id)}>
                    <img
                        src={product.imageUrl || 'https://via.placeholder.com/48'}
                        alt={product.name}
                        className="w-12 h-12 rounded object-cover border border-border-subtle"
                    />
                    <div>
                        <p className="font-headline text-base font-semibold text-text-ink hover:text-primary-container transition-colors">
                            {product.name}
                        </p>
                        <p className="text-xs text-text-muted">{product.categoryName || 'Chưa phân loại'}</p>
                    </div>
                </div>
            </td>
            <td className="py-4 px-6 font-semibold hidden md:table-cell">
                {product.price.toLocaleString('vi-VN')} đ
            </td>
            <td className="py-4 px-6 hidden md:table-cell">
                <div className="flex flex-col gap-1">
                    <ProductStatusBadge status={product.stock > 10 ? 'in_stock' : (product.stock > 0 ? 'low_stock' : 'out_of_stock')} />
                    <span className="text-xs text-text-muted">Tồn: {product.stock} | Đã bán: {product.soldCount || 0}</span>
                </div>
            </td>
            <td className="py-4 px-6 hidden md:table-cell">
                <div className="flex items-center text-[#eab308]">
                    <span className="material-symbols-outlined text-[16px]">star</span>
                    <span className="ml-1 text-sm text-text-ink">{product.rating?.toFixed(1) || '0.0'}</span>
                </div>
            </td>
            <td className="py-4 px-6 text-right hidden md:table-cell">
                <button onClick={() => onViewDetail(product.id)} className="text-text-muted hover:text-primary-container p-2" title="Xem chi tiết">
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                </button>
                <button onClick={() => onEdit(product.id)} className="text-text-muted hover:text-primary-container p-2" title="Chỉnh sửa">
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                </button>
                <button onClick={() => onDelete(product.id)} className="text-text-muted hover:text-error p-2" title="Xóa">
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
            </td>
        </tr>
    );
};