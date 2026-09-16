# UI & Component Rules (React 19 + TailwindCSS v4)

Tài liệu này quy định các tiêu chuẩn bắt buộc khi xây dựng và tái cấu trúc các React Components trong Web Marketplace.

---

## 1. Phân loại Component

1. **Page Components (`src/pages/*`, `src/admin/pages/*`):**
   - Đóng vai trò là điểm gắn kết (Container) cho một Route cụ thể.
   - Quản lý fetching dữ liệu khởi tạo của trang qua `useEffect` hoặc Store.
   - Kết hợp các sub-components lại thành giao diện hoàn chỉnh.
2. **Feature Components (`src/features/<feature>/components/*`):**
   - Các component gắn liền với một nghiệp vụ cụ thể (ví dụ: `ProductCard`, `CartDrawer`, `AddressModal`, `ReviewList`).
3. **Common UI Components (`src/components/common/*`):**
   - Các component dùng chung toàn hệ thống, độc lập với domain nghiệp vụ (ví dụ: `Button`, `InputField`, `Modal`, `Pagination`, `Spinner`, `Toast`).
4. **Layout Components (`src/components/layout/*`, `src/admin/layout/*`):**
   - Định dạng khung trang: `MainLayout`, `ProfileLayout`, `AdminLayout`, `Header`, `Footer`, `Sidebar`.

---

## 2. Quy tắc Coding Component

### 2.1 Tách biệt Presentation và Business Logic
- Các component hiển thị không nên chứa hàng trăm dòng tính toán nghiệp vụ.
- Tách logic phức tạp thành Custom Hook (ví dụ: `useCart()`, `useProductFilter()`) hoặc đưa vào Service.

### 2.2 Quy chuẩn Styling với TailwindCSS v4
- Sử dụng các theme token đã được khai báo trong `src/index.css`:
  - Màu sắc: `text-primary`, `bg-primary-container`, `bg-background-page`, `text-text-ink`, `border-border-subtle`, `bg-surface-card`.
  - Phông chữ: `font-headline` (Lora), `font-body` (Open Sans), `font-mono` (Source Code Pro).
  - Custom classes: `btn-primary`, `btn-secondary`, `input-field`, `card-border`.
- **TUYỆT ĐỐI KHÔNG** hardcode mã màu hex tùy tiện (ví dụ: `style={{ color: '#ff1234' }}`) nếu trong Design Token đã có màu tương đương.

### 2.3 Quản lý các State đặc biệt (Loading, Error, Empty)
Mọi component có fetch dữ liệu từ API **BẮT BUỘC** phải xử lý đủ 4 trạng thái:
1. **Loading State:** Skeleton loader hoặc Spinner rõ ràng.
2. **Error State:** Banner/Alert báo lỗi kèm nút "Thử lại" (Retry).
3. **Empty State:** Hình minh họa hoặc icon kèm thông báo phù hợp khi danh sách trống (ví dụ: "Chưa có đơn hàng nào").
4. **Success State:** Hiển thị dữ liệu.

---

## 3. Form Handling với `react-hook-form`

- Mọi form nhập liệu (Đăng nhập, Đăng ký, Tạo sản phẩm, Địa chỉ) phải sử dụng `react-hook-form`.
- Validate dữ liệu phía client trước khi gửi request xuống Service.
- Hiển thị lỗi validation ngay dưới input field với màu `text-error`.

```tsx
// Ví dụ mẫu chuẩn Form Component
import { useForm } from 'react-hook-form';

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginForm = ({ onSubmit, isLoading }: { onSubmit: (data: LoginFormData) => void; isLoading: boolean }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-ink mb-1">Email</label>
        <input
          type="email"
          {...register('email', { required: 'Email không được để trống' })}
          className="input-field w-full px-3 py-2 text-sm"
          placeholder="user@example.com"
        />
        {errors.email && <p className="text-xs text-error mt-1">{errors.email.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full py-2.5 font-medium flex items-center justify-center cursor-pointer disabled:opacity-50"
      >
        {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
      </button>
    </form>
  );
};
```
