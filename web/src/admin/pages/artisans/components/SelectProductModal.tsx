import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  artisanId?: string | null;
  artisanName?: string | null;
  artisanAvatar?: string | null;
}

interface SelectProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (selectedIds: string[]) => void;
  existingProductIds: string[];
  currentArtisanId?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const SelectProductModal: React.FC<SelectProductModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  existingProductIds,
  currentArtisanId
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [confirmProduct, setConfirmProduct] = useState<Product | null>(null);
  const [overriddenProducts, setOverriddenProducts] = useState<Set<string>>(new Set());
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Initialize selectedIds when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedIds(new Set(existingProductIds));
    }
  }, [isOpen, existingProductIds]);

  // Click outside
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (confirmProduct) return;
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Fetch products
  useEffect(() => {
    if (!isOpen) return;
    
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/products`, {
          params: {
            page,
            pageSize: 5,
            search: search
          }
        });
        // Handle standard pagination response
        const data = res.data.data?.data || res.data.data || [];
        const total = res.data.pagination?.totalPages || res.data.data?.totalPages || 1;
        setProducts(data);
        setTotalPages(total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchProducts, 500);
    return () => clearTimeout(timeout);
  }, [isOpen, search, page]);

  if (!isOpen) return null;

  const handleToggle = (product: Product) => {
    const isChecked = selectedIds.has(product.id);
    const isOwnedByOther = product.artisanId && product.artisanId !== currentArtisanId;

    if (!isChecked && isOwnedByOther && !overriddenProducts.has(product.id)) {
      setConfirmProduct(product);
      return;
    }

    const newSet = new Set(selectedIds);
    if (newSet.has(product.id)) newSet.delete(product.id);
    else newSet.add(product.id);
    setSelectedIds(newSet);
  };

  const handleConfirmOverride = () => {
    if (confirmProduct) {
      const newSet = new Set(selectedIds);
      newSet.add(confirmProduct.id);
      setSelectedIds(newSet);
      
      const newOverrideSet = new Set(overriddenProducts);
      newOverrideSet.add(confirmProduct.id);
      setOverriddenProducts(newOverrideSet);
      
      setConfirmProduct(null);
    }
  };

  const handleAdd = () => {
    onAdd(Array.from(selectedIds));
    setSelectedIds(new Set());
    setOverriddenProducts(new Set());
  };

  return (
    <div 
      className="fixed inset-0 z-100 bg-black/60 flex items-center justify-center p-4 transition-opacity"
      onMouseDown={handleOverlayClick}
    >
      <div 
        ref={modalRef} 
        className="bg-surface-card w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col border border-border-subtle"
      >
        <div className="p-6 border-b border-border-subtle flex justify-between items-center">
          <h2 className="text-xl font-bold text-text-ink">Gán sản phẩm cho nghệ danh</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-ink">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 flex-1 overflow-hidden flex flex-col">
          <div className="relative mb-4">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">search</span>
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-medium bg-surface-container focus:outline-none focus:border-primary text-text-ink"
            />
          </div>

          <div className="flex-1 overflow-y-auto border border-border-subtle rounded-xl min-h-75">
            {loading ? (
              <div className="flex justify-center items-center h-full text-text-muted">Đang tải...</div>
            ) : products.length === 0 ? (
              <div className="flex justify-center items-center h-full text-text-muted">Không tìm thấy sản phẩm.</div>
            ) : (
              <ul className="divide-y divide-border-subtle">
                {products.map(product => {
                  const isChecked = selectedIds.has(product.id);
                  const isInitiallyExisting = existingProductIds.includes(product.id);
                  const isOwnedByOther = product.artisanId && product.artisanId !== currentArtisanId && !overriddenProducts.has(product.id);

                  return (
                    <li key={product.id} className={`flex items-center p-4 hover:bg-surface-container/50 ${isOwnedByOther ? 'bg-surface-container/30' : ''}`}>
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggle(product)}
                        className="w-5 h-5 text-primary bg-surface-container border-border-medium rounded focus:ring-primary focus:ring-2 mr-4 cursor-pointer"
                      />
                      <img src={product.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover border border-border-subtle mr-4" />
                      <div className="flex flex-col">
                        <span className={`font-semibold ${isOwnedByOther ? 'text-text-ink font-bold' : 'text-text-ink'}`}>
                          {product.name}
                          {isInitiallyExisting && <span className="ml-2 text-xs font-normal text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">(Đã gán)</span>}
                        </span>
                        {isOwnedByOther && (
                          <div className="flex items-center gap-2 mt-1">
                            {product.artisanAvatar ? (
                              <img src={product.artisanAvatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                            ) : (
                              <span className="material-symbols-outlined text-[16px] text-text-muted">person</span>
                            )}
                            <span className="text-xs text-text-muted">Thuộc về: <span className="font-medium text-text-ink">{product.artisanName}</span></span>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-semibold border border-border-medium rounded-lg disabled:opacity-50 text-text-ink hover:bg-surface-container"
            >
              Trước
            </button>
            <span className="text-sm font-semibold text-text-muted">Trang {page} / {totalPages || 1}</span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-4 py-2 text-sm font-semibold border border-border-medium rounded-lg disabled:opacity-50 text-text-ink hover:bg-surface-container"
            >
              Sau
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-border-subtle flex justify-end gap-3 bg-surface-container/30 rounded-b-2xl">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 font-semibold text-text-ink hover:bg-surface-container rounded-lg transition-colors border border-border-medium"
          >
            Hủy
          </button>
          <button 
            onClick={handleAdd}
            className="px-5 py-2.5 font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            Cập nhật ({selectedIds.size})
          </button>
        </div>

        {/* Confirm Modal Overlay */}
        {confirmProduct && (
          <div className="absolute inset-0 z-50 bg-black/40 flex items-center justify-center rounded-2xl backdrop-blur-sm">
            <div className="bg-surface-card p-6 rounded-xl shadow-xl w-3/4 max-w-sm border border-border-subtle text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-error/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-error text-3xl">warning</span>
              </div>
              <h3 className="text-lg font-bold text-text-ink mb-2">Đổi người sở hữu?</h3>
              <p className="text-sm text-text-muted mb-6">
                Sản phẩm này đã thuộc về <strong>{confirmProduct.artisanName}</strong>. Bạn có chắc chắn muốn thay đổi người sở hữu?
              </p>
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => setConfirmProduct(null)}
                  className="px-4 py-2 font-semibold text-text-ink hover:bg-surface-container rounded-lg border border-border-medium"
                >
                  Hủy
                </button>
                <button 
                  onClick={handleConfirmOverride}
                  className="px-4 py-2 font-semibold text-white bg-error hover:bg-error/90 rounded-lg"
                >
                  Có, thay đổi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
