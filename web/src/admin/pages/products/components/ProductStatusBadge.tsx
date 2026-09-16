const STOCK_LABELS: Record<string, { label: string; color: string }> = {
    in_stock: { label: 'Còn hàng', color: 'text-green-600 bg-green-50 border-green-200' },
    low_stock: { label: 'Sắp hết', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
    out_of_stock: { label: 'Hết hàng', color: 'text-red-600 bg-red-50 border-red-200' },
};

interface Props {
    status: string;
}

export const ProductStatusBadge = ({ status }: Props) => {
    const info = STOCK_LABELS[status] || STOCK_LABELS.in_stock;
    return (
        <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${info.color}`}>
            {info.label}
        </span>
    );
};