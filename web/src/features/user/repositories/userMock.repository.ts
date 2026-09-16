import type { ApiResponse } from "../../../core/api/apiResponse";
import type { UpdateProfileRequest } from "../dto/updateProfile.type";
import type { WishlistResponse } from "../models/wishlist.model";
import type { UserProfileResponse } from "../dto/getProfile.type";
import type { UserRepository } from "./user.repository";
import type { Address } from "../../order/checkout/models/checkout.model";
import type { DistrictModel, ProvinceModel, WardModel } from "../models/address.model";
import axios from "axios";
import { ApiException } from "../../../core/exceptions/api.exception";

const mockWishlistItems = [
    {
        id: "1",
        name: "Bình gốm thủ công men ngọc",
        price: 850000,
        discountPrice: 720000,
        thumbnail: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80",
        isFavorite: true as const,
    },
    {
        id: "2",
        name: "Tranh thêu tay hoa sen",
        price: 1200000,
        discountPrice: 1050000,
        thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
        isFavorite: true as const,
    },
    {
        id: "3",
        name: "Đèn lồng giấy truyền thống",
        price: 350000,
        discountPrice: 280000,
        thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80",
        isFavorite: true as const,
    },
    {
        id: "4",
        name: "Giỏ mây đan tay cao cấp",
        price: 620000,
        discountPrice: 520000,
        thumbnail: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=400&q=80",
        isFavorite: true as const,
    },
    {
        id: "5",
        name: "Khăn lụa thêu hoa văn dân tộc",
        price: 480000,
        discountPrice: 420000,
        thumbnail: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&q=80",
        isFavorite: true as const,
    },
    {
        id: "6",
        name: "Vòng tay ngọc bích tự nhiên",
        price: 980000,
        discountPrice: 850000,
        thumbnail: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",
        isFavorite: true as const,
    },
    {
        id: "7",
        name: "Vòng tay ngọc bích tự nhiên",
        price: 980000,
        discountPrice: 850000,
        thumbnail: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",
        isFavorite: true as const,
    },
    {
        id: "8",
        name: "Vòng tay ngọc bích tự nhiên",
        price: 980000,
        discountPrice: 850000,
        thumbnail: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",
        isFavorite: true as const,
    },
    {
        id: "9",
        name: "Vòng tay ngọc bích tự nhiên",
        price: 980000,
        discountPrice: 850000,
        thumbnail: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",
        isFavorite: true as const,
    },
    {
        id: "10",
        name: "Vòng tay ngọc bích tự nhiên",
        price: 980000,
        discountPrice: 850000,
        thumbnail: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",
        isFavorite: true as const,
    },
    {
        id: "11",
        name: "Vòng tay ngọc bích tự nhiên",
        price: 980000,
        discountPrice: 850000,
        thumbnail: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",
        isFavorite: true as const,
    },
    {
        id: "12",
        name: "Vòng tay ngọc bích tự nhiên",
        price: 980000,
        discountPrice: 850000,
        thumbnail: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",
        isFavorite: true as const,
    },
    {
        id: "13",
        name: "Vòng tay ngọc bích tự nhiên",
        price: 980000,
        discountPrice: 850000,
        thumbnail: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",
        isFavorite: true as const,
    },
    {
        id: "14",
        name: "Vòng tay ngọc bích tự nhiên",
        price: 980000,
        discountPrice: 850000,
        thumbnail: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",
        isFavorite: true as const,
    },
    {
        id: "15",
        name: "Vòng tay ngọc bích tự nhiên",
        price: 980000,
        discountPrice: 850000,
        thumbnail: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",
        isFavorite: true as const,
    },
];

const mockAddressDB = new Map<number, Address>([
    [1, {
        id: 1,
        fullName: "manggia",
        phoneNumber: "0123456789",
        provinceCode: 1,
        provinceName: "TPHCM",
        districtCode: 1,
        districtName: "Quận 1",
        wardCode: 1,
        wardName: "Phường Bến Thành",
        street: "Số 227 Nguyễn Văn Cừ",
        latitude: 10.88206144628933,
        longitude: 106.76458444116837,
        fullAddress: "Số 227 Nguyễn Văn Cừ, Phường Bến Thành, Quận 1, TP.HCM",
        isDefault: true,
    }],
    [2, {
        id: 2,
        fullName: "honghac",
        phoneNumber: "654321",
        provinceCode: 1,
        provinceName: "TPHCM",
        districtCode: 2,
        districtName: "Quận 2",
        wardCode: 1,
        wardName: "Phường Nguyễn Huệ",
        street: "Số 335 Nguyễn Trãi",
        latitude: 10.8231,
        longitude: 106.6297,
        fullAddress: "Số 335 Nguyễn Trãi, Phường Nguyễn Huệ, Quận 2, TP.HCM",
        isDefault: false,
    }]
]);

