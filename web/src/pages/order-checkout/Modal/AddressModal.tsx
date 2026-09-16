import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { PrepareCheckoutModel } from '../../../features/order/checkout/models/checkout.model';
import { userService } from '../../../features/user/services/user.service';
import { DefaultIcon } from '../components/ShippingForm/shippingForm.type';

L.Marker.prototype.options.icon = DefaultIcon;

type Address = PrepareCheckoutModel['address'];

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedAddressId?: number;
    onSelectAddress: (address: Address) => void;
    onOpenAddNewAddress?: () => void;
}

export const AddressModal: React.FC<AddressModalProps> = ({
    isOpen,
    onClose,
    selectedAddressId,
    onSelectAddress,
    onOpenAddNewAddress
}) => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchAddresses = async () => {
                setLoading(true);
                try {
                    const res = await userService.getAddress();
                    if (res.success && res.data) setAddresses(res.data);
                } catch (error) {
                    console.error("Lỗi khi lấy danh sách địa chỉ:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchAddresses();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-text-ink/50 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-surface-card w-[90%] max-w-2xl rounded-lg shadow-xl card-border flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-subtle shrink-0">
                    <h3 className="font-subhead text-lg text-text-ink">Chọn địa chỉ giao hàng</h3>
                    <button className="text-text-muted hover:text-text-ink transition-colors" onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body - Address List */}
                <div className="p-4 overflow-y-auto grow space-y-4">
                    {loading ? (
                        <div className="flex justify-center items-center py-10">
                            <span className="font-body text-text-muted animate-pulse">Đang tải danh sách địa chỉ...</span>
                        </div>
                    ) : addresses.length === 0 ? (
                        <div className="text-center text-text-muted py-6">
                            Chưa có địa chỉ nào được lưu.
                        </div>
                    ) : (
                        addresses.filter(addr => addr !== null).map((addr) => {
                            const isSelected = selectedAddressId === addr.id;

                            return (
                                <div
                                    key={addr.id}
                                    onClick={() => onSelectAddress(addr)}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors flex flex-col sm:flex-row gap-4 relative group ${isSelected
                                        ? 'border-primary-container bg-surface-container-low'
                                        : 'border-border-medium hover:border-primary-container/50'
                                        }`}
                                >
                                    <div className="flex-1 space-y-1.5">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-body font-bold text-text-ink">{addr.fullName}</span>
                                            <span className="text-text-muted text-sm">|</span>
                                            <span className="font-body-sm text-text-muted">{addr.phoneNumber}</span>
                                            {isSelected && (
                                                <span className="bg-tertiary-container text-on-tertiary-container font-caption text-[10px] px-1.5 py-0.5 rounded ml-2 whitespace-nowrap">
                                                    Đang chọn
                                                </span>
                                            )}
                                        </div>
                                        <p className="font-body-sm text-text-ink">{addr.street}</p>
                                        <p className="font-caption text-text-muted leading-relaxed">
                                            {addr.fullAddress}
                                        </p>
                                    </div>

                                    <div className="w-full sm:w-36 h-28 shrink-0 rounded border border-border-medium overflow-hidden z-0">
                                        <MapContainer
                                            center={[addr.latitude, addr.longitude]}
                                            zoom={14}
                                            scrollWheelZoom={false}
                                            dragging={false}
                                            zoomControl={false}
                                            doubleClickZoom={false}
                                            style={{ height: '100%', width: '100%' }}
                                        >
                                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                            <Marker position={[addr.latitude, addr.longitude]} />
                                        </MapContainer>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="p-4 border-t border-subtle bg-surface-container shrink-0 flex flex-col sm:flex-row gap-3">
                    <button
                        className="w-full sm:w-1/2 btn-secondary py-2.5 font-body flex items-center justify-center gap-2"
                        onClick={() => {
                            if (onOpenAddNewAddress) {
                                onOpenAddNewAddress();
                            }
                        }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_location</span>
                        Thêm địa chỉ mới
                    </button>
                    <button
                        className="w-full sm:w-1/2 btn-primary py-2.5 font-body font-semibold"
                        onClick={onClose}
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};