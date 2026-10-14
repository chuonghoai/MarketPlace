import React, { useEffect } from 'react';

interface MediaLightboxModalProps {
    isOpen: boolean;
    onClose: () => void;
    mediaUrl: string;
    mediaType: 'image' | 'video';
    title?: string;
}

export const MediaLightboxModal: React.FC<MediaLightboxModalProps> = ({
    isOpen,
    onClose,
    mediaUrl,
    mediaType,
    title,
}) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !mediaUrl) return null;

    const isYoutube =
        mediaType === 'video' &&
        (mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be'));

    const getYoutubeEmbedUrl = (url: string) => {
        try {
            if (url.includes('youtu.be/')) {
                const id = url.split('youtu.be/')[1].split(/[?#]/)[0];
                return `https://www.youtube.com/embed/${id}`;
            }
            const urlObj = new URL(url);
            const id = urlObj.searchParams.get('v');
            if (id) return `https://www.youtube.com/embed/${id}`;
        } catch {
            // fallback
        }
        return url;
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="relative max-w-4xl w-full max-h-[90vh] bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-5 py-3.5 border-b border-stone-800 flex items-center justify-between bg-stone-900/90 text-stone-200">
                    <div className="flex items-center gap-2 truncate">
                        <span className="material-symbols-outlined text-amber-500 text-lg">
                            {mediaType === 'image' ? 'image' : 'videocam'}
                        </span>
                        <span className="text-sm font-semibold truncate">
                            {title || (mediaType === 'image' ? 'Xem ảnh minh chứng' : 'Xem video minh chứng')}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href={mediaUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                            title="Mở trong tab mới"
                        >
                            <span className="material-symbols-outlined text-lg">open_in_new</span>
                        </a>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                            title="Đóng (ESC)"
                        >
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    </div>
                </div>

                {/* Media Content */}
                <div className="p-4 flex-1 flex items-center justify-center overflow-auto bg-stone-950">
                    {mediaType === 'image' ? (
                        <img
                            src={mediaUrl}
                            alt={title || 'Minh chứng'}
                            className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-md"
                        />
                    ) : isYoutube ? (
                        <iframe
                            src={getYoutubeEmbedUrl(mediaUrl)}
                            title="Video minh chứng"
                            className="w-full aspect-video rounded-lg"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <video
                            src={mediaUrl}
                            controls
                            autoPlay
                            className="max-w-full max-h-[75vh] rounded-lg shadow-md"
                        >
                            Trình duyệt của bạn không hỗ trợ thẻ video.
                        </video>
                    )}
                </div>
            </div>
        </div>
    );
};
