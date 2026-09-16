import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../features/cart/contexts/CartContext';
import { formatVND } from '../../features/cart/services/cart.service';
import { useToast } from '../../components/toast/toast';
import { userStorageService } from '../../features/user/services/userStorage.service';
import { CheckoutApiRepository } from '../../features/order/checkout/repositories/checkoutApi.repository';
import type { DraftOrderModel } from '../../features/order/checkout/models/checkout.model';

export const useCartController = () => {
  const { items, updateQuantity, removeItem, isLoading, loadCart } = useCart();

  const [coupon, setCoupon] = useState("");

  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [hasInitializedSelection, setHasInitializedSelection] = useState(false);
  const [draftOrders, setDraftOrders] = useState<DraftOrderModel[]>([]);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!userStorageService.getUser()) {
      toast("Bạn cần đăng nhập để sử dụng chức năng này", "warning");
      navigate('/login');
    }
    else {
      loadCart();
      const checkoutRepo = new CheckoutApiRepository();
      checkoutRepo.getDraftOrders().then(res => {
        if (res.data) setDraftOrders(res.data);
      }).catch(console.error);
    }
  }, [navigate, toast, loadCart]);

  useEffect(() => {
    if (items.length > 0 && !hasInitializedSelection) {
      setSelectedItemIds(items.map(item => item.product.id));
      setHasInitializedSelection(true);
    } else if (items.length > 0) {
      setSelectedItemIds(prev => prev.filter(id => items.some(item => item.product.id === id)));
    } else if (items.length === 0) {
      setHasInitializedSelection(false);
      setSelectedItemIds([]);
    }
  }, [items, hasInitializedSelection]);

  const toggleSelection = (productId: string) => {
    setSelectedItemIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItemIds.length === items.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(items.map(i => i.product.id));
    }
  };

  const finalTotal = items
    .filter(item => selectedItemIds.includes(item.product.id))
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const totalMakers = new Set(items.map(item => item.product.id)).size;

  const isAllSelected = items.length > 0 && selectedItemIds.length === items.length;
  const selectedCount = selectedItemIds.length;

  const handleCheckout = () => {
    const checkoutItems = items
      .filter(item => selectedItemIds.includes(item.product.id))
      .map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }));
    navigate("/order/checkout", { state: { checkoutItems } });
  };

  return {
    items,
    finalTotal,
    totalMakers,
    isLoading,
    coupon,
    selectedItemIds,
    isAllSelected,
    selectedCount,
    setCoupon,
    updateQuantity,
    removeItem,
    toggleSelection,
    toggleSelectAll,
    handleCheckout,
    formatMoney: formatVND,
    draftOrders
  };
};