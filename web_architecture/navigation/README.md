# Navigation & Routing Rules (React Router v7)

Toàn bộ hệ thống điều hướng của Web Frontend Marketplace sử dụng **React Router v7** (`react-router-dom`), được cấu hình tập trung tại `src/routes/index.tsx`.

---

## 1. Cấu trúc Route & Phân hệ Layout

Hệ thống được chia thành 3 phân vùng chính:

```tsx
<BrowserRouter>
  <Routes>
    {/* 1. Phân hệ Khách hàng (Bọc bởi CartProvider & MainLayout) */}
    <Route path="/" element={<CartProvider><MainLayout /></CartProvider>}>
      <Route index element={<MarketplacePage />} />
      <Route path="product/:id" element={<ProductPage />} />
      
      {/* Route yêu cầu đăng nhập User */}
      <Route path="cart" element={<AuthGuard requireAuth allowedRoles={[EUserRole.USER]}><CartPage /></AuthGuard>} />
      <Route path="order/checkout" element={<AuthGuard requireAuth allowedRoles={[EUserRole.USER]}><CheckoutPage /></AuthGuard>} />
      
      {/* Profile Layout lồng nhau */}
      <Route path="profile" element={<AuthGuard requireAuth allowedRoles={[EUserRole.USER]}><ProfileLayout /></AuthGuard>}>
        <Route index element={<Navigate to="/profile/dashboard" replace />} />
        <Route path="dashboard" element={<ProfileDashboardPage />} />
        <Route path="addresses" element={<AddressManagementPage />} />
        <Route path="order/tracking" element={<OrderTrackingList />} />
        <Route path="order/tracking/:orderId" element={<OrderTrackingDetail />} />
      </Route>
    </Route>

    {/* 2. Phân hệ Quản trị (Admin & Staff Layout) */}
    <Route path="/admin" element={<AuthGuard requireAuth allowedRoles={[EUserRole.ADMIN, EUserRole.STAFF]}><AdminLayout /></AuthGuard>}>
      <Route index element={<Navigate to="/admin/overview" replace />} />
      <Route path="overview" element={<DashboardPage />} />
      <Route path="products" element={<ProductsPage />} />
      <Route path="products/create" element={<CreateProductPage />} />
      <Route path="products/:id/edit" element={<EditProductPage />} />
      <Route path="orders" element={<OrderPage />} />
      <Route path="vouchers" element={<VouchersPage />} />
    </Route>

    {/* 3. Phân hệ Authentication (Không bọc MainLayout) */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />

    {/* 4. Fallback Not Found */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
</BrowserRouter>
```

---

## 2. Route Protection & AuthGuard (`src/core/auth/auth.guard.tsx`)

Mọi Route có dữ liệu riêng tư hoặc yêu cầu quyền hạn **BẮT BUỘC** được bọc bởi `AuthGuard`:
- `requireAuth = true`: Nếu chưa đăng nhập -> Tự động chuyển hướng về `/login` kèm `state: { from: location }`.
- `allowedRoles = [EUserRole.ADMIN, EUserRole.STAFF]`: Nếu vai trò không khớp -> Chuyển hướng về trang chủ hoặc trang thông báo không có quyền truy cập.

---

## 3. Quy tắc Điều hướng trong Code

### 3.1 Dùng `Link` và `NavLink` cho liên kết trong UI
- Sử dụng `<Link to="/product/123">` thay vì dùng thẻ `<a href="...">` gây reload toàn bộ trang (Full Page Reload).
- Sử dụng `<NavLink>` cho Sidebar/Navbar để tự động áp dụng style `isActive`.

### 3.2 Dùng `useNavigate` cho điều hướng lập trình (Programmatic Navigation)
```tsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

// Điều hướng chuyển trang
navigate('/cart');

// Điều hướng thay thế (không lưu lịch sử)
navigate('/login', { replace: true });

// Quay lại trang trước
navigate(-1);
```

### 3.3 Đọc params & query params
- Dùng `useParams<{ id: string }>()` để lấy route params (`/product/:id`).
- Dùng `useSearchParams()` để lấy query params (`/marketplace?category=clothes&page=2`).