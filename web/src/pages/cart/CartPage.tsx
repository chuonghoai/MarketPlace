import React from 'react';
import { useCartController } from './cart.controller';
import { CartEmptyState } from './components/CartEmptyState';
import { CartItemCard } from './components/CartItemCard';
import { CartSummary } from './components/CartSummary';
import { DraftOrdersList } from './components/DraftOrdersList';

const CartPage: React.FC = () => {
  const controller = useCartController();

  if (!controller.isLoading && controller.items.length === 0) {
    return <CartEmptyState />;
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5] font-sans pb-24">
      <main className="w-full px-4 sm:px-8 lg:px-12 pt-12">
        <header className="mb-10">
          <h1 className="text-4xl font-serif text-gray-900 mb-3">Giỏ hàng của bạn</h1>
        </header>

        <div className="flex flex-col lg:flex-row gap-12 items-start">

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col gap-8">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 border border-[#E7E5E4] order-2 lg:order-1">
              {/* Select All Checkbox */}
              <div className="flex items-center pb-4 sm:pb-6 border-b border-[#E7E5E4] mb-4 sm:mb-6">
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={controller.isAllSelected}
                  onChange={controller.toggleSelectAll}
                  className="w-5 h-5 text-market-primary border-[#D6D3D1] rounded focus:ring-market-primary cursor-pointer"
                />
                <label htmlFor="selectAll" className="ml-3 font-medium text-gray-900 cursor-pointer select-none">
                  Chọn tất cả ({controller.items.length} sản phẩm)
                </label>
              </div>

              {/* Item List */}
              <div className="space-y-6 sm:space-y-10">
                {controller.items.map((item, index) => (
                  <div key={item.product.id}>
                    <CartItemCard
                      item={item}
                      isSelected={controller.selectedItemIds.includes(item.product.id)}
                      onToggleSelect={() => controller.toggleSelection(item.product.id)}
                      isLoading={controller.isLoading}
                      onUpdateQuantity={controller.updateQuantity}
                      onRemove={controller.removeItem}
                      formatMoney={controller.formatMoney}
                    />
                    {index < controller.items.length - 1 && (
                      <div className="w-full border-t border-dashed border-[#D6D3D1] mt-6 sm:mt-10"></div>
                    )}
                  </div>
                ))}
              </div>

            </div>

            {/* Draft Orders */}
            <div className="order-1 lg:order-2">
              <DraftOrdersList drafts={controller.draftOrders} />
            </div>
          </div>

          {/* Summary */}
          <div className="w-full lg:w-[380px] shrink-0">
            <CartSummary
              finalTotal={controller.finalTotal}
              selectedCount={controller.selectedCount}
              onCheckout={controller.handleCheckout}
              formatMoney={controller.formatMoney}
            />
          </div>

        </div>
      </main>
    </div>
  );
};

export default CartPage;