import { apiClient } from "../../../core/api/apiClient";
import type { ApiResponse } from "../../../core/api/apiResponse";
import type { Category } from "../models/category.model";
import type { CategoryRepository } from "./category.repository";

export class CategoryApiRepository implements CategoryRepository {
    /**
     * GET /categories
     * @returns Category[]
     */
    async getAllCategories(): Promise<ApiResponse<Category[]>> {
        return apiClient.get<ApiResponse<Category[]>>("categories");
    }
}