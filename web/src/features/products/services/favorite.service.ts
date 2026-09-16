import type { ApiResponse } from "../../../core/api/apiResponse";
import type { ProductRepository } from "../repositories/product.repository";
import { ProductApiRepository } from "../repositories/productApi.repository";
import { USE_MOCK } from "../../../core/config/useMock.config";
import { ProductMockRepository } from "../repositories/productMock.repository";

export class FavoriteService {
    private readonly favoriteRepository: ProductRepository;

    constructor(favoriteRepository?: ProductRepository) {
        this.favoriteRepository = favoriteRepository || new ProductApiRepository();
    }

    async toggleFavorite(productId: string): Promise<ApiResponse<null>> {
        return this.favoriteRepository.toggleFavorite(productId);
    }
}

export const favoriteService = new FavoriteService(USE_MOCK ? new ProductMockRepository() : undefined);