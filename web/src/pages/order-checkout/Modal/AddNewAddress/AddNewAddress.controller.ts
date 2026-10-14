import { useState, useCallback, useEffect } from 'react';
import { userService } from '../../../../features/user/services/user.service';
import type { ProvinceModel, DistrictModel, WardModel } from '../../../../features/user/models/address.model';
import { useToast } from '../../../../components/toast/toast';

export const useAddNewAddressController = (isOpen: boolean, onSuccess?: (newAddress: any) => void) => {
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
    const [phoneError, setPhoneError] = useState('');

    const [provinces, setProvinces] = useState<ProvinceModel[]>([]);
    const [districts, setDistricts] = useState<DistrictModel[]>([]);
    const [wards, setWards] = useState<WardModel[]>([]);

    useEffect(() => {
        if (isOpen) {
            setFormData({
                fullName: '', phoneNumber: '', provinceCode: 0, provinceName: '',
                districtCode: 0, districtName: '', wardCode: 0, wardName: '', street: ''
            });
            setLocation(null);
            setIsVerified(false);
            setIsVerifying(false);
            setPhoneError('');

            userService.getProvinces()
                .then(data => setProvinces(data))
                .catch(err => console.error("Lỗi khi tải tỉnh thành:", err));
        } else {
            setProvinces([]); setDistricts([]); setWards([]);
        }
    }, [isOpen]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (field === 'phoneNumber') {
            const trimmed = value.trim();
            if (trimmed && !/^(0[3|5|7|8|9])+([0-9]{8})$/.test(trimmed)) {
                setPhoneError('Số điện thoại không hợp lệ (yêu cầu 10 chữ số, bắt đầu bằng 0)');
            } else {
                setPhoneError('');
            }
        }
        if (['street', 'phoneNumber'].includes(field)) setIsVerified(false);
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

        if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(phoneNumber.trim())) {
            setPhoneError('Số điện thoại không hợp lệ (yêu cầu 10 chữ số, bắt đầu bằng 0)');
            toast("Số điện thoại không hợp lệ", 'warning');
            return;
        }

        const fullAddress = `${street}, ${wardName}, ${districtName}, ${provinceName}`;

        setIsVerifying(true);
        userService.getLocationFromAddress(fullAddress)
            .then(data => {
                setLocation([data.latitude, data.longitude]);
                setIsVerified(true);
            })
            .catch(_err => {
                toast("Không thể tự động tìm vị trí. Vui lòng kéo thả ghim trên bản đồ để chọn tọa độ chính xác.", 'warning');

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

        if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(formData.phoneNumber.trim())) {
            setPhoneError('Số điện thoại không hợp lệ (yêu cầu 10 chữ số, bắt đầu bằng 0)');
            toast("Số điện thoại không hợp lệ", 'warning');
            return;
        }

        setIsSaving(true);
        try {
            const payload = {
                ...formData,
                fullAddress: `${formData.street}, ${formData.wardName}, ${formData.districtName}, ${formData.provinceName}`,
                latitude: location[0],
                longitude: location[1]
            };

            const res = await userService.addAddress(payload);
            if (res.success && res.data) {
                if (onSuccess) onSuccess(res.data);
            } else {
                toast(res.message || "Có lỗi xảy ra khi lưu địa chỉ", 'error');
            }
        } catch (error) {
            console.error("Lỗi:", error);
            toast("Có lỗi xảy ra khi lưu địa chỉ", 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return {
        formData, location,
        isVerifying, isVerified, isSaving,
        phoneError,
        provinces, districts, wards,
        handleInputChange, handleSelectAddressField,
        handleVerifyMap, handleMarkerDragEnd, handleSaveAddress
    };
};