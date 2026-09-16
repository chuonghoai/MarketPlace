import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { ApiResponse } from "../../core/api/apiResponse";
import type { ProductItem } from "../../features/products/models/product.model";
import { EFilterState, type FilterState } from "./components/filter/filter.type";
import { productService } from "../../features/products/services/product.service";

export const useMarketplaceController = () => {
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<ApiResponse<any>["pagination"]>();
    const [searchParams, setSearchParams] = useSearchParams();

    const searchParamsString = searchParams.toString();

    const currentUrlState = useMemo(() => {
        return {
            page: Number(searchParams.get("page")) || 1,
            filters: {
                sortBy: (searchParams.get("sortBy") as EFilterState) || EFilterState.NEWEST,
                categories: searchParams.getAll("categories"),
                minPrice: searchParams.get("minPrice") || "",
                maxPrice: searchParams.get("maxPrice") || "",
            } as FilterState,
            search: searchParams.get("search") || "",
        };
    }, [searchParamsString]);

    useEffect(() => {
        fetchProducts();
    }, [searchParamsString]);

    const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await productService.getAllProducts(
                currentUrlState.page,
                50,
                currentUrlState.filters,
                currentUrlState.search
            );

            if (response.success) {
                setProducts(response.data);
                setPagination(response.pagination);
            } else {
                setError("Lỗi máy chủ");
            }
        } catch (err) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", err);
            setError("Lỗi máy chủ");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (pagination && newPage >= 1 && newPage <= pagination.totalPages) {
            searchParams.set("page", newPage.toString());
            setSearchParams(searchParams);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return {
        products,
        isLoading,
        error,
        pagination,
        handlePageChange,
        currentPage: currentUrlState.page,
    };
};