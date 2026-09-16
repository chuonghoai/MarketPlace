# State Management (Zustand & React Context)

Tài liệu này quy định chiến lược quản lý trạng thái (State Management) trong ứng dụng React của Marketplace.

---

## 1. Phân cấp State trong ứng dụng

Hệ thống sử dụng 3 cấp độ quản lý State:

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. Global / Module State (Zustand Stores)                   │
│    - Quản lý danh sách, filter, pagination, modal states    │
│    - Sử dụng chủ yếu trong phân hệ Admin & Global features  │
├─────────────────────────────────────────────────────────────┤
│ 2. Scoped Domain State (React Context)                      │
│    - Cung cấp state dùng chung cho một phân nhánh Component │
│    - Ví dụ: CartProvider (CartContext) bọc MainLayout        │
├─────────────────────────────────────────────────────────────┤
│ 3. Local Component State (useState / useReducer)            │
│    - Dropdown toggle, input validation, dialog open/close   │
│    - Biến cục bộ trong 1 component                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Zustand Store Pattern (`*.store.ts`)

Zustand được sử dụng cho state phức tạp có nhiều actions và cần chia sẻ giữa các sub-components mà không bị prop-drilling.

### Cấu trúc mẫu chuẩn:
```typescript
// admin/pages/voucher/voucher.store.ts
import { create } from 'zustand';
import type { Voucher } from '../../../features/voucher/models/voucher.model';
import { voucherService } from '../../../features/voucher/services/voucher.service';

interface VoucherState {
  vouchers: Voucher[];
  isLoading: boolean;
  error: string | null;
  selectedVoucher: Voucher | null;
  isCreateModalOpen: boolean;

  // Actions
  fetchVouchers: () => Promise<void>;
  setSelectedVoucher: (voucher: Voucher | null) => void;
  setCreateModalOpen: (open: boolean) => void;
  deleteVoucher: (id: string) => Promise<boolean>;
}

export const useVoucherStore = create<VoucherState>((set, get) => ({
  vouchers: [],
  isLoading: false,
  error: null,
  selectedVoucher: null,
  isCreateModalOpen: false,

  fetchVouchers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await voucherService.getAllVouchers();
      if (response.success && response.data) {
        set({ vouchers: response.data, isLoading: false });
      } else {
        set({ error: response.message || 'Lỗi tải danh sách voucher', isLoading: false });
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  setSelectedVoucher: (voucher) => set({ selectedVoucher: voucher }),
  setCreateModalOpen: (open) => set({ isCreateModalOpen: open }),

  deleteVoucher: async (id: string) => {
    const response = await voucherService.deleteVoucher(id);
    if (response.success) {
      set({ vouchers: get().vouchers.filter((v) => v.id !== id) });
      return true;
    }
    return false;
  },
}));
```

---

## 3. React Context Pattern (`*Context.tsx`)

React Context được sử dụng khi state gắn chặt với cây Component DOM (ví dụ: `CartContext` bao bọc `MainLayout` để mọi trang con đều có thể truy cập `cartCount`, `addToCart`, `items`).

### Quy tắc Context:
- Luôn tạo Custom Hook để tiêu thụ Context an toàn:
```tsx
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
```
- Không lạm dụng Context cho toàn bộ app để tránh re-render không cần thiết.

---

## 4. Local Component State (`useState`)

- Chỉ dùng `useState` cho dữ liệu mang tính hiển thị tạm thời (ví dụ: `isPasswordVisible`, `activeTab`, `isHovered`).
- Nếu state cần được chia sẻ cho 3 component con trở lên hoặc cần giữ lại khi chuyển view, hãy nâng cấp lên Zustand Store.
