# Architecture Rules

Tài liệu này định nghĩa bộ quy tắc kiến trúc thực tế ĐANG ĐƯỢC ÁP DỤNG trong dự án. Mọi code mới phải tuân theo các quy tắc này.

## 1. Khi nào tạo Feature mới (`src/features/`)?

* **Rule**: Tạo Feature mới khi bạn có một "nghiệp vụ cốt lõi" (domain) mới có API riêng, entities riêng và logic không gắn liền với một màn hình cụ thể.
* **Ví dụ**: Tính năng giỏ hàng (`cart`), người dùng (`user`), đơn hàng (`order`).
* **Không tạo khi**: Chức năng đó chỉ hiển thị UI hoặc đơn thuần là các hàm helper.

## 2. Khi nào tạo Page mới (`src/pages/`)?

* **Rule**: Tạo thư mục Page mới khi bạn tạo ra một URL/Route mới mà người dùng có thể truy cập được.
* **Ví dụ**: Trang chủ (`marketplace`), Trang chi tiết sản phẩm (`product`), Trang giỏ hàng (`cart`).
* **Quy ước**: Tên thư mục dạng `kebab-case` hoặc `camelCase` (ví dụ: `order-checkout`), bên trong chứa file `{pageName}Page.tsx`, `{pageName}.controller.ts`.

## 3. Khi nào tạo Repository (`*.repository.ts`)?

* **Rule**: Khi Feature cần giao tiếp với API hoặc Database.
* **Convention BẮT BUỘC**:
  1. Luôn tạo Interface (ví dụ: `ProductRepository`).
  2. Tạo 2 file Implementations: `{Feature}Api.repository.ts` (gọi API thực tế) và `{Feature}Mock.repository.ts` (mock data tĩnh).
* **Nghiêm cấm**: Không đặt bất kỳ vòng lặp xử lý logic tính toán, map/reduce data phức tạp (business logic) ở đây. Repository chỉ có nhiệm vụ GỌI `apiClient` VÀ TRẢ VỀ `ApiResponse`.

## 4. Khi nào tạo Service (`*.service.ts`)?

* **Rule**: Tạo Service trong thư mục `features/{featureName}/services` để wrap các Repositories, xử lý logic chuyển đổi dựa trên biến `USE_MOCK` hoặc chứa logic nghiệp vụ thuần túy của domain đó.
* **Nhiệm vụ**: Service sẽ chọn khởi tạo `MockRepository` hay `ApiRepository`.
* **Nghiêm cấm**: Service KHÔNG ĐƯỢC CHỨA UI State, KHÔNG dùng các React Hooks (`useState`, `useEffect`). Service thường là các class hoặc object thuần TS/JS.

## 5. Khi nào tạo Controller (`*.controller.ts`)?

* **Rule**: Bắt buộc tạo cho MỌI PAGE. Page Component KHÔNG ĐƯỢC phép khai báo `useState` hoặc các hàm xử lý sự kiện (event handler) phức tạp.
* **Nhiệm vụ**: Chứa toàn bộ logic UI của trang (Ví dụ: `isLoading`, `isOpen`, `handleOpenModal`, `handlePageChange`). Gọi Store hoặc Service để load data.
* **Output**: Controller là một Custom Hook (ví dụ: `useMarketplaceController`) trả về các state và các hàm handler để Page Component sử dụng.

## 6. Khi nào tạo Store (`*.store.ts`)?

* **Rule**: CHỈ tạo Store khi Page có Data State phức tạp (ví dụ: cần kết hợp nhiều API, hoặc cần chia sẻ data giữa các component con của Page mà Controller đang quá tải).
* **Nếu Page đơn giản**: Dùng `useState` để chứa data (ví dụ `products`) trực tiếp trong Controller (như `marketplace.controller.ts`).
* **Nếu Page phức tạp**: Tách data state (ví dụ `product`, `addToCart()`) sang `useProductStore`, và Controller sẽ gọi `store.product`.

## 7. Khi nào tách Component (`src/pages/{pageName}/components/`)?

* **Rule**: Tách Component khi file Page (`*Page.tsx`) trở nên quá dài (khuyến cáo: > 250 dòng) HOẶC khi một khối UI (block) có tính độc lập cao (Ví dụ: `Filter`, `ProductReviews`).
* **Vị trí**: Đặt vào thư mục `components` BÊN TRONG thư mục Page tương ứng. KHÔNG đặt ở `src/components` trừ khi Component đó được dùng lại ở nhiều Page khác nhau.

## 8. Dependency / Import Rules (Quy tắc Dependency)

* **UI gọi Data**: `Page` -> `Controller` -> `Store` -> `Service`.
* **Cấm gọi ngược**: `features/` KHÔNG BAO GIỜ được phép import từ `pages/`. `core/` KHÔNG BAO GIỜ được phép import từ `features/` hay `pages/`.
* **API Client**: Component (`.tsx`) và Controller tuyệt đối KHÔNG import trực tiếp `apiClient`. Mọi lệnh gọi API phải thông qua Service/Repository.
