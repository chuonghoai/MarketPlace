export const OrderSkeleton = () => (
    <div className="bg-[#FFFFFF] border border-border-subtle rounded-lg p-5 flex gap-6 animate-pulse">
        <div className="w-24 h-24 bg-[#F5F5F4] rounded-sm shrink-0" />
        <div className="flex-1 space-y-3 py-1">
            <div className="h-4 bg-[#F5F5F4] rounded w-1/4" />
            <div className="h-3 bg-[#F5F5F4] rounded w-1/3" />
            <div className="h-3 bg-[#F5F5F4] rounded w-1/2" />
        </div>
        <div className="w-48 flex flex-col items-end space-y-3">
            <div className="h-6 bg-[#F5F5F4] rounded w-1/2" />
            <div className="h-5 bg-[#F5F5F4] rounded w-3/4" />
        </div>
    </div>
);
