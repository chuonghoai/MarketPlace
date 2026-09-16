import type { ApiResponse } from "../../../../core/api/apiResponse";
import type { Product, GetProductsQuery, CreateProductRequest, UpdateProductRequest } from "../models/product.model";
import type { IProductRepository } from "./product.repository";

const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Áo thun nam basic',
        imageUrl: 'https://via.placeholder.com/300',
        price: 199000,
        originalPrice: 250000,
        discountPercentage: 20,
        rating: 4.5,
        images: ['https://via.placeholder.com/300', 'https://via.placeholder.com/300'],
        description: 'Áo thun cotton 100% thoáng mát',
        materials: ['Cotton', 'Polyester'],
        categoryName: 'Thời trang nam',
        categoryId: 'cat1',
        stock: 50,
        soldCount: 120,
        dimensions: [40, 30, 2],
        weight: 0.3,
        careInstructions: 'Giặt máy ở chế độ nhẹ. Tránh ánh nắng trực tiếp.',
    },
    {
        id: '2',
        name: 'Quần jeans slim fit',
        imageUrl: 'https://via.placeholder.com/300',
        price: 450000,
        originalPrice: 450000,
        discountPercentage: 0,
        rating: 4.2,
        images: [],
        description: 'Quần jeans co giãn thoải mái',
        materials: ['Denim', 'Spandex'],
        categoryName: 'Thời trang nam',
        categoryId: 'cat1',
        stock: 5,
        soldCount: 45,
        dimensions: [50, 40, 3],
        weight: 0.5,
        careInstructions: 'Lộn trái khi giặt. Không dùng thuốc tẩy.',
    },
    {
        id: '3',
        name: 'Giày sneaker trắng',
        imageUrl: 'https://via.placeholder.com/300',
        price: 890000,
        originalPrice: 1200000,
        discountPercentage: 25,
        rating: 4.8,
        images: ['https://via.placeholder.com/300'],
        description: 'Giày sneaker phong cách',
        materials: ['Da tổng hợp', 'Cao su'],
        categoryName: 'Giày dép',
        categoryId: 'cat2',
        stock: 100,
        soldCount: 300,
        dimensions: [30, 20, 15],
        weight: 0.8,
        careInstructions: 'Lau sạch bằng khăn mềm. Bảo quản nơi khô ráo.',
    },
];

export class ProductMockRepository implements IProductRepository {
    async getProducts(query: GetProductsQuery): Promise<ApiResponse<Product[]>> {
        const page = (query as any).page || 1;
        const pageSize = (query as any).pageSize || 10;
        return {
            success: true,
            message: 'Lấy danh sách sản phẩm thành công',
            data: MOCK_PRODUCTS,
            pagination: {
                page,
                pageSize,
                totalItems: MOCK_PRODUCTS.length,
                totalPages: 1,
            },
        };
    }

    async getProductById(id: string): Promise<ApiResponse<Product>> {
        const product = MOCK_PRODUCTS.find(p => p.id === id);
        if (!product) {
            return { success: false, message: 'Không tìm thấy sản phẩm', data: null as any };
        }
        return { success: true, message: 'OK', data: product };
    }

    async deleteProduct(_id: string): Promise<ApiResponse<null>> {
        return { success: true, message: 'Xóa sản phẩm thành công', data: null };
    }

    async createProduct(data: CreateProductRequest): Promise<ApiResponse<Product>> {
        const newProduct: Product = {
            id: Date.now().toString(),
            name: data.name,
            price: data.price,
            originalPrice: data.originalPrice,
            discountPercentage: data.discountPercentage,
            imageUrl: 'https://via.placeholder.com/300',
            images: [],
            description: data.description,
            materials: data.materials || [],
            rating: 0,
            stock: data.stock,
            soldCount: 0,
            categoryId: data.categoryId,
            dimensions: data.dimensions,
            weight: data.weight,
            careInstructions: data.careInstructions,
        };
        return { success: true, message: 'Tạo sản phẩm thành công', data: newProduct };
    }

    async updateProduct(_id: string, data: UpdateProductRequest): Promise<ApiResponse<Product>> {
        const updated: Product = {
            id: _id,
            name: data.name || '',
            price: data.price || 0,
            originalPrice: data.originalPrice || 0,
            discountPercentage: data.discountPercentage || 0,
            imageUrl: 'https://via.placeholder.com/300',
            images: [],
            description: data.description,
            materials: data.materials || [],
            rating: 4.0,
            stock: data.stock ?? 0,
            soldCount: 0,
            categoryId: data.categoryId,
            dimensions: data.dimensions,
            weight: data.weight,
            careInstructions: data.careInstructions,
        };
        return { success: true, message: 'Cập nhật sản phẩm thành công', data: updated };
    }
}