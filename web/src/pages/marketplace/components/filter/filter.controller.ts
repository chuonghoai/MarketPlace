import { useState, useEffect, useMemo } from "react";
import type { Category } from "../../../../features/category/models/category.model";
import { EFilterState, type FilterState } from "./filter.type";
import { useSearchParams } from "react-router-dom";
import { CategoryService } from "../../../../features/category/services/category.service";

const categoryService = new CategoryService();

export const useFilterController = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();

    const searchParamsString = searchParams.toString();

    const currentFiltersFromUrl = useMemo((): FilterState => {
        return {
            sortBy: (searchParams.get("sortBy") as EFilterState) || EFilterState.NEWEST,
            categories: searchParams.getAll("categories"),
            minPrice: searchParams.get("minPrice") || "",
            maxPrice: searchParams.get("maxPrice") || "",
        };
    }, [searchParamsString]);

    const [localFilters, setLocalFilters] = useState<FilterState>(currentFiltersFromUrl);

    useEffect(() => {
        setLocalFilters(currentFiltersFromUrl);
    }, [searchParamsString]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await categoryService.getAllCategories();
            if (res.success) {
                setCategories(res.data);
            }
        } catch (error) {
            console.error("Lỗi lấy danh mục:", error);
        }
    };

    const handleSortChange = (value: EFilterState) => {
        setLocalFilters((prev) => ({ ...prev, sortBy: value }));
    };

    const handleCategoryToggle = (categoryId: string) => {
        setLocalFilters((prev) => {
            const isSelected = prev.categories.includes(categoryId);
            const newCategories = isSelected
                ? prev.categories.filter((id) => id !== categoryId)
                : [...prev.categories, categoryId];
            return { ...prev, categories: newCategories };
        });
    };

    const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: string) => {
        if (value === '' || /^\d+$/.test(value)) {
            setLocalFilters(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleApply = () => {
        const params = new URLSearchParams();

        const currentSearch = searchParams.get("search");
        if (currentSearch) params.set("search", currentSearch);

        params.set("page", "1");
        params.set("sortBy", localFilters.sortBy);
        if (localFilters.minPrice) params.set("minPrice", localFilters.minPrice);
        if (localFilters.maxPrice) params.set("maxPrice", localFilters.maxPrice);

        localFilters.categories.forEach((id) => params.append("categories", id));
        setSearchParams(params);
    };

    const handleReset = () => {
        const currentSearch = searchParams.get("search");
        if (currentSearch) {
            setSearchParams({ page: "1", sortBy: EFilterState.NEWEST, search: currentSearch });
        } else {
            setSearchParams({ page: "1", sortBy: EFilterState.NEWEST });
        }
    };

    return {
        categories,
        localFilters,
        handleSortChange,
        handleCategoryToggle,
        handlePriceChange,
        handleApply,
        handleReset
    };
};