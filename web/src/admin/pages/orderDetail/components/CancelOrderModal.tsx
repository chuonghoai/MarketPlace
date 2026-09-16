import React, { useState } from 'react';

interface CancelOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    isLoading: boolean;
}

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    isLoading
}) => {
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (reason.trim()) {
            onConfirm(reason);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-md shadow-lg w-full max-w-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Hủy Đơn Hàng</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lý do hủy <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        className="w-full border border-gray-300 rounded-sm p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        placeholder="Nhập lý do hủy đơn hàng..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-sm transition-colors"
                    >
                        Đóng
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading || !reason.trim()}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 rounded-sm transition-colors flex items-center gap-2"
                    >
                        {isLoading && (
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        Xác nhận hủy
                    </button>
                </div>
            </div>
        </div>
    );
};
