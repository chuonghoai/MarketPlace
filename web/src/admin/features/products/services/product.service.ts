import type { ApiResponse } from '../../../../core/api/apiResponse';
import type { Product, GetProductsQuery, CreateProductRequest } from '../models/product.model';
import type { IProductRepository } from '../repositories/product.repository';
import { ProductApiRepository } from '../repositories/productApi.repository';
import { ProductMockRepository } from '../repositories/productMock.repository';
import { USE_MOCK } from '../../../../core/config/useMock.config';

export class ProductService {
    private readonly productRepository: IProductRepository;

    constructor(productRepository: IProductRepository) {
        this.productRepository = productRepository;
    }

    // === Fetch ===

    async fetchProducts(query: GetProductsQuery): Promise<ApiResponse<Product[]>> {
        try {
            const formatQuery: any = {
                page: query.page || 1,
                pageSize: query.pageSize || 10,
            };
            if (query.filters?.sortBy) {
                formatQuery['filters[sortBy]'] = query.filters.sortBy;
            }
            return await this.productRepository.getProducts(formatQuery);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            throw error;
        }
    }

    async fetchProductById(id: string): Promise<ApiResponse<Product>> {
        try {
            return await this.productRepository.getProductById(id);
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
            throw error;
        }
    }

    // === CRUD ===

    async removeProduct(id: string): Promise<boolean> {
        try {
            await this.productRepository.deleteProduct(id);
            return true;
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
            return false;
        }
    }

    async saveProduct(data: CreateProductRequest, id?: string): Promise<boolean> {
        try {
            if (id) {
                await this.productRepository.updateProduct(id, data);
            } else {
                await this.productRepository.createProduct(data);
            }
            return true;
        } catch (error) {
            console.error('Lỗi khi lưu sản phẩm:', error);
            return false;
        }
    }


}

// === Khởi tạo instance — chọn Mock hoặc Api dựa trên USE_MOCK ===
export const productService = new ProductService(
    USE_MOCK ? new ProductMockRepository() : new ProductApiRepository()
);