import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Product, ProductFormData } from '../../../features/products/models/product.model';
import { ProductImageUploader } from './ProductImageUploader';
import { MaterialTagInput } from './MaterialTagInput';
import { ProductStatusBadge } from './ProductStatusBadge';
import { ProductSpecsInfo } from './ProductSpecsInfo';
import type { Category } from '../../../../features/category/models/category.model';

interface Props {
    categories?: Category[];
    onSave: (data: ProductFormData) => void;
    editingProduct?: Product | null;
    saving: boolean;
    onCancel: () => void;
}

const formatVND = (value: number) => Number(value || 0).toLocaleString('vi-VN');

export const ProductForm = ({ categories = [], onSave, editingProduct, saving, onCancel }: Props) => {
    const { register, handleSubmit, reset, watch, setValue, getValues, formState: { errors } } = useForm<ProductFormData>();

    const [hasDiscount, setHasDiscount] = useState(false);

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [detailFiles, setDetailFiles] = useState<File[]>([]);
    const [detailPreviews, setDetailPreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [avatarError, setAvatarError] = useState('');
    const [materials, setMaterials] = useState<string[]>([]);

    const watchedName = watch('name', '');
    const watchedPrice = watch('price', 0);
    const watchedOriginalPrice = watch('originalPrice', 0);
    const watchedDiscount = watch('discountPercentage', 0);
    const watchedStock = watch('stock', 0);
    const watchedDescription = watch('description', '');
    const watchedDimensions = watch('dimensions');
    const watchedWeight = watch('weight');
    const watchedCareInstructions = watch('careInstructions', '');

    useEffect(() => {
        if (editingProduct) {
            reset({
                name: editingProduct.name,
                price: editingProduct.price,
                originalPrice: editingProduct.originalPrice || editingProduct.price,
                discountPercentage: editingProduct.discountPercentage || 0,
                stock: editingProduct.stock ?? 0,
                categoryId: editingProduct.categoryId || '',
                description: editingProduct.description || '',
                dimensions: editingProduct.dimensions?.length === 3 ? {
                    length: editingProduct.dimensions[0],
                    width: editingProduct.dimensions[1],
                    height: editingProduct.dimensions[2]
                } : undefined,
                weight: editingProduct.weight,
                careInstructions: editingProduct.careInstructions || '',
            });
            setHasDiscount((editingProduct.originalPrice || 0) > editingProduct.price);
            setAvatarPreview(editingProduct.imageUrl || '');
            setExistingImages(editingProduct.images || []);
            setMaterials(editingProduct.materials || []);
        } else {
            reset({ name: '', price: 0, originalPrice: 0, discountPercentage: 0, stock: 0, categoryId: '', description: '', careInstructions: '' });
            setHasDiscount(false);
            setAvatarPreview('');
            setExistingImages([]);
            setMaterials([]);
        }
        setAvatarFile(null);
        setDetailFiles([]);
        setDetailPreviews([]);
        setAvatarError('');
    }, [editingProduct, reset]);

    useEffect(() => {
        return () => {
            detailPreviews.forEach(u => { if (u.startsWith('blob:')) URL.revokeObjectURL(u); });
            if (avatarPreview.startsWith('blob:')) URL.revokeObjectURL(avatarPreview);
        };
    }, []);

    const onSubmit = (data: ProductFormData) => {
        if (!editingProduct && !avatarFile) {
            setAvatarError('Vui lòng chọn ảnh đại diện sản phẩm');
            return;
        }
        onSave({
            name: data.name, price: Number(data.price), 
            originalPrice: hasDiscount ? Number(data.originalPrice) : Number(data.price),
            discountPercentage: hasDiscount ? Number(data.discountPercentage) : 0, 
            stock: Number(data.stock),
            categoryId: data.categoryId,
            description: data.description, materials,
            dimensions: (data.dimensions?.length !== undefined && data.dimensions?.length !== 0 && 
                         data.dimensions?.width !== undefined && data.dimensions?.width !== 0 && 
                         data.dimensions?.height !== undefined && data.dimensions?.height !== 0)
                ? { length: Number(data.dimensions.length), width: Number(data.dimensions.width), height: Number(data.dimensions.height) }
                : undefined,
            weight: data.weight ? Number(data.weight) : undefined,
            careInstructions: data.careInstructions,
            avatarFile, detailImageFiles: detailFiles.length > 0 ? detailFiles : undefined,
            imageUrl: !avatarFile ? (editingProduct?.imageUrl || '') : undefined,
            images: existingImages,
        });
    };

    const previewPrice = Number(watchedPrice) || 0;
    const previewOriginal = hasDiscount ? (Number(watchedOriginalPrice) || 0) : previewPrice;
    const previewDiscount = hasDiscount ? (Number(watchedDiscount) || 0) : 0;
    const isSale = hasDiscount && previewOriginal > previewPrice;
    const showBadge = isSale && previewDiscount > 0;

    // Computed Stock Status for Preview
    const computedStockStatus = watchedStock > 10 ? 'in_stock' : (watchedStock > 0 ? 'low_stock' : 'out_of_stock');

    // Sync Giá Handlers
    const handleOriginalPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        if (hasDiscount) {
            const currentDiscount = Number(getValues('discountPercentage')) || 0;
            const newPrice = val * (100 - currentDiscount) / 100;
            setValue('price', newPrice, { shouldValidate: true });
        }
    };

    const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        if (hasDiscount) {
            const currentOriginal = Number(getValues('originalPrice')) || 0;
            const newPrice = currentOriginal * (100 - val) / 100;
            setValue('price', newPrice, { shouldValidate: true });
        }
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        if (hasDiscount) {
            const currentOriginal = Number(getValues('originalPrice')) || 0;
            if (currentOriginal > 0) {
                const newDiscount = ((currentOriginal - val) / currentOriginal) * 100;
                setValue('discountPercentage', Math.max(0, Math.round(newDiscount * 100) / 100), { shouldValidate: true });
            }
        } else {
            setValue('originalPrice', val);
        }
    };

    const handleToggleDiscount = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setHasDiscount(checked);
        if (!checked) {
            setValue('discountPercentage', 0);
            setValue('originalPrice', Number(getValues('price')));
        }
    };

    const inputClass = "w-full border border-border-medium rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary-container/50 focus:border-primary-container transition-colors bg-white";
    const labelClass = "block font-body text-sm font-semibold text-text-ink mb-1.5";
    const errorClass = "text-error text-xs mt-1 font-body";

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* CỘT TRÁI: FORM */}
                <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 border-b lg:border-b-0 lg:border-r border-border-subtle">
                    <h3 className="font-body text-sm font-semibold text-text-muted uppercase tracking-widest">Thông tin sản phẩm</h3>

                    <div>
                        <label className={labelClass}>Tên sản phẩm *</label>
                        <input {...register('name', { required: 'Vui lòng nhập tên' })} className={inputClass} />
                        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Danh mục sản phẩm *</label>
                        <select {...register('categoryId', { required: 'Vui lòng chọn danh mục' })} className={inputClass}>
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        {errors.categoryId && <p className={errorClass}>{errors.categoryId.message}</p>}
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                        <input type="checkbox" id="hasDiscount" checked={hasDiscount} onChange={handleToggleDiscount} className="w-4 h-4 text-primary-container bg-surface-container border-border-medium rounded focus:ring-primary-container" />
                        <label htmlFor="hasDiscount" className="font-body text-sm font-semibold text-text-ink cursor-pointer">Sản phẩm có giảm giá</label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Giá bán (VNĐ) *</label>
                            <input type="number" {...register('price', { required: 'Nhập giá', min: { value: 0, message: 'Giá >= 0' } })} onChange={(e) => { register('price').onChange(e); handlePriceChange(e); }} className={inputClass} />
                            {errors.price && <p className={errorClass}>{errors.price.message}</p>}
                        </div>
                        {hasDiscount ? (
                            <div>
                                <label className={labelClass}>Giá gốc (VNĐ) *</label>
                                <input type="number" {...register('originalPrice', {
                                    required: 'Nhập giá gốc', min: { value: 0, message: '>= 0' },
                                    validate: v => Number(v) >= Number(getValues('price')) || 'Giá gốc >= giá bán',
                                })} onChange={(e) => { register('originalPrice').onChange(e); handleOriginalPriceChange(e); }} className={inputClass} />
                                {errors.originalPrice && <p className={errorClass}>{errors.originalPrice.message}</p>}
                            </div>
                        ) : (
                            <div>
                                <label className={labelClass}>Số lượng tồn kho *</label>
                                <input type="number" {...register('stock', { required: 'Nhập số lượng', min: { value: 0, message: '>= 0' } })} className={inputClass} />
                                {errors.stock && <p className={errorClass}>{errors.stock.message}</p>}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {hasDiscount ? (
                            <>
                                <div>
                                    <label className={labelClass}>Giảm giá (%)</label>
                                    <input type="number" {...register('discountPercentage', { min: { value: 0, message: '0%' }, max: { value: 100, message: '100%' } })} onChange={(e) => { register('discountPercentage').onChange(e); handleDiscountChange(e); }} className={inputClass} />
                                    {errors.discountPercentage && <p className={errorClass}>{errors.discountPercentage.message}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Số lượng tồn kho *</label>
                                    <input type="number" {...register('stock', { required: 'Nhập số lượng', min: { value: 0, message: '>= 0' } })} className={inputClass} />
                                    {errors.stock && <p className={errorClass}>{errors.stock.message}</p>}
                                </div>
                            </>
                        ) : null}
                    </div>

                    <div>
                        <label className={labelClass}>Mô tả sản phẩm *</label>
                        <textarea {...register('description', { required: 'Vui lòng nhập mô tả sản phẩm' })} rows={3} className={`${inputClass} resize-y`} placeholder="Nhập mô tả..." />
                        {errors.description && <p className={errorClass}>{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className={labelClass}>Dài (cm)</label>
                            <input type="number" step="0.1" min="0" {...register('dimensions.length')} className={inputClass} placeholder="VD: 35.5" />
                        </div>
                        <div>
                            <label className={labelClass}>Rộng (cm)</label>
                            <input type="number" step="0.1" min="0" {...register('dimensions.width')} className={inputClass} placeholder="VD: 25.0" />
                        </div>
                        <div>
                            <label className={labelClass}>Cao (cm)</label>
                            <input type="number" step="0.1" min="0" {...register('dimensions.height')} className={inputClass} placeholder="VD: 18.0" />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Trọng lượng (kg)</label>
                        <input type="number" step="0.01" min="0" {...register('weight')} className={inputClass} placeholder="VD: 0.85" />
                    </div>

                    <div>
                        <label className={labelClass}>Hướng dẫn bảo quản</label>
                        <textarea {...register('careInstructions')} rows={2} className={`${inputClass} resize-y`} placeholder="Nhập hướng dẫn bảo quản (giặt tay, lau khô...)" />
                    </div>

                    <div>
                        <label className={labelClass}>Chất liệu / Vật liệu</label>
                        <MaterialTagInput materials={materials} onChange={setMaterials} />
                    </div>

                    <ProductImageUploader
                        avatarPreview={avatarPreview}
                        onAvatarChange={(file, preview) => { setAvatarFile(file); if (avatarPreview.startsWith('blob:')) URL.revokeObjectURL(avatarPreview); setAvatarPreview(preview); setAvatarError(''); }}
                        avatarError={avatarError}
                        avatarRequired={!editingProduct}
                        existingImages={existingImages}
                        onRemoveExisting={(i) => setExistingImages(prev => prev.filter((_, idx) => idx !== i))}
                        detailPreviews={detailPreviews}
                        onAddDetailFiles={(files, previews) => { setDetailFiles(p => [...p, ...files]); setDetailPreviews(p => [...p, ...previews]); }}
                        onRemoveNewDetail={(i) => { const u = detailPreviews[i]; if (u?.startsWith('blob:')) URL.revokeObjectURL(u); setDetailFiles(p => p.filter((_, idx) => idx !== i)); setDetailPreviews(p => p.filter((_, idx) => idx !== i)); }}
                    />
                </form>

                {/* CỘT PHẢI: PREVIEW */}
                <div className="p-6 bg-surface-container/30">
                    <h3 className="font-body text-sm font-semibold text-text-muted uppercase tracking-widest mb-4">Xem trước sản phẩm</h3>
                    <div className="bg-surface-card rounded-xl border border-border-subtle shadow-sm overflow-hidden max-w-[320px] mx-auto">
                        <div className="aspect-square bg-surface-container relative">
                            {avatarPreview ? <img src={avatarPreview} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-text-muted"><span className="material-symbols-outlined text-[48px]">image</span></div>}
                            {showBadge && <span className="absolute top-3 left-3 bg-error text-white text-xs font-bold px-2 py-1 rounded-md">-{previewDiscount}%</span>}
                        </div>
                        <div className="p-4 space-y-2">
                            <h4 className="font-headline text-base font-semibold text-text-ink line-clamp-2">{watchedName || 'Tên sản phẩm...'}</h4>
                            <div className="flex items-baseline gap-2 flex-wrap">
                                <span className="font-headline text-lg font-bold text-error">{formatVND(previewPrice)} đ</span>
                                {isSale && <span className="text-sm text-text-muted line-through">{formatVND(previewOriginal)} đ</span>}
                            </div>
                            <ProductStatusBadge status={computedStockStatus} />
                            <span className="text-sm font-semibold text-text-muted">Kho: {watchedStock}</span>
                            {watchedDescription && <div className="pt-2"><p className="text-xs text-text-muted mb-1">Mô tả:</p><p className="text-sm text-text-ink line-clamp-3">{watchedDescription}</p></div>}
                            
                            <div className="pt-2">
                                <ProductSpecsInfo 
                                    dimensions={watchedDimensions as any}
                                    weight={watchedWeight}
                                    careInstructions={watchedCareInstructions}
                                    materials={materials}
                                />
                            </div>
                            {(existingImages.length > 0 || detailPreviews.length > 0) && (
                                <div className="pt-2 border-t border-border-subtle">
                                    <p className="text-xs text-text-muted mb-1.5">Ảnh chi tiết</p>
                                    <div className="flex gap-1.5 flex-wrap">
                                        {existingImages.map((u, i) => <img key={`e-${i}`} src={u} alt="" className="w-10 h-10 object-cover rounded border border-border-subtle" />)}
                                        {detailPreviews.map((u, i) => <img key={`n-${i}`} src={u} alt="" className="w-10 h-10 object-cover rounded border border-border-subtle" />)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <div className="px-6 py-4 border-t border-border-subtle flex justify-end gap-3">
                <button type="button" onClick={onCancel} disabled={saving} className="px-5 py-2 font-body text-sm font-semibold text-text-muted hover:bg-surface-container rounded-lg transition-colors disabled:opacity-50">Hủy</button>
                <button type="submit" form="product-form" disabled={saving} className="btn-primary px-5 py-2 font-body text-sm font-semibold flex items-center gap-2 disabled:opacity-50">
                    {saving && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                    {saving ? 'Đang lưu...' : 'Lưu lại'}
                </button>
            </div>
        </div>
    );
};