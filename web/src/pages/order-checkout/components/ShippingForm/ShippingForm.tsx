import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DefaultIcon, type ShippingFormProps } from './shippingForm.type';
import { LocationSelector, useShippingController } from './shippingForm.controller';

L.Marker.prototype.options.icon = DefaultIcon;

export const ShippingForm: React.FC<ShippingFormProps> = ({ address, onOpenAddressModal, onOpenAddNewAddressModal }) => {
    const fallbackLat = 10.8231;
    const fallbackLng = 106.6297;
    const { position } = useShippingController(address?.latitude ?? fallbackLat, address?.longitude ?? fallbackLng);

    const disabledInputClass = "w-full px-4 py-2.5 bg-[#F5F5F4] text-[#78716C] border border-dashed border-[#D6D3D1] rounded-[6px] outline-none cursor-not-allowed text-[15px]";

    if (!address) {
        return (
            <section className="w-full">
                <div className="flex justify-between items-center border-b border-[#E7E5E4] pb-3 mb-5 md:mb-6">
                    <h2 className="font-['Lora',serif] text-[20px] md:text-[24px] font-semibold text-[#1C1917]">Thông tin giao hàng</h2>
                </div>
                <div className="bg-white border border-dashed border-[#D6D3D1] rounded-xl p-10 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-[#F5F5F4] rounded-full flex items-center justify-center mb-2">
                        <svg className="w-8 h-8 text-[#A8A29E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-['Lora',serif] text-[#1C1917] font-semibold text-[18px] md:text-[20px]">Bạn chưa có địa chỉ giao hàng</p>
                        <p className="text-[13px] md:text-[14px] text-[#57534E] mt-1.5">Vui lòng thêm địa chỉ để tiếp tục thanh toán đơn hàng</p>
                    </div>
                    <button
                        type="button"
                        onClick={onOpenAddNewAddressModal}
                        className="bg-market-primary text-white px-6 py-2.5 mt-4 rounded-[4px] font-semibold text-[15px] flex items-center gap-2 transition-colors hover:bg-[#9A3412] shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Thêm mới địa chỉ
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full">
            <div className="flex justify-between items-center border-b border-[#E7E5E4] pb-3 mb-5 md:mb-6">
                <h2 className="font-['Lora',serif] text-[20px] md:text-[24px] font-semibold text-[#1C1917]">Thông tin giao hàng</h2>

                <button
                    type="button"
                    onClick={onOpenAddressModal}
                    className="px-4 py-2 border-[1.5px] border-[#D6D3D1] bg-white rounded-[4px] font-semibold text-[13px] text-[#57534E] hover:border-[#1C1917] hover:text-[#1C1917] transition-colors flex items-center gap-1.5"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Chỉnh sửa
                </button>
            </div>

            <div className="bg-white border border-[#E7E5E4] shadow-sm rounded-xl p-6 md:p-8">
                <div className="flex flex-col xl:flex-row gap-8">

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-[13px] font-semibold text-[#1C1917] mb-1.5">Họ và tên</label>
                            <input type="text" className={disabledInputClass} readOnly disabled value={address.fullName} />
                        </div>
                        <div>
                            <label className="block text-[13px] font-semibold text-[#1C1917] mb-1.5">Số điện thoại</label>
                            <input type="text" className={disabledInputClass} readOnly disabled value={address.phoneNumber} />
                        </div>

                        <div>
                            <label className="block text-[13px] font-semibold text-[#1C1917] mb-1.5">Tỉnh/Thành phố</label>
                            <input type="text" className={disabledInputClass} readOnly disabled value={address.provinceName} />
                        </div>
                        <div>
                            <label className="block text-[13px] font-semibold text-[#1C1917] mb-1.5">Quận/Huyện</label>
                            <input type="text" className={disabledInputClass} readOnly disabled value={address.districtName} />
                        </div>
                        <div>
                            <label className="block text-[13px] font-semibold text-[#1C1917] mb-1.5">Phường/Xã</label>
                            <input type="text" className={disabledInputClass} readOnly disabled value={address.wardName} />
                        </div>
                        <div>
                            <label className="block text-[13px] font-semibold text-[#1C1917] mb-1.5">Số nhà, tên đường</label>
                            <input type="text" className={disabledInputClass} readOnly disabled value={address.street} />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-[13px] font-semibold text-[#1C1917] mb-1.5">Địa chỉ đầy đủ</label>
                            <input type="text" className={disabledInputClass} readOnly disabled value={address.fullAddress} />
                        </div>
                    </div>

                    <div className="w-full xl:w-[360px] shrink-0 flex flex-col gap-2">
                        <div className="h-[280px] xl:h-full min-h-[280px] rounded-lg border border-[#E7E5E4] overflow-hidden z-0 shadow-sm">
                            <MapContainer
                                center={position}
                                zoom={15}
                                scrollWheelZoom={true}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <LocationSelector position={position} />
                            </MapContainer>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};