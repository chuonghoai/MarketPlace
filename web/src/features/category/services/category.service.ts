import type { ApiResponse } from "../../../core/api/apiResponse";
import { USE_MOCK } from "../../../core/config/useMock.config";
import type { Category } from "../models/category.model";
import type { CategoryRepository } from "../repository/category.repository";
import { CategoryApiRepository } from "../repository/categoryApi.repository";
import { CategoryMockRepository } from "../repository/categoryMock.repository";

export class CategoryService {
    private readonly categoryRepository: CategoryRepository;

    constructor(categoryRepository?: CategoryRepository) {
        this.categoryRepository = categoryRepository || new CategoryApiRepository();
    }

    async getAllCategories(): Promise<ApiResponse<Category[]>> {
        return this.categoryRepository.getAllCategories();
    }
}

export const categoryService = new CategoryService(USE_MOCK ? new CategoryMockRepository() : undefined);