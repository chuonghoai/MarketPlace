import type { ApiResponse } from "../../../core/api/apiResponse";
import { USE_MOCK } from "../../../core/config/useMock.config";
import type { FilterState } from "../../../pages/marketplace/components/filter/filter.type";
import type { ProductItem } from "../models/product.model";
import type { ProductDetail } from "../models/productDetail.model";
import type { ProductRepository } from "../repositories/product.repository";
import { ProductApiRepository } from "../repositories/productApi.repository";
import { ProductMockRepository } from "../repositories/productMock.repository";

export class ProductService {
    private readonly productRepository: ProductRepository;

    constructor(productRepository?: ProductRepository) {
        this.productRepository = productRepository || new ProductApiRepository();
    }

    async getAllProducts(
        page: number = 1,
        pageSize: number = 50,
        filters?: FilterState,
        search?: string
    ): Promise<ApiResponse<ProductItem[]>> {
        return this.productRepository.getAllProducts(page, pageSize, filters, search);
    }

    async getProductById(id: string): Promise<ApiResponse<ProductDetail>> {
        return this.productRepository.getProductById(id);
    }
}

export const productService = new ProductService(USE_MOCK ? new ProductMockRepository() : undefined);