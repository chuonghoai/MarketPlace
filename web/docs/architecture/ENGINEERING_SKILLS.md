# Engineering Skills (AI Agent Guidelines)

Tài liệu này cung cấp các "kỹ năng" tiêu chuẩn để phát triển tính năng mới trong dự án E-Commerce Platform. Dành riêng cho AI Agent (hoặc Developer) để đảm bảo code sinh ra luôn tuân thủ đúng kiến trúc.

---

## Skill: Create New Feature

**WHEN TO USE**: Khi cần phát triển một nghiệp vụ hoàn toàn mới (VD: `payment`, `wishlist`) yêu cầu giao tiếp API và có models phức tạp.
**WHEN NOT TO USE**: Khi chỉ cần viết helper hàm tính toán (vào thư mục `utils`) hoặc tạo UI element thuần (vào `components`).

**GOOD EXAMPLE**:
Tạo cấu trúc thư mục:
```text
src/features/payment/
├── models/payment.model.ts
├── repositories/
│   ├── payment.repository.ts
│   ├── paymentApi.repository.ts
│   └── paymentMock.repository.ts
└── services/payment.service.ts
```

**BAD EXAMPLE**: Đặt logic giao tiếp API của payment vào `src/pages/checkout/api.ts`.
**COMMON MISTAKES**: Quên tạo `MockRepository` khiến app bị crash khi đổi biến môi trường sang mock mode.
**AUTO FIX STRATEGY**: Luôn dùng mẫu `Feature Template`: Tạo đủ 3 folder (models, repositories, services) và định nghĩa Interface trước khi implement.

---

## Skill: Create New Repository

**WHEN TO USE**: Khi một tính năng cần gọi một API Endpoint mới.
**WHEN NOT TO USE**: Khi cần thao tác dữ liệu nội bộ (Local Storage), dùng `core/storage` thay vì Repository.

**GOOD EXAMPLE**:
```typescript
// product.repository.ts
export interface ProductRepository {
    getProducts(): Promise<ApiResponse<ProductItem[]>>;
}

// productApi.repository.ts
export class ProductApiRepository implements ProductRepository {
    getProducts() {
        return apiClient.get<ApiResponse<ProductItem[]>>('/products');
    }
}
```

**BAD EXAMPLE**: Filter mảng trong repo.
```typescript
// BAD
export class ProductApiRepository implements ProductRepository {
    async getProducts() {
        const res = await apiClient.get('/products');
        // VI PHẠM: Logic tính toán tại Repo
        return res.data.filter(p => p.price > 100); 
    }
}
```

**COMMON MISTAKES**: Chứa mảng dữ liệu tính toán. Gọi UI element (`toast()`).
**AUTO FIX STRATEGY**: Cắt toàn bộ các hàm JS array helper (`.map`, `.filter`) chuyển lên file `.service.ts`. Xóa các lệnh import Toast, Navigate khỏi repo.

---

## Skill: Create New Service

**WHEN TO USE**: Khi cần một nơi chứa logic nghiệp vụ thuần tuý, hoặc khi Repository trả về data thô và Page cần data đã xử lý (đã mix nhiều repo với nhau).
**WHEN NOT TO USE**: Để chứa logic UI, Form State.

**GOOD EXAMPLE**:
```typescript
export class CartService {
    constructor(private repo: CartRepository = new CartApiRepository()) {}

    async calculateTotalAndCheckout(items: CartItem[]) {
        const total = items.reduce((acc, item) => acc + item.price * item.qty, 0);
        return this.repo.checkout({ items, total });
    }
}
```

**BAD EXAMPLE**: Import React Hooks vào Service.
**COMMON MISTAKES**: Biến Service thành một God Class bọc gọi toàn bộ hệ thống.
**AUTO FIX STRATEGY**: Đảm bảo Service class export dưới dạng instance singleton (`export const cartService = new CartService()`) để gọi ở các Controller/Store.

---

## Skill: Create New Controller (Page Logic)

**WHEN TO USE**: Dùng cho MỌI page (`*Page.tsx`). Là nòng cốt xử lý UI logic.
**WHEN NOT TO USE**: Controller không dùng cho một component con nhỏ (trừ khi nó có tính đóng gói rất mạnh).

**GOOD EXAMPLE**:
```typescript
export const useProfileController = () => {
    const [isLoading, setIsLoading] = useState(false);
    const store = useProfileStore();

    const handleSave = async (data) => {
        setIsLoading(true);
        await store.updateProfile(data);
        setIsLoading(false);
    }

    return { isLoading, handleSave, profile: store.profile };
};
```

**BAD EXAMPLE**: Đặt `fetch()` vào Controller thay vì gọi Store/Service.
**COMMON MISTAKES**: Để Data State khổng lồ trong Controller khiến file dài ra vô tận.
**AUTO FIX STRATEGY**: Extract Data fetching và data variables thành file `.store.ts`.

---

## Skill: Create New Page

**WHEN TO USE**: Tạo route màn hình mới cho user.
**WHEN NOT TO USE**: Chỉ cần một block UI hiển thị tái sử dụng (Dùng Components).

**GOOD EXAMPLE**:
File `ProfilePage.tsx`
```tsx
import { useProfileController } from './profile.controller';

export function ProfilePage() {
    const { isLoading, profile, handleSave } = useProfileController();
    
    if (isLoading) return <Loading />;
    return <ProfileForm data={profile} onSave={handleSave} />;
}
```

**BAD EXAMPLE**: Trộn lẫn tất cả UI, API call, Event Listeners vào `ProfilePage.tsx`.
**COMMON MISTAKES**: Đặt Component dài 500 dòng mà không tách block.
**AUTO FIX STRATEGY**: Bắt buộc tạo kèm file `.controller.ts` ngay khi tạo file `Page.tsx`.

---

## Skill: Form Handling

**WHEN TO USE**: Các màn Login, Checkout, Edit Profile.
**GOOD EXAMPLE**: Quản lý form data bằng state trong Controller, gọi logic Validation tại Controller trước khi truyền payload cho Service/Store.
**BAD EXAMPLE**: Lưu từng field của Form vào Local Storage trong component.
**COMMON MISTAKES**: Gọi thẳng API từ nút Submit mà không qua Controller.
