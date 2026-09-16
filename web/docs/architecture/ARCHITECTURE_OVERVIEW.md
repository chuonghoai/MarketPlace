# Architecture Overview

Tài liệu này mô tả kiến trúc tổng thể của E-Commerce Platform dựa trên codebase hiện tại. Kiến trúc của dự án là sự kết hợp giữa **Feature-Sliced Design (FSD)** và **Layered Architecture** (với các biến thể của MVC/MVVM ở tầng Presentation).

## 1. Folder Structure Overview

Dự án được tổ chức thành các thư mục chính trong `src/`:

- **`core/`**: Chứa các cấu hình toàn cục, API client (axios interceptors), các hằng số (constants), và storage services chung (local storage). Đây là tầng thấp nhất, không phụ thuộc vào bất kỳ tầng nào khác.
- **`features/`**: Chứa business logic cốt lõi, được chia theo từng domain/nghiệp vụ (VD: `products`, `cart`, `user`, `order`).
- **`pages/`**: Chứa UI logic, các trang và component đặc thù của trang đó, cùng với State Management (Controller/Store).
- **`admin/`**: Tương tự như một ứng dụng độc lập thu nhỏ dành cho Admin, bên trong cũng chia thành `features`, `layout`, `pages`.
- **`components/`**: Các UI Component dùng chung trên toàn hệ thống (VD: Layout, Toast).
- **`cpnController/`**: Các controller của UI dùng để điều khiển component, dùng cho trường hợp một giao diện có nhiều component có các logic khác nhau (ví dụ profile có main layout là sidebar, mỗi menu option là 1 compontent, mỗi component có logic khác nhau)
- **`routes/`**: Chứa định nghĩa và cấu hình routing của toàn bộ ứng dụng.
- **`utils/`**: Các hàm utility helper dùng chung.

## 2. Layered Architecture (Chi tiết)

### 2.1. Feature Layer (`src/features/`)
Mỗi feature (VD: `products`) được chia thành 3 phần chính theo Repository Pattern:
- **Models (`*.model.ts`)**: Định nghĩa Data Types, Interfaces của các entity.
- **Repositories (`*.repository.ts`)**: Định nghĩa interface cho việc fetch data và các implement thực tế (thường có `ApiRepository` gọi API thật qua `core/api/apiClient` và `MockRepository` để trả về dữ liệu tĩnh khi `USE_MOCK = true`). **Tuyệt đối không chứa business logic phức tạp tại đây**, chỉ gọi API và map response.
- **Services (`*.service.ts`)**: Lớp Business Logic. Các Services sẽ gọi các Repositories để lấy dữ liệu, xử lý nghiệp vụ, và trả về cho tầng Presentation.

### 2.2. Presentation Layer (`src/pages/`)
Mỗi Page (VD: `product`, `marketplace`) áp dụng mô hình phân tách logic và UI rất rõ ràng:
- **Page Component (`*Page.tsx`)**: Chịu trách nhiệm render UI (JSX). Component này hoàn toàn "ngu" (dumb), không tự gọi API hay quản lý State nội bộ phức tạp, mà sẽ gọi Controller để lấy dữ liệu và function handler.
- **Controller (`*.controller.ts`)**: Quản lý UI State (loading, error, pagination, toggle trạng thái). Nó đóng vai trò là "người kết nối" giữa UI (Page) và Data (Service/Store).
- **Store (`*.store.ts` - Tùy chọn)**: Đối với các Page có logic data phức tạp, Store được sử dụng để bóc tách Data Fetching và Data State ra khỏi Controller.
- **Components (`components/`)**: Các component con nhỏ hơn của Page để chia nhỏ file Page (VD: Filter, ProductReviews).

## 3. Data Flow (Luồng dữ liệu)

Luồng dữ liệu trong ứng dụng tuân thủ luồng một chiều (Unidirectional Data Flow) cho mỗi hành động:

1. **User Interaction**: Người dùng tương tác với UI trên `*Page.tsx` (VD: Click nút "Thêm vào giỏ").
2. **Controller**: Gọi một hàm handler trong `*.controller.ts` (VD: `handleAddToCart`). Controller bật state `isLoading = true`.
3. **Store (nếu có)**: Controller ủy quyền cho `*.store.ts` (VD: `store.addToCart()`).
4. **Service**: Store gọi tới tầng Business Logic (`*.service.ts` ở trong thư mục `features/`).
5. **Repository**: Service gọi tới `*.repository.ts` tương ứng (`ApiRepository` hoặc `MockRepository`).
6. **API Client**: Repository gửi HTTP Request qua `core/api/apiClient`.
7. **Response**: Dữ liệu đi ngược lại từ API -> Repository -> Service -> Store -> Controller -> Page (cập nhật UI).

## 4. Dependency Direction

Dependency Direction (Hướng phụ thuộc) tuân thủ quy tắc từ ngoài vào trong:

- **`pages/`** phụ thuộc vào **`features/`** và **`components/`**.
- **`features/`** phụ thuộc vào **`core/`**.
- **`core/`** không phụ thuộc vào bất kỳ thư mục nào ở trên.
- **Quy tắc quan trọng**: `features/` KHÔNG BAO GIỜ được import code từ `pages/`. Các features phải độc lập với giao diện. `core/` KHÔNG BAO GIỜ được import từ `features/` hoặc `pages/`.

## 5. State Management Strategy

- **Global/Domain State**: Được quản lý bởi React Context nằm bên trong thư mục `features/` (VD: `CartContext` nằm ở `features/cart/contexts/CartContext.tsx`).
- **Page Data State**: Quản lý tại `*.store.ts` hoặc `*.controller.ts` của trang đó thông qua React Hooks thông thường.
- **UI State**: Luôn nằm trong `*.controller.ts` (Loading, Form inputs, toggles, current active index).
