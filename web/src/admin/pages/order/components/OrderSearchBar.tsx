import { Search } from 'lucide-react';

export const OrderSearchBar = ({
    value,
    onChange,
}: {
    value: string;
    onChange: (val: string) => void;
}) => (
    <div className="relative w-full md:w-[320px]">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A8A29E]">
            <Search size={18} />
        </div>
        <input
            type="text"
            placeholder="Tìm kiếm mã, tên hoặc SĐT"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-[#FFFFFF] border-[1.5px] border-border-medium text-text-ink placeholder:text-[#A8A29E] rounded-sm pl-10 pr-4 h-10.5 font-body text-[16px] focus:outline-none focus:border-market-primary focus:ring-[3px] focus:ring-market-primary/15 transition-all"
        />
    </div>
);
