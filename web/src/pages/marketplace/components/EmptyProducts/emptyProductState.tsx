import { useSearchParams } from "react-router-dom";
import { EFilterState } from "../filter/filter.type";

export const EmptyProductState = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const handleResetFilters = () => {
        const currentSearch = searchParams.get("search");
        if (currentSearch) {
            setSearchParams({ page: "1", sortBy: EFilterState.NEWEST, search: currentSearch });
        } else {
            setSearchParams({ page: "1", sortBy: EFilterState.NEWEST });
        }
    };

    return (
        <div className="w-full bg-white border border-[#E7E5E4] rounded-[8px] py-24 px-6 flex flex-col items-center justify-center text-center">

            <div className="w-20 h-20 bg-market-background rounded-full flex items-center justify-center mb-6 border border-[#E7E5E4]">
                <svg className="w-10 h-10 text-[#A8A29E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            </div>

            <h3 className="font-['Lora',serif] text-[24px] font-semibold text-[#1C1917] mb-3">
                Không tìm thấy tác phẩm nào
            </h3>

            <p className="text-[15px] text-[#57534E] max-w-[420px] mb-8 leading-relaxed font-['Open_Sans',sans-serif]">
                Rất tiếc, chúng tôi không tìm thấy sản phẩm nào phù hợp với bộ lọc hoặc tìm kiếm của bạn. Hãy thử điều chỉnh lại mức giá, danh mục hoặc từ khóa để khám phá thêm nhé.
            </p>

            <button
                onClick={handleResetFilters}
                className="bg-transparent text-market-primary border-[1.5px] border-market-primary h-[42px] px-6 rounded-[4px] font-semibold text-[14px] hover:bg-[#FDF6EC] transition-colors"
            >
                Xóa tất cả bộ lọc
            </button>
        </div>
    );
};