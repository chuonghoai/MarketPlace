import { useState, useCallback, useEffect } from 'react';
import { userService } from '../../../features/user/services/user.service';
import type { Address } from '../../../features/order/checkout/models/checkout.model';
import type { ProvinceModel, DistrictModel, WardModel } from '../../../features/user/models/address.model';
import { useToast } from '../../../components/toast/toast';

export const useEditAddressController = (
    isOpen: boolean,
    address: Address,
    onSuccess?: (updatedAddress: Address) => void
) => {
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        fullName: '', phoneNumber: '',
        provinceCode: 0, provinceName: '',
        districtCode: 0, districtName: '',
        wardCode: 0, wardName: '',
        street: ''
    });

    const [location, setLocation] = useState<[number, number] | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [provinces, setProvinces] = useState<ProvinceModel[]>([]);
    const [districts, setDistricts] = useState<DistrictModel[]>([]);
    const [wards, setWards] = useState<WardModel[]>([]);

    // Pre-fill form data from existing address
    useEffect(() => {
        if (isOpen && address) {
            setFormData({
                fullName: address.fullName,
                phoneNumber: address.phoneNumber,
                provinceCode: address.provinceCode,
                provinceName: address.provinceName,
                districtCode: address.districtCode,
                districtName: address.districtName,
                wardCode: address.wardCode,
                wardName: address.wardName,
                street: address.street,
            });
            setLocation([address.latitude, address.longitude]);
            setIsVerified(true);

            // Load dropdown data
            userService.getProvinces()
                .then(data => setProvinces(data))
                .catch(err => console.error("Lỗi khi tải tỉnh thành:", err));
            if (address.provinceCode) {
                userService.getDistricts(address.provinceCode)
                    .then(data => setDistricts(data));
            }
            if (address.districtCode) {
                userService.getWards(address.districtCode)
                    .then(data => setWards(data));
            }
        } else {
            setProvinces([]); setDistricts([]); setWards([]);
        }
    }, [isOpen, address]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (['street'].includes(field)) setIsVerified(false);
    };

    const handleSelectAddressField = (fieldCode: string, fieldName: string, id: number, name: string) => {
        setFormData(prev => ({ ...prev, [fieldCode]: id, [fieldName]: name }));
        setIsVerified(false);

        if (fieldCode === 'provinceCode') {
            setFormData(prev => ({ ...prev, districtCode: 0, districtName: '', wardCode: 0, wardName: '' }));
            setDistricts([]); setWards([]);
            userService.getDistricts(id).then(data => setDistricts(data));
        }
        else if (fieldCode === 'districtCode') {
            setFormData(prev => ({ ...prev, wardCode: 0, wardName: '' }));
            setWards([]);
            userService.getWards(id).then(data => setWards(data));
        }
    };

    const handleVerifyMap = () => {
        const { fullName, phoneNumber, provinceName, districtName, wardName, street } = formData;
        if (!fullName || !phoneNumber || !provinceName || !districtName || !wardName || !street) {
            toast("Vui lòng điền đầy đủ thông tin địa chỉ trước khi xác minh!", 'warning');
            return;
        }

        const fullAddress = `${street}, ${wardName}, ${districtName}, ${provinceName}`;

        setIsVerifying(true);
        userService.getLocationFromAddress(fullAddress)
            .then(data => {
                setLocation([data.latitude, data.longitude]);
                setIsVerified(true);
            })
            .catch(() => {
                toast("Không thể tự động tìm vị trí. Vui lòng kéo thả ghim trên bản đồ.", 'warning');
                setLocation([10.8231, 106.6297]);
                setIsVerified(true);
            })
            .finally(() => setIsVerifying(false));
    };

    const handleMarkerDragEnd = useCallback((e: any) => {
        setLocation([e.target.getLatLng().lat, e.target.getLatLng().lng]);
    }, []);

    const handleSaveAddress = async () => {
        if (!isVerified || !location) return;

        setIsSaving(true);
        try {
            const payload = {
                ...formData,
                fullAddress: `${formData.street}, ${formData.wardName}, ${formData.districtName}, ${formData.provinceName}`,
                latitude: location[0],
                longitude: location[1],
            };

            const res = await userService.updateAddress(address.id, payload);
            if (res.success && res.data) {
                if (onSuccess) onSuccess(res.data);
            } else {
                toast(res.message || "Có lỗi xảy ra khi cập nhật địa chỉ", 'error');
            }
        } catch (error) {
            console.error("Lỗi:", error);
            toast("Có lỗi xảy ra khi cập nhật địa chỉ", 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return {
        formData, location,
        isVerifying, isVerified, isSaving,
        provinces, districts, wards,
        handleInputChange, handleSelectAddressField,
        handleVerifyMap, handleMarkerDragEnd, handleSaveAddress
    };
};
