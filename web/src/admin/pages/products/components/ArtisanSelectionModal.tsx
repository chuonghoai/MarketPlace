import { useState, useEffect } from 'react';
import { artisanService, type Artisan } from '../../../features/artisans/services/artisan.service';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (artisan: Artisan | null) => void;
    currentArtisanId?: string | null;
}

export const ArtisanSelectionModal = ({ isOpen, onClose, onSelect, currentArtisanId }: Props) => {
    const [search, setSearch] = useState('');
    const [artisans, setArtisans] = useState<Artisan[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(currentArtisanId || null);

    useEffect(() => {
        if (isOpen) {
            setSelectedId(currentArtisanId || null);
            fetchArtisans('');
        }
    }, [isOpen, currentArtisanId]);

    const fetchArtisans = async (searchQuery: string) => {
        try {
            setLoading(true);
            const data = await artisanService.getAll(1, 20, searchQuery); // Phân trang limit 20
            setArtisans(data.data || []);
        } catch (error) {
            console.error('Error fetching artisans:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleConfirm = () => {
        const selected = artisans.find(a => a.id === selectedId) || null;
        onSelect(selected);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-surface-card w-full max-w-lg rounded-xl shadow-lg flex flex-col max-h-[85vh]">
                <div className="p-4 border-b border-border-subtle flex justify-between items-center">
                    <h3 className="font-headline text-xl font-semibold text-text-ink">Chọn nghệ danh</h3>
                    <button type="button" onClick={onClose} className="text-text-muted hover:text-text-ink transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div className="p-4 border-b border-border-subtle bg-surface-container/30">
                    <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3 text-text-muted text-[20px]">search</span>
                        <input 
                            type="text" 
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                fetchArtisans(e.target.value);
                            }}
                            placeholder="Tìm kiếm nghệ danh..." 
                            className="w-full pl-10 pr-4 py-2 border border-border-medium rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-container/50 bg-white"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {loading ? (
                        <div className="text-center text-text-muted py-8 text-sm">Đang tải...</div>
                    ) : artisans.length === 0 ? (
                        <div className="text-center text-text-muted py-8 text-sm">Không tìm thấy nghệ danh nào.</div>
                    ) : (
                        artisans.map(artisan => (
                            <label key={artisan.id} className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-colors ${selectedId === artisan.id ? 'border-primary-container bg-primary-container/5' : 'border-border-subtle hover:bg-surface-container/50'}`}>
                                <input 
                                    type="radio" 
                                    name="artisan" 
                                    value={artisan.id}
                                    checked={selectedId === artisan.id}
                                    onChange={() => setSelectedId(artisan.id)}
                                    className="w-4 h-4 text-primary-container bg-white border-border-medium focus:ring-primary-container cursor-pointer"
                                />
                                <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden flex-shrink-0">
                                    {artisan.avatar ? (
                                        <img src={artisan.avatar} alt={artisan.fullName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center font-bold text-text-muted">
                                            {artisan.fullName.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="font-body text-sm font-semibold text-text-ink">{artisan.fullName}</p>
                                </div>
                            </label>
                        ))
                    )}
                </div>

                <div className="p-4 border-t border-border-subtle flex justify-end gap-3 bg-surface-container/20">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-text-muted hover:bg-surface-container rounded-lg transition-colors">
                        Hủy
                    </button>
                    <button type="button" onClick={handleConfirm} className="btn-primary px-4 py-2 text-sm font-semibold rounded-lg">
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
};
