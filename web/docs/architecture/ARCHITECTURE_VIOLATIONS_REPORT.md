# Architecture Violations Report

Báo cáo này đánh giá mức độ tuân thủ kiến trúc của các module hiện tại trong E-Commerce Platform và liệt kê các vi phạm cần khắc phục.

## 1. Đánh giá tổng quan (Module Compliance)

Các module tuân thủ kiến trúc rất tốt (Đáng làm mẫu để học tập):
- ✅ **Cart Module (`features/cart` & `pages/cart`)**: Phân tách file rõ ràng, Page ngắn gọn (81 dòng), Controller quản lý tốt state, UI tách thành các component nhỏ (`CartItemCard`, `CartSummary`).
- ✅ **Marketplace Module (`pages/marketplace`)**: Tận dụng Controller tốt cho trang đơn giản (không cần Store), quản lý filter qua URL search params rất chuẩn.

Các module có vấn đề cần xem xét:
- ⚠️ **Products Module (`features/products`)**: Vi phạm Dependency Direction (Import chéo).
- ⚠️ **Product Detail Page (`pages/product`)**: Vi phạm kích thước Component.
- ⚠️ **Checkout Page (`pages/order-checkout`)**: Leak một chút logic data vào Controller.

---

## 2. Chi tiết các vi phạm (Violations)

### Violation 1: Cross-layer Dependency (Import ngược tầng)
- **Mức độ**: `[HIGH]`
- **File vi phạm**: 
  - `features/products/services/product.service.ts`
  - `features/products/repositories/product.repository.ts`
  - `features/products/repositories/productApi.repository.ts`
  - `features/products/repositories/productMock.repository.ts`
- **Mô tả**: Các file thuộc tầng Core Business Logic (`features/products`) lại đi import `FilterState` và `EFilterState` từ tầng Presentation (`pages/marketplace/components/filter/filter.type`). Điều này phá vỡ hoàn toàn nguyên tắc Dependency Direction (từ ngoài vào trong). Tầng Features không được biết về UI Pages.
- **Nguyên nhân**: Dev tạo component Filter trên UI trước, khai báo Interface ở đó, rồi khi làm logic ở Repo/Service lại tận dụng import luôn Interface đó thay vì tạo mới.
- **Hướng refactor**: 
  1. Di chuyển file `filter.type.ts` xuống thư mục `features/products/models/` hoặc tạo một `features/products/dto/`.
  2. Cập nhật lại đường dẫn import ở cả `features` và `pages`.

### Violation 2: The "God Component" (Component quá dài)
- **Mức độ**: `[MEDIUM]`
- **File vi phạm**: `pages/product/productPage.tsx`
- **Mô tả**: File dài tới 412 dòng, chứa toàn bộ JSX hiển thị Hero Image, Thông tin sản phẩm, Meet the Maker, Story & Specs. Dù logic đã được tách ra Controller rất tốt, nhưng file UI quá khổng lồ gây khó đọc và bảo trì.
- **Nguyên nhân**: Lười tách Component cho các khối giao diện trên một trang.
- **Hướng refactor**: Tách nội dung trong `ProductPage.tsx` ra thành các components con đặt ở `pages/product/components/`:
  - `<ProductHero />` (Phần hình ảnh và slider)
  - `<ProductInfo />` (Phần giá, nút mua, phân loại)
  - `<MakerProfile />` (Phần gặp gỡ nghệ nhân)
  - `<ProductSpecs />` (Phần câu chuyện và đặc tả)

### Violation 3: Data Transformation Logic Leakage in Controller
- **Mức độ**: `[LOW]`
- **File vi phạm**: `pages/order-checkout/checkout.controller.ts`
- **Mô tả**: Trong các hàm `handleSelectAddress` và `handleRemoveItem`, Controller đang chứa logic `.map()`, `.filter()` khá dài dòng để tái cấu trúc lại mảng `PrepareCheckoutRequest[]` khi người dùng thay đổi dữ liệu giỏ hàng.
- **Nguyên nhân**: Đặt logic map/filter data mảng vào Controller tiện tay thay vì đẩy xuống Store.
- **Hướng refactor**: Di chuyển các đoạn mã tính toán và tạo mảng `currentRequest` / `remainingRequest` vào bên trong `checkout.store.ts` (ví dụ tạo hàm `store.updateAddressAndRefetch()` hoặc `store.removeItemAndRefetch()`), giúp Controller gọn gàng hơn.

---

## 3. Lời khuyên ưu tiên xử lý

1. **Ưu tiên 1 (CRITICAL/HIGH)**: Xử lý ngay **Violation 1** vì nó ảnh hưởng đến kiến trúc nền tảng và sẽ gây lỗi vòng lặp import (circular dependency) hoặc cản trở việc tách module sau này.
2. **Ưu tiên 2 (MEDIUM)**: Xử lý **Violation 2** khi có task chỉnh sửa giao diện chi tiết sản phẩm.
3. **Ưu tiên 3 (LOW)**: Refactor **Violation 3** khi rảnh rỗi hoặc có bug liên quan tới logic checkout.
