import React from 'react';

interface Props {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  disabled?: boolean;
  max?: number;
}

export const QuantitySelector: React.FC<Props> = ({
  quantity,
  onIncrease,
  onDecrease,
  disabled,
  max,
}) => {
  const isMaxReached = typeof max === 'number' && quantity >= max;

  return (
    <div className="flex items-center border border-[#D6D3D1] dark:border-stone-700 rounded-[4px] bg-white dark:bg-stone-900 h-11 md:h-auto">
      <button 
        disabled={disabled}
        onClick={onDecrease}
        className="w-11 md:w-auto md:px-3 h-full md:py-1.5 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[#FFFBF5] dark:hover:bg-stone-800 hover:text-[#C2410C] dark:hover:text-[#F97316] disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#C2410C]/20 rounded-l-[4px] transition-colors"
        aria-label="Giảm số lượng"
        data-testid="cart-decrease-quantity"
      >
        −
      </button>
      <span
        data-testid="cart-quantity-display"
        className="flex-1 md:flex-none md:px-4 h-full flex items-center justify-center text-sm font-medium text-gray-900 dark:text-stone-100 min-w-[40px] border-x border-[#D6D3D1] dark:border-stone-700"
      >
        {quantity}
      </span>
      <button 
        disabled={disabled || isMaxReached}
        onClick={onIncrease}
        className="w-11 md:w-auto md:px-3 h-full md:py-1.5 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[#FFFBF5] dark:hover:bg-stone-800 hover:text-[#C2410C] dark:hover:text-[#F97316] disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#C2410C]/20 rounded-r-[4px] transition-colors"
        aria-label="Tăng số lượng"
        data-testid="cart-increase-quantity"
        title={isMaxReached ? `Đã đạt số lượng tồn kho tối đa (${max})` : undefined}
      >
        +
      </button>
    </div>
  );
};