export class UserMockRepository implements UserRepository {
    async getProfile(): Promise<ApiResponse<UserProfileResponse>> {
        return {
            success: true,
            message: "Lấy thông tin thành công",
            data: {
                id: "1",
                email: "manggia098@gmail.com",
                fullName: "manggia",
                phone: "0123456789",
                avatarUrl: "",
                gender: "male",
                dateOfBirth: "1990-01-01",
                createdAt: "2023-01-01T00:00:00.000Z",
            },
        };
    }

    async updateProfile(_data: UpdateProfileRequest): Promise<ApiResponse<null>> {
        return {
            success: true,
            message: "Cập nhật hồ sơ thành công",
            data: null,
        };
    }


    async getWishlist(page: number, pageSize: number): Promise<ApiResponse<WishlistResponse>> {
        const total = mockWishlistItems.length;
        const totalPages = Math.ceil(total / pageSize);
        const start = (page - 1) * pageSize;
        const items = mockWishlistItems.slice(start, start + pageSize);

        return {
            success: true,
            message: "Lấy danh sách yêu thích thành công",
            data: {
                items
            },
            pagination: { page: page, pageSize: pageSize, totalItems: total, totalPages: totalPages },
        };
    }

    async getAddress(): Promise<ApiResponse<Address[]>> {
        return {
            success: true,
            message: "Lấy địa chỉ thành công",
            data: Array.from(mockAddressDB.values()),
        };
    }

    async addAddress(data: Omit<Address, "id">): Promise<ApiResponse<Address>> {
        const currentIds = Array.from(mockAddressDB.keys());
        const newId = currentIds.length > 0 ? Math.max(...currentIds) + 1 : 1;
        const newAddress: Address = { ...data, id: newId, isDefault: false };
        mockAddressDB.set(newId, newAddress);
        return {
            success: true,
            message: "Thêm địa chỉ mới thành công",
            data: newAddress,
        };
    }

    async updateAddress(id: number, data: Omit<Address, "id">): Promise<ApiResponse<Address>> {
        const existing = mockAddressDB.get(id);
        if (!existing) return { success: false, message: "Không tìm thấy địa chỉ", data: null as any };
        const updated: Address = { ...data, id, isDefault: existing.isDefault };
        mockAddressDB.set(id, updated);
        return { success: true, message: "Cập nhật địa chỉ thành công", data: updated };
    }

    async deleteAddress(id: number): Promise<ApiResponse<null>> {
        mockAddressDB.delete(id);
        return { success: true, message: "Xóa địa chỉ thành công", data: null };
    }

    async setDefaultAddress(id: number): Promise<ApiResponse<null>> {
        mockAddressDB.forEach((addr, key) => {
            addr.isDefault = key === id;
        });
        return { success: true, message: "Đặt địa chỉ mặc định thành công", data: null };
    }

    async getProvinces(): Promise<ProvinceModel[]> {
        const res = await axios.get("https://fe-online-gateway.ghn.vn/shiip/public-api/masterdata/province");
        const data = res.data?.data || res.data;
        return data.map((item: any) => ({
            id: item.province_id || item.id,
            name: item.province_name || item.name
        }));
    }

    async getDistricts(provinceId: number): Promise<DistrictModel[]> {
        const res = await axios.get("https://fe-online-gateway.ghn.vn/shiip/public-api/masterdata/district", {
            params: { province_id: provinceId }
        });
        const data = res.data?.data || res.data;
        return data.map((item: any) => ({
            id: item.district_id || item.id,
            name: item.district_name || item.name
        }));
    }

    async getWards(districtId: number): Promise<WardModel[]> {
        const res = await axios.get("https://fe-online-gateway.ghn.vn/shiip/public-api/masterdata/ward", {
            params: { district_id: districtId }
        });
        const data = res.data?.data || res.data;
        return data.map((item: any) => ({
            id: item.ward_code || item.id,
            name: item.ward_name || item.name
        }));
    }

    async getLocationFromAddress(address: string): Promise<{ latitude: number; longitude: number; }> {
        const res = await axios.get("https://nominatim.openstreetmap.org/search", {
            params: {
                q: address,
                format: "json",
                limit: 1,
            },
        })
        const data = res.data?.data || res.data;

        if (!data || data.length === 0) throw new ApiException("Không tìm thấy tọa độ", 404);

        return {
            latitude: Number(data[0].lat),
            longitude: Number(data[0].lon),
        }
    }

    async changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Promise<ApiResponse<null>> {
        if (currentPassword != '111')
            throw new ApiException('Mật khẩu cũ không chính xác', 400)
        if (newPassword !== confirmPassword)
            throw new ApiException('Mật khẩu mới và mật khẩu xác nhận không khớp', 400)
        return {
            success: true,
            message: 'Đổi mật khẩu thành công',
            data: null
        }
    }
}
