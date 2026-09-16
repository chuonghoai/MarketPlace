import { useRef } from 'react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface Props {
    // Avatar
    avatarPreview: string;
    onAvatarChange: (file: File, preview: string) => void;
    avatarError: string;
    avatarRequired: boolean;
    // Detail images
    existingImages: string[];
    onRemoveExisting: (index: number) => void;
    detailPreviews: string[];
    onAddDetailFiles: (files: File[], previews: string[]) => void;
    onRemoveNewDetail: (index: number) => void;
}

export const ProductImageUploader = ({
    avatarPreview, onAvatarChange, avatarError, avatarRequired,
    existingImages, onRemoveExisting,
    detailPreviews, onAddDetailFiles, onRemoveNewDetail,
}: Props) => {
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const detailInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) return;
        if (file.size > MAX_FILE_SIZE) {
            alert('Ảnh đại diện tối đa 5MB');
            return;
        }
        const preview = URL.createObjectURL(file);
        onAvatarChange(file, preview);
    };

    const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const validFiles: File[] = [];
        for (const file of files) {
            if (!file.type.startsWith('image/')) continue;
            if (file.size > MAX_FILE_SIZE) {
                alert(`Ảnh "${file.name}" vượt quá 5MB, đã bỏ qua.`);
                continue;
            }
            validFiles.push(file);
        }
        if (validFiles.length > 0) {
            const previews = validFiles.map(f => URL.createObjectURL(f));
            onAddDetailFiles(validFiles, previews);
        }
        if (detailInputRef.current) detailInputRef.current.value = '';
    };

    const labelClass = "block font-body text-sm font-semibold text-text-ink mb-1.5";
    const errorClass = "text-error text-xs mt-1 font-body";

    return (
        <>
            {/* Ảnh đại diện */}
            <div>
                <label className={labelClass}>
                    Ảnh đại diện sản phẩm {avatarRequired && '*'}
                </label>
                <div
                    onClick={() => avatarInputRef.current?.click()}
                    className="border-2 border-dashed border-border-medium rounded-lg p-4 text-center cursor-pointer hover:border-primary-container hover:bg-primary-container/5 transition-colors"
                >
                    {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" className="w-24 h-24 object-cover rounded-lg mx-auto border border-border-subtle" />
                    ) : (
                        <div className="text-text-muted">
                            <span className="material-symbols-outlined text-[32px] block mb-1">add_photo_alternate</span>
                            <p className="text-xs">Nhấn để chọn ảnh đại diện</p>
                        </div>
                    )}
                </div>
                <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                {avatarPreview && <p className="text-xs text-text-muted mt-1">Nhấn vào ảnh để đổi</p>}
                {avatarError && <p className={errorClass}>{avatarError}</p>}
            </div>

            {/* Ảnh chi tiết */}
            <div>
                <label className={labelClass}>Ảnh chi tiết sản phẩm</label>
                <div
                    onClick={() => detailInputRef.current?.click()}
                    className="border-2 border-dashed border-border-medium rounded-lg p-4 text-center cursor-pointer hover:border-primary-container hover:bg-primary-container/5 transition-colors"
                >
                    <span className="material-symbols-outlined text-[28px] text-text-muted block mb-1">photo_library</span>
                    <p className="text-xs text-text-muted">Nhấn để chọn nhiều ảnh chi tiết</p>
                </div>
                <input ref={detailInputRef} type="file" accept="image/*" multiple onChange={handleDetailChange} className="hidden" />

                {existingImages.length > 0 && (
                    <div className="mt-3">
                        <p className="text-xs text-text-muted mb-2">Ảnh hiện tại:</p>
                        <div className="flex flex-wrap gap-2">
                            {existingImages.map((url, i) => (
                                <div key={`existing-${i}`} className="relative group">
                                    <img src={url} alt="" className="w-16 h-16 object-cover rounded-md border border-border-subtle" />
                                    <button type="button" onClick={() => onRemoveExisting(i)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-error text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-[12px]">close</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {detailPreviews.length > 0 && (
                    <div className="mt-3">
                        <p className="text-xs text-text-muted mb-2">Ảnh mới thêm:</p>
                        <div className="flex flex-wrap gap-2">
                            {detailPreviews.map((url, i) => (
                                <div key={`new-${i}`} className="relative group">
                                    <img src={url} alt="" className="w-16 h-16 object-cover rounded-md border border-border-subtle" />
                                    <button type="button" onClick={() => onRemoveNewDetail(i)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-error text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-[12px]">close</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};