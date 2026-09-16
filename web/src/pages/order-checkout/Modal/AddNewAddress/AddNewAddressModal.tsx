import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAddNewAddressController } from './AddNewAddress.controller';
import { DraggableMarker } from './DraggableMarker';
import { SearchableSelect } from './SearchableSelect';
import { DefaultIcon } from '../../components/ShippingForm/shippingForm.type';

L.Marker.prototype.options.icon = DefaultIcon;

interface AddNewAddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBack: () => void;
    onSuccess?: (newAddress: any) => void;
}

export const AddNewAddressModal: React.FC<AddNewAddressModalProps> = ({ isOpen, onClose, onBack, onSuccess }) => {

    const handleSuccessCb = (newAddress: any) => {
        if (onSuccess) onSuccess(newAddress);
        onClose();
    }

    const {
        formData, location, isVerifying, isVerified, isSaving,
        provinces, districts, wards,
        handleInputChange, handleSelectAddressField,
        handleVerifyMap, handleMarkerDragEnd, handleSaveAddress
    } = useAddNewAddressController(isOpen, handleSuccessCb);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-text-ink/50 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-surface-card w-[90%] max-w-2xl rounded-lg shadow-xl card-border flex flex-col max-h-[95vh]">
                <div className="flex justify-between items-center p-4 border-b border-subtle shrink-0">
                    <div className="flex items-center gap-2">
                        <button className="text-text-muted hover:text-text-ink transition-colors" onClick={onBack}>
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <h3 className="font-subhead text-lg text-text-ink">Thêm địa chỉ mới</h3>
                    </div>
                    <button className="text-text-muted hover:text-text-ink transition-colors" onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto grow space-y-6 relative z-20">
                    {/* Input address detail */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-body-sm text-text-muted mb-1">Họ và tên</label>
                            <input type="text" className="input-field w-full px-3 py-2 bg-surface" placeholder="Nguyễn Văn A" value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} />
                        </div>
                        <div>
                            <label className="block font-body-sm text-text-muted mb-1">Số điện thoại</label>
                            <input type="text" className="input-field w-full px-3 py-2 bg-surface" placeholder="0912345678" value={formData.phoneNumber} onChange={(e) => handleInputChange('phoneNumber', e.target.value)} />
                        </div>

                        <div className="sm:col-span-2 pt-2 border-t border-dashed border-border-medium">
                            <label className="block font-subhead text-text-ink mb-3">Địa chỉ chi tiết</label>
                        </div>

                        <div>
                            <label className="block font-body-sm text-text-muted mb-1">Tỉnh/Thành phố</label>
                            <SearchableSelect options={provinces} value={formData.provinceName} onSelect={(id, name) => handleSelectAddressField('provinceCode', 'provinceName', id, name)} placeholder="Chọn Tỉnh/Thành phố" />
                        </div>
                        <div>
                            <label className="block font-body-sm text-text-muted mb-1">Quận/Huyện</label>
                            <SearchableSelect options={districts} value={formData.districtName} onSelect={(id, name) => handleSelectAddressField('districtCode', 'districtName', id, name)} placeholder="Chọn Quận/Huyện" />
                        </div>
                        <div>
                            <label className="block font-body-sm text-text-muted mb-1">Phường/Xã</label>
                            <SearchableSelect options={wards} value={formData.wardName} onSelect={(id, name) => handleSelectAddressField('wardCode', 'wardName', id, name)} placeholder="Chọn Phường/Xã" />
                        </div>
                        <div>
                            <label className="block font-body-sm text-text-muted mb-1">Số nhà, tên đường</label>
                            <input type="text" className="input-field w-full px-3 py-2 bg-surface" placeholder="Số 227 Nguyễn Văn Cừ" value={formData.street} onChange={(e) => handleInputChange('street', e.target.value)} />
                        </div>
                    </div>

                    {/* Leaflat map */}
                    <div className="p-4 bg-surface-container-low border border-border-medium rounded-lg space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                {!isVerified ? (
                                    <>
                                        <span className="material-symbols-outlined text-market-warning">warning</span>
                                        <span className="font-body-sm text-[#D97706] font-medium">Chưa xác minh vị trí trên bản đồ</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-[#10B981]">check_circle</span>
                                        <div className="flex flex-col">
                                            <span className="font-body-sm text-[#059669] font-medium">Đã xác minh vị trí</span>
                                            {location && (
                                                <span className="font-caption text-text-muted">Lat: {location[0].toFixed(5)}, Lng: {location[1].toFixed(5)}</span>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>

                            <button
                                type="button"
                                className={`px-4 py-2 rounded-lg font-body-sm flex items-center justify-center gap-2 transition-colors border ${isVerified ? 'bg-surface text-primary border-primary-container hover:bg-primary-container/10' : 'bg-primary text-on-primary border-primary hover:bg-primary/90'}`}
                                onClick={handleVerifyMap}
                                disabled={isVerifying}
                            >
                                {isVerifying ? (
                                    <span className="font-body-sm animate-pulse">Đang định vị...</span>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{isVerified ? 'refresh' : 'location_on'}</span>
                                        {isVerified ? 'Xác minh lại' : 'Xác minh trên bản đồ'}
                                    </>
                                )}
                            </button>
                        </div>

                        {isVerified && location && (
                            <div className="w-full h-64 sm:h-80 rounded-lg border border-border-medium overflow-hidden z-0 relative">
                                <MapContainer center={location} zoom={16} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <DraggableMarker position={location} onDragEnd={handleMarkerDragEnd} />
                                </MapContainer>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer - Actions */}
                <div className="p-4 border-t border-subtle bg-surface-container shrink-0 flex flex-col sm:flex-row gap-3 justify-end relative z-10">
                    <button className="w-full sm:w-auto btn-secondary px-6 py-2.5 font-body font-semibold" onClick={onClose} disabled={isSaving}>Hủy</button>
                    <button
                        className={`w-full sm:w-auto px-6 py-2.5 rounded-sm font-body font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${isVerified && !isSaving ? 'bg-primary text-on-primary hover:bg-primary/90 active:bg-primary/80' : 'bg-surface-container-high text-text-muted cursor-not-allowed'}`}
                        disabled={!isVerified || isSaving}
                        onClick={handleSaveAddress}
                    >
                        {isSaving ? "Đang lưu..." : "Lưu địa chỉ"}
                    </button>
                </div>
            </div>
        </div>
    );
};