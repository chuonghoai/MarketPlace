import type { ApiResponse } from "../../../core/api/apiResponse";
import type { UpdateProfileRequest } from "../dto/updateProfile.type";
import type { WishlistResponse } from "../models/wishlist.model";
import type { UserProfileResponse } from "../dto/getProfile.type";
import type { Address } from "../../order/checkout/models/checkout.model";
import type { DistrictModel, ProvinceModel, WardModel } from "../models/address.model";

export interface UserRepository {
    getProfile(): Promise<ApiResponse<UserProfileResponse>>;
    updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<null>>;
    getWishlist(page: number, pageSize: number): Promise<ApiResponse<WishlistResponse>>;

    getAddress(): Promise<ApiResponse<Address[]>>;
    addAddress(data: Omit<Address, "id">): Promise<ApiResponse<Address>>;
    updateAddress(id: number, data: Omit<Address, "id">): Promise<ApiResponse<Address>>;
    deleteAddress(id: number): Promise<ApiResponse<null>>;
    setDefaultAddress(id: number): Promise<ApiResponse<null>>;

    getProvinces(): Promise<ProvinceModel[]>;
    getDistricts(provinceId: number): Promise<DistrictModel[]>;
    getWards(districtId: number): Promise<WardModel[]>;

    getLocationFromAddress(address: string): Promise<{ latitude: number, longitude: number }>;

    changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Promise<ApiResponse<null>>;
}
