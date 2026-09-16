import type { ApiResponse } from "../../../core/api/apiResponse";
import type { UpdateProfileRequest } from "../dto/updateProfile.type";
import type { WishlistResponse } from "../models/wishlist.model";
import type { UserProfileResponse } from "../dto/getProfile.type";
import type { UserRepository } from "../repositories/user.repository";
import { UserApiRepository } from "../repositories/userApi.repository";
import type { Address } from "../../order/checkout/models/checkout.model";
import { UserMockRepository } from "../repositories/userMock.repository";
import type { DistrictModel, ProvinceModel, WardModel } from "../models/address.model";
import { USE_MOCK } from "../../../core/config/useMock.config";

export class UserService {
    private readonly userRepository: UserRepository;

    constructor(userRepository?: UserRepository) {
        this.userRepository = userRepository || new UserApiRepository();
    }

    async getProfile(): Promise<ApiResponse<UserProfileResponse>> {
        return this.userRepository.getProfile();
    }

    async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<null>> {
        return this.userRepository.updateProfile(data);
    }

    async getWishlist(page: number, pageSize: number): Promise<ApiResponse<WishlistResponse>> {
        return this.userRepository.getWishlist(page, pageSize);
    }

    async getAddress(): Promise<ApiResponse<Address[]>> {
        return this.userRepository.getAddress();
    }

    async addAddress(data: Omit<Address, "id">): Promise<ApiResponse<Address>> {
        return this.userRepository.addAddress(data);
    }

    async updateAddress(id: number, data: Omit<Address, "id">): Promise<ApiResponse<Address>> {
        return this.userRepository.updateAddress(id, data);
    }

    async deleteAddress(id: number): Promise<ApiResponse<null>> {
        return this.userRepository.deleteAddress(id);
    }

    async setDefaultAddress(id: number): Promise<ApiResponse<null>> {
        return this.userRepository.setDefaultAddress(id);
    }

    async getProvinces(): Promise<ProvinceModel[]> {
        return this.userRepository.getProvinces();
    }

    async getDistricts(provinceId: number): Promise<DistrictModel[]> {
        return this.userRepository.getDistricts(provinceId);
    }

    async getWards(districtId: number): Promise<WardModel[]> {
        return this.userRepository.getWards(districtId);
    }

    async getLocationFromAddress(address: string): Promise<{ latitude: number; longitude: number; }> {
        return this.userRepository.getLocationFromAddress(address);
    }

    async changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Promise<ApiResponse<null>> {
        return this.userRepository.changePassword(currentPassword, newPassword, confirmPassword);
    }
}

export const userService = new UserService(USE_MOCK ? new UserMockRepository() : undefined);