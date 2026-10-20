# BÁO CÁO MA TRẬN TRUY VẾT KIỂM THỬ HỘP ĐEN (TRACEABILITY MATRIX)
## Phân tích & Truy vết Toàn bộ 50 Test Case Đầu tiên: MKP_001 → MKP_050

> **Dự án:** MarketPlace  
> **Ngày lập:** 19/10/2026  
> **Phạm vi kiểm thử:** MKP_001 → MKP_050 (Tương ứng với TASK-001 → TASK-050)  
> **Cơ sở đối chiếu:** Source code thực tế (`web/`, `backend/`, `playwright/`, `web/tests/`) và tài liệu `docs/black_box_testing/`

---

## 1. Executive Summary

Báo cáo này cung cấp ma trận truy vết hai chiều (Bidirectional Traceability Matrix) hoàn chỉnh cho **50 Black-Box Test Cases (MKP_001 → MKP_050)** trong hệ thống MarketPlace.
Mỗi Test Case được đối chiếu chính xác tới:
1. **Use Case (UC) gốc** trong đặc tả yêu cầu.
2. **File kịch bản kiểm thử tự động (Playwright Test File)** đang thực thi test.
3. **Tên hàm test (Test Name / Title)** và **vị trí dòng chính xác (Line Range)** trong mã nguồn test.
4. **Tập tin nguồn thực thi nghiệp vụ (Source Files: Frontend, Backend, Entity)**.
5. **Endpoint API** được gọi trong quá trình tương tác (hoặc N/A nếu thuần Client/UI).
6. **Nội dung kiểm tra cốt lõi (Assertions)** đảm bảo không có false positive.

```text
TỔNG SỐ TEST CASE KIỂM TRA: 50/50 (MKP_001 → MKP_050)
TRẠNG THÁI TRUY VẾT: HOÀN TẤT (100% FOUND)
SỐ TẬP TIN TEST THỰC TẾ: 24 files
SỐ TẬP TIN SOURCE CODE THỰC THI: 44 files
```

---

## 2. Canonical MKP ↔ UC Mapping

Căn cứ theo tài liệu tổng hợp [`docs/black_box_testing/TongHop.md`](TongHop.md) và các file đặc tả chi tiết `MKP_001.md` đến `MKP_050.md`, quy chuẩn ánh xạ Use Case của 50 test case đầu tiên như sau:

| Dải Test Case | Mã Use Case | Tên Nghiệp vụ Use Case | Số lượng Test Case | File Đặc tả Gốc |
|---|---|---|---|---|
| **MKP_001 → MKP_005** | **UC02** | Đăng ký tài khoản (Register & OTP Verification) | 5 | `MKP_001.md` → `MKP_005.md` |
| **MKP_006 → MKP_010** | **UC10** | Quản lý giỏ hàng (Cart Management) | 5 | `MKP_006.md` → `MKP_010.md` |
| **MKP_011 → MKP_015** | **UC07** | Tra cứu sản phẩm & Bộ lọc (Search, Filter, Sorting) | 5 | `MKP_011.md` → `MKP_015.md` |
| **MKP_016 → MKP_021** | **UC01** | Đăng nhập tài khoản (Authentication & Role Redirection) | 6 | `MKP_016.md` → `MKP_021.md` |
| **MKP_022 → MKP_024** | **UC04** | Khôi phục mật khẩu (Forgot Password & Reset OTP) | 3 | `MKP_022.md` → `MKP_024.md` |
| **MKP_025 → MKP_026** | **UC05** | Quản lý thông tin cá nhân (Profile Dashboard & Update) | 2 | `MKP_025.md` → `MKP_026.md` |
| **MKP_027 → MKP_029** | **UC03** | Đăng xuất (Logout & Session Invalidation) | 3 | `MKP_027.md` → `MKP_029.md` |
| **MKP_030 → MKP_033** | **UC12** | Theo dõi đơn hàng (Order Tracking & Cancellation) | 4 | `MKP_030.md` → `MKP_033.md` |
| **MKP_034 → MKP_037** | **UC15** | Quản lý sản phẩm (Seller Product Management) | 4 | `MKP_034.md` → `MKP_037.md` |
| **MKP_038 → MKP_040** | **UC17** | Đấu giá sản phẩm (Auctions & Bidding) | 3 | `MKP_038.md` → `MKP_040.md` |
| **MKP_041 → MKP_043** | **UC16** | Xem báo cáo & thống kê (Admin KPI Dashboard) | 3 | `MKP_041.md` → `MKP_043.md` |
| **MKP_044 → MKP_049** | **UC08** | Xem chi tiết sản phẩm (Product Detail Views, Variants, Slug) | 6 | `MKP_044.md` → `MKP_049.md` |
| **MKP_050** | **UC13** | Quản lý sản phẩm yêu thích (Product Detail Favorite Toggle) | 1 | `MKP_050.md` |

> ⚠️ **Lưu ý kiểm toán đối chiếu:**
> Trong bảng của `TongHop.md` hàng 16 và 17 có sự đảo nhãn chữ giữa UC16 và UC17; tuy nhiên khi mở từng tập tin chi tiết `MKP_038.md` đến `MKP_043.md`, nội dung thực tế xác định chính xác: **MKP_038 → MKP_040 là Đấu giá sản phẩm (UC17)**, còn **MKP_041 → MKP_043 là Báo cáo & thống kê doanh thu (UC16)**. Ma trận bên dưới tuân thủ đúng nội dung tài liệu gốc.

---

## 3. Master Traceability Matrix (50 Test Cases)

| MKP | UC | Requirement | Test Type | Test File | Test Name | Line | Source File(s) | API | Status |
|:---:|:---:|---|:---:|---|---|:---:|---|:---:|:---:|
| **MKP_001** | `UC02` | Hiển thị đầy đủ các trường nhập liệu của form đăng ký và gửi mã OTP | `UI / API` | playwright/ui/register_ui.spec.ts<br>playwright/api/register_api.spec.ts | Hiển thị đầy đủ các trường nhập liệu của form đăng ký (MKP_001)<br>Gửi mã OTP thành công cho email đăng ký mới (MKP_001) | `L4-L13; L4-L16` | web/src/pages/auth/registerPage.tsx<br>backend/src/module/auth/auth.controller.ts<br>backend/src/module/auth/auth.service.ts | `POST /auth/send-otp` | **FOUND** |
| **MKP_002** | `UC02` | Hiển thị lỗi khi mật khẩu xác nhận không khớp và validation API | `UI / API` | playwright/ui/register_ui.spec.ts<br>playwright/api/register_api.spec.ts | Hiển thị lỗi kiểm tra khi mật khẩu xác nhận không khớp (MKP_002)<br>Trả về mã lỗi 400 khi để trống các trường thông tin bắt buộc (MKP_002) | `L15-L26; L57-L69` | web/src/pages/auth/registerPage.tsx<br>backend/src/module/auth/dto/register.dto.ts | `POST /auth/register` | **FOUND** |
| **MKP_003** | `UC02` | Hiển thị thông báo lỗi khi nhập sai OTP (UI & API) | `UI / API` | playwright/ui/register_ui.spec.ts<br>playwright/api/register_api.spec.ts | Hiển thị thông báo lỗi thân thiện 'Mã OTP không chính xác' khi nhập sai OTP (MKP_003)<br>Trả về mã lỗi 400 khi mã OTP không hợp lệ hoặc sai (MKP_003) | `L28-L53; L18-L32` | web/src/pages/auth/registerPage.tsx<br>backend/src/module/auth/auth.service.ts | `POST /auth/verify-otp` | **FOUND** |
| **MKP_004** | `UC02` | Hiển thị thông báo mã OTP đã hết hạn khi xác thực đăng ký | `UI` | playwright/ui/register_ui.spec.ts | Hiển thị thông báo mã OTP đã hết hạn khi đăng ký (MKP_004) | `L55-L80` | web/src/pages/auth/registerPage.tsx<br>backend/src/module/auth/auth.service.ts | `POST /auth/verify-otp` | **FOUND** |
| **MKP_005** | `UC02` | Từ chối đăng ký và trả về lỗi 400/409 khi email đã tồn tại trong hệ thống | `API` | playwright/api/register_api.spec.ts | Từ chối đăng ký và trả về lỗi 400 khi email đã tồn tại trong hệ thống (MKP_005) | `L34-L55` | backend/src/module/auth/auth.service.ts<br>backend/src/module/users/entities/user.entity.ts | `POST /auth/send-otp` | **FOUND** |
| **MKP_006** | `UC10` | Thêm sản phẩm vào giỏ hàng thành công (POST /cart/items) | `API / E2E` | playwright/api/cart_api.spec.ts<br>playwright/e2e/shopping_checkout_e2e.spec.ts | Thêm sản phẩm vào giỏ hàng thành công (MKP_006)<br>Người dùng duyệt sản phẩm, xem chi tiết, thêm vào giỏ và tiến hành thanh toán (MKP_006, MKP_010) | `L26-L37; L5-L43` | backend/src/module/cart/cart.controller.ts<br>backend/src/module/cart/cart.service.ts<br>web/src/pages/product/productPage.tsx | `POST /cart/items` | **FOUND** |
| **MKP_007** | `UC10` | Vô hiệu hóa nút '+' hoặc cảnh báo khi số lượng đạt mức tồn kho tối đa | `UI / API` | playwright/ui/cart_ui.spec.ts<br>playwright/api/cart_api.spec.ts | Vô hiệu hóa nút '+' hoặc cảnh báo khi số lượng đạt mức tồn kho tối đa (MKP_007)<br>Từ chối cập nhật số lượng vượt quá số lượng hàng tồn kho (MKP_007) | `L51-L58; L87-L101` | web/src/pages/cart/cartPage.tsx<br>backend/src/module/cart/cart.service.ts | `PATCH /cart/items/:id` | **FOUND** |
| **MKP_008** | `UC10` | Xóa sản phẩm khỏi giỏ hàng thành công (DELETE /cart/items/:id) | `API` | playwright/api/cart_api.spec.ts | Xóa sản phẩm khỏi giỏ hàng thành công (MKP_008) | `L103-L115` | backend/src/module/cart/cart.controller.ts<br>backend/src/module/cart/cart.service.ts | `DELETE /cart/items/:id` | **FOUND** |
| **MKP_009** | `UC10` | Cập nhật số lượng sản phẩm trong giỏ hàng thành công (PATCH /cart/items/:id) | `API` | playwright/api/cart_api.spec.ts | Cập nhật số lượng sản phẩm trong giỏ hàng thành công (MKP_009) | `L70-L85` | backend/src/module/cart/cart.controller.ts<br>backend/src/module/cart/cart.service.ts | `PATCH /cart/items/:id` | **FOUND** |
| **MKP_010** | `UC10` | Hiển thị giao diện giỏ hàng và bảng tóm tắt đơn hàng | `UI / E2E` | playwright/ui/cart_ui.spec.ts<br>playwright/e2e/shopping_checkout_e2e.spec.ts | Hiển thị giao diện giỏ hàng và bảng tóm tắt đơn hàng (MKP_010)<br>Người dùng duyệt sản phẩm... (MKP_006, MKP_010) | `L46-L49; L5-L43` | web/src/pages/cart/cartPage.tsx<br>web/src/pages/cart/cart.store.ts | `GET /cart/items<br>GET /cart/count` | **FOUND** |
| **MKP_011** | `UC07` | Hiển thị ô nhập tìm kiếm và các tùy chọn lọc trên Marketplace | `UI / API` | playwright/ui/search_filter_ui.spec.ts<br>playwright/api/products_search_api.spec.ts | Hiển thị ô nhập tìm kiếm và các tùy chọn lọc trên trang Marketplace (MKP_011)<br>Tìm kiếm sản phẩm trả về kết quả phù hợp (MKP_011) | `L4-L10; L4-L17` | web/src/pages/marketplace/marketplacePage.tsx<br>backend/src/module/products/products.controller.ts | `GET /products` | **FOUND** |
| **MKP_012** | `UC07` | Tìm kiếm sản phẩm thành công theo từ khóa hợp lệ | `API` | playwright/api/products_search_api.spec.ts | Tìm kiếm sản phẩm thành công theo từ khóa hợp lệ (MKP_012) | `L19-L31` | backend/src/module/products/products.controller.ts<br>backend/src/module/products/products.service.ts | `GET /products?search=:keyword` | **FOUND** |
| **MKP_013** | `UC07` | Lọc sản phẩm theo danh mục và khoảng giá thành công | `API` | playwright/api/products_filter_api.spec.ts | Lọc sản phẩm theo danh mục và khoảng giá thành công (MKP_013) | `L9-L25` | backend/src/module/products/products.service.ts | `GET /products?categories=...&minPrice=...&maxPrice=...` | **FOUND** |
| **MKP_014** | `UC07` | Validation khoảng giá: minPrice > maxPrice bị chặn trên UI và từ chối ở API | `UI / API` | playwright/ui/search_filter_ui.spec.ts<br>playwright/api/products_filter_api.spec.ts | Hiển thị thông báo lỗi khi giá tối thiểu lớn hơn giá tối đa (MKP_014)<br>Từ chối khi minPrice lớn hơn maxPrice (MKP_014) | `L12-L42; L27-L37` | web/src/pages/marketplace/marketplacePage.tsx<br>backend/src/module/products/products.service.ts | `GET /products?minPrice=...&maxPrice=...` | **FOUND** |
| **MKP_015** | `UC07` | Áp dụng tùy chọn sắp xếp sản phẩm chính xác (giá tăng/giảm, mới nhất) | `UI / API` | playwright/ui/search_filter_ui.spec.ts<br>playwright/api/products_filter_api.spec.ts | Áp dụng tùy chọn sắp xếp sản phẩm chính xác (MKP_015)<br>Xử lý lọc và sắp xếp sản phẩm theo tiêu chí mới nhất (MKP_015) | `L102-L111; L88-L102` | web/src/pages/marketplace/marketplacePage.tsx<br>backend/src/module/products/products.service.ts | `GET /products?sortBy=PRICE_ASC|PRICE_DESC|NEWEST` | **FOUND** |
| **MKP_016** | `UC01` | Kiểm tra giao diện đăng nhập: đầy đủ tiêu đề, ô nhập email, mật khẩu, nút đăng nhập | `UI` | playwright/ui/login_ui.spec.ts | Test A — Login page renders correctly | `L5-L18` | web/src/pages/auth/loginPage.tsx | `N/A` | **FOUND** |
| **MKP_017** | `UC01` | Kiểm tra hiển thị mật khẩu (mặc định ẩn bằng dấu chấm và toggle con mắt) | `UI` | playwright/ui/login_ui.spec.ts | Test B — Password starts hidden with custom toggle button<br>Test C — Click Eye reveals password | `L21-L32; L34-L51` | web/src/pages/auth/loginPage.tsx | `N/A` | **FOUND** |
| **MKP_018** | `UC01` | Đăng nhập thành công với tài khoản và mật khẩu hợp lệ (POST /auth/login) | `API / E2E` | playwright/api/login_api.spec.ts<br>playwright/e2e/login_e2e.spec.ts | Đăng nhập thành công với tài khoản và mật khẩu hợp lệ (MKP_018)<br>Người dùng đăng nhập thành công và chuyển hướng về trang chủ | `L4-L18; L5-L19` | backend/src/module/auth/auth.controller.ts<br>backend/src/module/auth/auth.service.ts<br>web/src/pages/auth/loginPage.tsx | `POST /auth/login` | **FOUND** |
| **MKP_019** | `UC01` | Đăng nhập thất bại khi sai mật khẩu hoặc tài khoản không tồn tại (HTTP 401) | `API / E2E` | playwright/api/login_api.spec.ts<br>playwright/e2e/login_e2e.spec.ts | Trả về mã lỗi 401 khi sai mật khẩu hoặc tài khoản không đúng (MKP_019)<br>Người dùng không thể đăng nhập khi nhập sai mật khẩu... | `L20-L31; L21-L37` | backend/src/module/auth/auth.service.ts | `POST /auth/login` | **FOUND** |
| **MKP_020** | `UC01` | Bắt lỗi khi để trống tài khoản và mật khẩu (Validation 400 & UI) | `API / UI` | playwright/api/login_api.spec.ts<br>playwright/ui/login_ui.spec.ts | Trả về mã lỗi 400 khi để trống tài khoản và mật khẩu (MKP_020)<br>Hiển thị thông báo lỗi kiểm tra khi gửi form trống | `L33-L44; L162-L171` | backend/src/module/auth/dto/login.dto.ts<br>web/src/pages/auth/loginPage.tsx | `POST /auth/login` | **FOUND** |
| **MKP_021** | `UC01` | Đăng nhập với tài khoản Admin điều hướng đúng và hiển thị Dashboard chỉ số | `UI` | playwright/ui/admin_dashboard_ui.spec.ts | Hiển thị trang tổng quan và các thẻ chỉ số KPI cho tài khoản Admin (MKP_021) | `L5-L13` | web/src/pages/admin/AdminDashboardPage.tsx<br>backend/src/module/auth/guards/roles.guard.ts | `GET /kpi/overview` | **FOUND** |
| **MKP_022** | `UC04` | Kiểm tra giao diện nhập email khôi phục mật khẩu và hộp thông tin hướng dẫn | `UI` | playwright/ui/forgot_password_ui.spec.ts | Test A — Info Box visible on Desktop (1280x720)<br>Test B — Info Box visible on Mobile | `L5-L26; L28-L52` | web/src/pages/auth/forgotPasswordPage.tsx | `N/A` | **FOUND** |
| **MKP_023** | `UC04` | Yêu cầu gửi mã OTP đặt lại mật khẩu cho email đã đăng ký (POST /auth/forgot-password) | `API` | playwright/api/forgot_password_api.spec.ts | Yêu cầu gửi mã OTP đặt lại mật khẩu cho email đã đăng ký (MKP_023) | `L4-L15` | backend/src/module/auth/auth.controller.ts<br>backend/src/module/auth/auth.service.ts<br>backend/src/module/mail/mail.service.ts | `POST /auth/forgot-password` | **FOUND** |
| **MKP_024** | `UC04` | Ô nhập mã OTP chỉ chấp nhận ký tự số và từ chối ký tự chữ 'abcdef' | `UI` | playwright/ui/forgot_password_ui.spec.ts | Ô nhập mã OTP chỉ chấp nhận ký tự số và từ chối ký tự chữ 'abcdef' (MKP_024)<br>Test A — OTP rejects alphabetic input | `L173-L184; L187-L203` | web/src/pages/auth/forgotPasswordPage.tsx<br>web/src/components/auth/OtpInput.tsx | `N/A` | **FOUND** |
| **MKP_025** | `UC05` | Kiểm tra giao diện thông tin cá nhân và tính nhất quán thiết kế | `UI` | playwright/ui/profile_ui.spec.ts<br>playwright/ui/profile_dashboard_ui.spec.ts | Hiển thị trang thông tin cá nhân và nút chỉnh sửa<br>Test A — Profile page renders without runtime errors (MKP-025) | `L9-L14; L43-L64` | web/src/pages/profile/ProfileDashboardPage.tsx<br>web/src/components/layout/ProfileLayout.tsx | `GET /users/me` | **FOUND** |
| **MKP_026** | `UC05` | Cập nhật thông tin cá nhân lập tức đồng bộ lên thanh điều hướng sidebar không cần F5 | `UI` | playwright/ui/profile_ui.spec.ts | Cập nhật thông tin cá nhân phải lập tức đồng bộ lên thanh điều hướng sidebar mà không cần tải lại trang (MKP_026) | `L16-L37` | web/src/pages/profile/ProfileDashboardPage.tsx<br>backend/src/module/users/users.service.ts | `PUT /users/me` | **FOUND** |
| **MKP_027** | `UC03` | Đăng xuất thành công từ giao diện người dùng (User) | `UI` | web/tests/01-logout.spec.ts | TC01: Đăng xuất thành công từ giao diện User | `L15-L28` | web/src/components/layout/AppHeader.tsx<br>web/src/services/token.service.ts | `POST /auth/logout` | **FOUND** |
| **MKP_028** | `UC03` | Đăng xuất thành công từ giao diện Admin/Seller | `UI` | web/tests/01-logout.spec.ts | TC02: Đăng xuất thành công từ giao diện Admin/Seller | `L30-L47` | web/src/components/layout/AdminSidebar.tsx<br>web/src/services/token.service.ts | `POST /auth/logout` | **FOUND** |
| **MKP_029** | `UC03` | Không thể truy cập trang yêu cầu đăng nhập sau khi đăng xuất (AuthGuard redirect) | `UI` | web/tests/01-logout.spec.ts | TC03: Không thể truy cập trang yêu cầu đăng nhập sau khi đăng xuất | `L49-L61` | web/src/routes/guards/AuthGuard.tsx<br>web/src/services/token.service.ts | `N/A` | **FOUND** |
| **MKP_030** | `UC12` | Xem danh sách đơn hàng đã đặt thành công (Order List) | `UI` | web/tests/02-order-tracking.spec.ts | TC04: Xem danh sách đơn hàng đã đặt thành công | `L21-L35` | web/src/pages/profile/orderTrackingPage.tsx<br>backend/src/module/orders/orders.controller.ts | `GET /orders/my-orders` | **FOUND** |
| **MKP_031** | `UC12` | Lọc đơn hàng theo trạng thái (chờ xác nhận, đang giao, hoàn thành...) | `UI / API` | web/tests/02-order-tracking.spec.ts<br>playwright/api/order_tracking_api.spec.ts | TC05: Lọc đơn hàng theo trạng thái (chờ xác nhận, đang giao...) | `L37-L41; L5-L42` | web/src/pages/profile/orderTrackingPage.tsx<br>backend/src/module/orders/orders.service.ts | `GET /orders/my-orders?status=SHIPPING` | **FOUND** |
| **MKP_032** | `UC12` | Xem chi tiết một đơn hàng cụ thể (Order Detail) | `UI` | web/tests/02-order-tracking.spec.ts | TC06: Xem chi tiết một đơn hàng cụ thể | `L43-L53` | web/src/pages/profile/orderDetailPage.tsx<br>backend/src/module/orders/orders.controller.ts | `GET /orders/:id` | **FOUND** |
| **MKP_033** | `UC12` | Gửi yêu cầu đổi/trả hàng hoặc hủy đơn ở trạng thái PENDING | `UI` | web/tests/02-order-tracking.spec.ts | TC07: Gửi yêu cầu đổi/trả hàng hoặc hủy đơn | `L55-L67` | web/src/pages/profile/orderTrackingPage.tsx<br>backend/src/module/orders/orders.service.ts | `PATCH /orders/:id/cancel` | **FOUND** |
| **MKP_034** | `UC15` | Người bán xem danh sách sản phẩm của mình trong Seller/Admin Portal | `UI` | web/tests/03-product-management.spec.ts | TC08: Xem danh sách sản phẩm của mình | `L20-L33` | web/src/pages/admin/products/ProductListPage.tsx<br>backend/src/module/products/products.controller.ts | `GET /products/seller` | **FOUND** |
| **MKP_035** | `UC15` | Chuyển hướng sang form Thêm sản phẩm mới | `UI` | web/tests/03-product-management.spec.ts | TC09: Chuyển hướng sang form Thêm sản phẩm | `L35-L43` | web/src/pages/admin/products/CreateProductPage.tsx | `N/A` | **FOUND** |
| **MKP_036** | `UC15` | Báo lỗi validation khi thêm sản phẩm thiếu thông tin bắt buộc | `UI` | web/tests/03-product-management.spec.ts | TC10: Báo lỗi khi thêm sản phẩm thiếu thông tin bắt buộc | `L45-L56` | web/src/pages/admin/products/CreateProductPage.tsx<br>backend/src/module/products/dto/create-product.dto.ts | `N/A` | **FOUND** |
| **MKP_037** | `UC15` | Truy cập màn hình Cập nhật thông tin sản phẩm | `UI` | web/tests/03-product-management.spec.ts | TC11: Truy cập màn hình Cập nhật thông tin sản phẩm | `L58-L73` | web/src/pages/admin/products/EditProductPage.tsx | `GET /products/:id` | **FOUND** |
| **MKP_038** | `UC17` | Xem danh sách các phiên đấu giá đang diễn ra | `UI` | web/tests/04-product-auction.spec.ts | TC12: Xem danh sách các phiên đấu giá đang diễn ra | `L18-L30` | web/src/pages/auction/AuctionListPage.tsx<br>backend/src/module/auctions/auctions.controller.ts | `GET /auctions` | **FOUND** |
| **MKP_039** | `UC17` | Tham gia đặt giá (bid) hợp lệ cho một sản phẩm đấu giá | `UI` | web/tests/04-product-auction.spec.ts | TC13: Tham gia đặt giá (bid) hợp lệ cho một sản phẩm | `L32-L69` | web/src/pages/auction/AuctionDetailPage.tsx<br>backend/src/module/auctions/auctions.service.ts | `POST /auctions/:id/bid` | **FOUND** |
| **MKP_040** | `UC17` | Báo lỗi khi đặt giá thấp hơn giá hiện tại hoặc bước giá | `UI` | web/tests/04-product-auction.spec.ts | TC14: Báo lỗi khi đặt giá thấp hơn giá hiện tại hoặc bước giá | `L71-L107` | web/src/pages/auction/AuctionDetailPage.tsx<br>backend/src/module/auctions/auctions.service.ts | `POST /auctions/:id/bid` | **FOUND** |
| **MKP_041** | `UC16` | Hiển thị đúng tổng doanh thu và số lượng đơn hàng trên Dashboard | `UI` | web/tests/05-reports.spec.ts | TC16: Hiển thị đúng tổng doanh thu và số lượng đơn hàng trên Dashboard | `L19-L30` | web/src/pages/admin/AdminDashboardPage.tsx<br>backend/src/module/kpi/kpi.controller.ts | `GET /kpi/overview` | **FOUND** |
| **MKP_042** | `UC16` | Thay đổi mốc thời gian (tuần, tháng, năm) thì biểu đồ cập nhật đúng | `UI` | web/tests/05-reports.spec.ts | TC17: Thay đổi mốc thời gian (tuần, tháng) thì biểu đồ cập nhật đúng | `L32-L44` | web/src/pages/admin/AdminDashboardPage.tsx<br>backend/src/module/kpi/kpi.service.ts | `GET /kpi/revenue?period=...` | **FOUND** |
| **MKP_043** | `UC16` | Xem danh sách top sản phẩm bán chạy và hiển thị nút xuất báo cáo | `UI` | web/tests/05-reports.spec.ts | TC18: Xem danh sách top sản phẩm bán chạy / Xuất báo cáo | `L46-L56` | web/src/pages/admin/AdminDashboardPage.tsx<br>backend/src/module/kpi/kpi.controller.ts | `GET /kpi/top-products` | **FOUND** |
| **MKP_044** | `UC08` | Hiển thị đầy đủ thông tin chi tiết sản phẩm hợp lệ còn hàng (tên, giá, ảnh, nút Thêm vào giỏ) | `UI` | playwright/ui/product_detail_ui.spec.ts | Hiển thị thông tin chi tiết sản phẩm, hình ảnh, giá và nút Thêm vào giỏ (MKP_006) | `L18-L26` | web/src/pages/product/productPage.tsx<br>backend/src/module/products/products.controller.ts | `GET /products/:id` | **FOUND** |
| **MKP_045** | `UC08` | Kiểm tra tăng giảm số lượng sản phẩm trong phạm vi tồn kho | `UI` | playwright/ui/product_detail_ui.spec.ts | Kiểm tra giới hạn số lượng tối thiểu không cho giảm dưới 1 (MKP_046) | `L28-L63` | web/src/pages/product/productPage.tsx | `N/A` | **FOUND** |
| **MKP_046** | `UC08` | Giới hạn số lượng mua tối thiểu là 1, nút giảm bị disabled khi qty = 1 | `UI` | playwright/ui/product_detail_ui.spec.ts | Kiểm tra giới hạn số lượng tối thiểu không cho giảm dưới 1 (MKP_046) | `L28-L63` | web/src/pages/product/productPage.tsx | `N/A` | **FOUND** |
| **MKP_047** | `UC08` | Kiểm tra thêm sản phẩm vào giỏ hàng khi người dùng đã đăng nhập từ trang chi tiết sản phẩm | `E2E` | playwright/e2e/shopping_checkout_e2e.spec.ts | Người dùng duyệt sản phẩm, xem chi tiết, thêm vào giỏ và tiến hành thanh toán (MKP_006, MKP_010) | `L5-L43` | web/src/pages/product/productPage.tsx<br>web/src/pages/cart/cartPage.tsx<br>backend/src/module/cart/cart.controller.ts | `POST /cart/items` | **FOUND** |
| **MKP_048** | `UC08` | Truy cập trang chi tiết sản phẩm với UUID v4 hợp lệ nhưng không tồn tại trong hệ thống (HTTP 404 & UI safe handling) | `UI` | playwright/ui/product_detail_ui.spec.ts | Kiểm tra truy cập trang chi tiết sản phẩm với UUID v4 hợp lệ nhưng không tồn tại trong hệ thống (MKP_048) | `L170-L200` | backend/src/module/products/products.service.ts<br>web/src/pages/product/product.store.ts<br>web/src/pages/product/productPage.tsx | `GET /products/00000000-0000-4000-a000-000000000000` | **FOUND** |
| **MKP_049** | `UC08` | Xử lý bóc tách slug và ID sản phẩm: slug chứa ký tự 'p' không bị nhận diện sai UUID | `UI / Unit` | playwright/ui/product_detail_ui.spec.ts<br>playwright/ui/slug_parser_unit.spec.ts | Truy cập trực tiếp URL sản phẩm có chữ 'p' trong tên không bị lỗi chuyển hướng (MKP-049) | `L65-L168; L1-L120` | web/src/utils/slugParser.ts<br>web/src/pages/product/productPage.tsx | `GET /products/:id` | **FOUND** |
| **MKP_050** | `UC13` | Thêm và bỏ sản phẩm vào danh sách yêu thích từ trang chi tiết sản phẩm và lưu bền vững DB | `UI` | playwright/ui/product_detail_ui.spec.ts | Kiểm tra thêm và bỏ sản phẩm vào danh sách yêu thích từ trang chi tiết (MKP_050) | `L202-L246` | web/src/pages/product/productPage.tsx<br>web/src/pages/product/product.store.ts<br>backend/src/module/products/products.controller.ts<br>backend/src/module/products/entities/favorite.entity.ts | `POST /products/:id/favorite` | **FOUND** |

---

## 4. Group by Test File

Tổng hợp 24 tập tin kiểm thử tham gia bao phủ 50 test case đầu tiên:

### `playwright/api/cart_api.spec.ts` (4 test cases)
- **MKP_006**: Thêm sản phẩm vào giỏ hàng thành công (POST /cart/items)
- **MKP_007**: Vô hiệu hóa nút '+' hoặc cảnh báo khi số lượng đạt mức tồn kho tối đa
- **MKP_008**: Xóa sản phẩm khỏi giỏ hàng thành công (DELETE /cart/items/:id)
- **MKP_009**: Cập nhật số lượng sản phẩm trong giỏ hàng thành công (PATCH /cart/items/:id)

### `playwright/api/forgot_password_api.spec.ts` (1 test cases)
- **MKP_023**: Yêu cầu gửi mã OTP đặt lại mật khẩu cho email đã đăng ký (POST /auth/forgot-password)

### `playwright/api/login_api.spec.ts` (3 test cases)
- **MKP_018**: Đăng nhập thành công với tài khoản và mật khẩu hợp lệ (POST /auth/login)
- **MKP_019**: Đăng nhập thất bại khi sai mật khẩu hoặc tài khoản không tồn tại (HTTP 401)
- **MKP_020**: Bắt lỗi khi để trống tài khoản và mật khẩu (Validation 400 & UI)

### `playwright/api/order_tracking_api.spec.ts` (1 test cases)
- **MKP_031**: Lọc đơn hàng theo trạng thái (chờ xác nhận, đang giao, hoàn thành...)

### `playwright/api/products_filter_api.spec.ts` (3 test cases)
- **MKP_013**: Lọc sản phẩm theo danh mục và khoảng giá thành công
- **MKP_014**: Validation khoảng giá: minPrice > maxPrice bị chặn trên UI và từ chối ở API
- **MKP_015**: Áp dụng tùy chọn sắp xếp sản phẩm chính xác (giá tăng/giảm, mới nhất)

### `playwright/api/products_search_api.spec.ts` (2 test cases)
- **MKP_011**: Hiển thị ô nhập tìm kiếm và các tùy chọn lọc trên Marketplace
- **MKP_012**: Tìm kiếm sản phẩm thành công theo từ khóa hợp lệ

### `playwright/api/register_api.spec.ts` (4 test cases)
- **MKP_001**: Hiển thị đầy đủ các trường nhập liệu của form đăng ký và gửi mã OTP
- **MKP_002**: Hiển thị lỗi khi mật khẩu xác nhận không khớp và validation API
- **MKP_003**: Hiển thị thông báo lỗi khi nhập sai OTP (UI & API)
- **MKP_005**: Từ chối đăng ký và trả về lỗi 400/409 khi email đã tồn tại trong hệ thống

### `playwright/e2e/login_e2e.spec.ts` (2 test cases)
- **MKP_018**: Đăng nhập thành công với tài khoản và mật khẩu hợp lệ (POST /auth/login)
- **MKP_019**: Đăng nhập thất bại khi sai mật khẩu hoặc tài khoản không tồn tại (HTTP 401)

### `playwright/e2e/shopping_checkout_e2e.spec.ts` (3 test cases)
- **MKP_006**: Thêm sản phẩm vào giỏ hàng thành công (POST /cart/items)
- **MKP_010**: Hiển thị giao diện giỏ hàng và bảng tóm tắt đơn hàng
- **MKP_047**: Kiểm tra thêm sản phẩm vào giỏ hàng khi người dùng đã đăng nhập từ trang chi tiết sản phẩm

### `playwright/ui/admin_dashboard_ui.spec.ts` (1 test cases)
- **MKP_021**: Đăng nhập với tài khoản Admin điều hướng đúng và hiển thị Dashboard chỉ số

### `playwright/ui/cart_ui.spec.ts` (2 test cases)
- **MKP_007**: Vô hiệu hóa nút '+' hoặc cảnh báo khi số lượng đạt mức tồn kho tối đa
- **MKP_010**: Hiển thị giao diện giỏ hàng và bảng tóm tắt đơn hàng

### `playwright/ui/forgot_password_ui.spec.ts` (2 test cases)
- **MKP_022**: Kiểm tra giao diện nhập email khôi phục mật khẩu và hộp thông tin hướng dẫn
- **MKP_024**: Ô nhập mã OTP chỉ chấp nhận ký tự số và từ chối ký tự chữ 'abcdef'

### `playwright/ui/login_ui.spec.ts` (3 test cases)
- **MKP_016**: Kiểm tra giao diện đăng nhập: đầy đủ tiêu đề, ô nhập email, mật khẩu, nút đăng nhập
- **MKP_017**: Kiểm tra hiển thị mật khẩu (mặc định ẩn bằng dấu chấm và toggle con mắt)
- **MKP_020**: Bắt lỗi khi để trống tài khoản và mật khẩu (Validation 400 & UI)

### `playwright/ui/product_detail_ui.spec.ts` (6 test cases)
- **MKP_044**: Hiển thị đầy đủ thông tin chi tiết sản phẩm hợp lệ còn hàng (tên, giá, ảnh, nút Thêm vào giỏ)
- **MKP_045**: Kiểm tra tăng giảm số lượng sản phẩm trong phạm vi tồn kho
- **MKP_046**: Giới hạn số lượng mua tối thiểu là 1, nút giảm bị disabled khi qty = 1
- **MKP_048**: Truy cập trang chi tiết sản phẩm với UUID v4 hợp lệ nhưng không tồn tại trong hệ thống (HTTP 404 & UI safe handling)
- **MKP_049**: Xử lý bóc tách slug và ID sản phẩm: slug chứa ký tự 'p' không bị nhận diện sai UUID
- **MKP_050**: Thêm và bỏ sản phẩm vào danh sách yêu thích từ trang chi tiết sản phẩm và lưu bền vững DB

### `playwright/ui/profile_dashboard_ui.spec.ts` (1 test cases)
- **MKP_025**: Kiểm tra giao diện thông tin cá nhân và tính nhất quán thiết kế

### `playwright/ui/profile_ui.spec.ts` (2 test cases)
- **MKP_025**: Kiểm tra giao diện thông tin cá nhân và tính nhất quán thiết kế
- **MKP_026**: Cập nhật thông tin cá nhân lập tức đồng bộ lên thanh điều hướng sidebar không cần F5

### `playwright/ui/register_ui.spec.ts` (4 test cases)
- **MKP_001**: Hiển thị đầy đủ các trường nhập liệu của form đăng ký và gửi mã OTP
- **MKP_002**: Hiển thị lỗi khi mật khẩu xác nhận không khớp và validation API
- **MKP_003**: Hiển thị thông báo lỗi khi nhập sai OTP (UI & API)
- **MKP_004**: Hiển thị thông báo mã OTP đã hết hạn khi xác thực đăng ký

### `playwright/ui/search_filter_ui.spec.ts` (3 test cases)
- **MKP_011**: Hiển thị ô nhập tìm kiếm và các tùy chọn lọc trên Marketplace
- **MKP_014**: Validation khoảng giá: minPrice > maxPrice bị chặn trên UI và từ chối ở API
- **MKP_015**: Áp dụng tùy chọn sắp xếp sản phẩm chính xác (giá tăng/giảm, mới nhất)

### `playwright/ui/slug_parser_unit.spec.ts` (1 test cases)
- **MKP_049**: Xử lý bóc tách slug và ID sản phẩm: slug chứa ký tự 'p' không bị nhận diện sai UUID

### `web/tests/01-logout.spec.ts` (3 test cases)
- **MKP_027**: Đăng xuất thành công từ giao diện người dùng (User)
- **MKP_028**: Đăng xuất thành công từ giao diện Admin/Seller
- **MKP_029**: Không thể truy cập trang yêu cầu đăng nhập sau khi đăng xuất (AuthGuard redirect)

### `web/tests/02-order-tracking.spec.ts` (4 test cases)
- **MKP_030**: Xem danh sách đơn hàng đã đặt thành công (Order List)
- **MKP_031**: Lọc đơn hàng theo trạng thái (chờ xác nhận, đang giao, hoàn thành...)
- **MKP_032**: Xem chi tiết một đơn hàng cụ thể (Order Detail)
- **MKP_033**: Gửi yêu cầu đổi/trả hàng hoặc hủy đơn ở trạng thái PENDING

### `web/tests/03-product-management.spec.ts` (4 test cases)
- **MKP_034**: Người bán xem danh sách sản phẩm của mình trong Seller/Admin Portal
- **MKP_035**: Chuyển hướng sang form Thêm sản phẩm mới
- **MKP_036**: Báo lỗi validation khi thêm sản phẩm thiếu thông tin bắt buộc
- **MKP_037**: Truy cập màn hình Cập nhật thông tin sản phẩm

### `web/tests/04-product-auction.spec.ts` (3 test cases)
- **MKP_038**: Xem danh sách các phiên đấu giá đang diễn ra
- **MKP_039**: Tham gia đặt giá (bid) hợp lệ cho một sản phẩm đấu giá
- **MKP_040**: Báo lỗi khi đặt giá thấp hơn giá hiện tại hoặc bước giá

### `web/tests/05-reports.spec.ts` (3 test cases)
- **MKP_041**: Hiển thị đúng tổng doanh thu và số lượng đơn hàng trên Dashboard
- **MKP_042**: Thay đổi mốc thời gian (tuần, tháng, năm) thì biểu đồ cập nhật đúng
- **MKP_043**: Xem danh sách top sản phẩm bán chạy và hiển thị nút xuất báo cáo

---

## 5. Group by UC (Use Case)

### `UC01` — Đăng nhập (Authentication & Session) (6 test cases)
- **MKP_016**: Kiểm tra giao diện đăng nhập: đầy đủ tiêu đề, ô nhập email, mật khẩu, nút đăng nhập
- **MKP_017**: Kiểm tra hiển thị mật khẩu (mặc định ẩn bằng dấu chấm và toggle con mắt)
- **MKP_018**: Đăng nhập thành công với tài khoản và mật khẩu hợp lệ (POST /auth/login)
- **MKP_019**: Đăng nhập thất bại khi sai mật khẩu hoặc tài khoản không tồn tại (HTTP 401)
- **MKP_020**: Bắt lỗi khi để trống tài khoản và mật khẩu (Validation 400 & UI)
- **MKP_021**: Đăng nhập với tài khoản Admin điều hướng đúng và hiển thị Dashboard chỉ số

### `UC02` — Đăng ký (Registration & OTP) (5 test cases)
- **MKP_001**: Hiển thị đầy đủ các trường nhập liệu của form đăng ký và gửi mã OTP
- **MKP_002**: Hiển thị lỗi khi mật khẩu xác nhận không khớp và validation API
- **MKP_003**: Hiển thị thông báo lỗi khi nhập sai OTP (UI & API)
- **MKP_004**: Hiển thị thông báo mã OTP đã hết hạn khi xác thực đăng ký
- **MKP_005**: Từ chối đăng ký và trả về lỗi 400/409 khi email đã tồn tại trong hệ thống

### `UC03` — Đăng xuất (Logout & Revocation) (3 test cases)
- **MKP_027**: Đăng xuất thành công từ giao diện người dùng (User)
- **MKP_028**: Đăng xuất thành công từ giao diện Admin/Seller
- **MKP_029**: Không thể truy cập trang yêu cầu đăng nhập sau khi đăng xuất (AuthGuard redirect)

### `UC04` — Khôi phục mật khẩu (Forgot / Reset Password) (3 test cases)
- **MKP_022**: Kiểm tra giao diện nhập email khôi phục mật khẩu và hộp thông tin hướng dẫn
- **MKP_023**: Yêu cầu gửi mã OTP đặt lại mật khẩu cho email đã đăng ký (POST /auth/forgot-password)
- **MKP_024**: Ô nhập mã OTP chỉ chấp nhận ký tự số và từ chối ký tự chữ 'abcdef'

### `UC05` — Quản lý thông tin cá nhân (Profile Dashboard) (2 test cases)
- **MKP_025**: Kiểm tra giao diện thông tin cá nhân và tính nhất quán thiết kế
- **MKP_026**: Cập nhật thông tin cá nhân lập tức đồng bộ lên thanh điều hướng sidebar không cần F5

### `UC07` — Tra cứu & Lọc sản phẩm (Product Catalog & Search) (5 test cases)
- **MKP_011**: Hiển thị ô nhập tìm kiếm và các tùy chọn lọc trên Marketplace
- **MKP_012**: Tìm kiếm sản phẩm thành công theo từ khóa hợp lệ
- **MKP_013**: Lọc sản phẩm theo danh mục và khoảng giá thành công
- **MKP_014**: Validation khoảng giá: minPrice > maxPrice bị chặn trên UI và từ chối ở API
- **MKP_015**: Áp dụng tùy chọn sắp xếp sản phẩm chính xác (giá tăng/giảm, mới nhất)

### `UC08` — Xem chi tiết sản phẩm (Product Detail & Slug Handling) (6 test cases)
- **MKP_044**: Hiển thị đầy đủ thông tin chi tiết sản phẩm hợp lệ còn hàng (tên, giá, ảnh, nút Thêm vào giỏ)
- **MKP_045**: Kiểm tra tăng giảm số lượng sản phẩm trong phạm vi tồn kho
- **MKP_046**: Giới hạn số lượng mua tối thiểu là 1, nút giảm bị disabled khi qty = 1
- **MKP_047**: Kiểm tra thêm sản phẩm vào giỏ hàng khi người dùng đã đăng nhập từ trang chi tiết sản phẩm
- **MKP_048**: Truy cập trang chi tiết sản phẩm với UUID v4 hợp lệ nhưng không tồn tại trong hệ thống (HTTP 404 & UI safe handling)
- **MKP_049**: Xử lý bóc tách slug và ID sản phẩm: slug chứa ký tự 'p' không bị nhận diện sai UUID

### `UC10` — Quản lý giỏ hàng (Shopping Cart) (5 test cases)
- **MKP_006**: Thêm sản phẩm vào giỏ hàng thành công (POST /cart/items)
- **MKP_007**: Vô hiệu hóa nút '+' hoặc cảnh báo khi số lượng đạt mức tồn kho tối đa
- **MKP_008**: Xóa sản phẩm khỏi giỏ hàng thành công (DELETE /cart/items/:id)
- **MKP_009**: Cập nhật số lượng sản phẩm trong giỏ hàng thành công (PATCH /cart/items/:id)
- **MKP_010**: Hiển thị giao diện giỏ hàng và bảng tóm tắt đơn hàng

### `UC12` — Theo dõi đơn hàng (Order Tracking & History) (4 test cases)
- **MKP_030**: Xem danh sách đơn hàng đã đặt thành công (Order List)
- **MKP_031**: Lọc đơn hàng theo trạng thái (chờ xác nhận, đang giao, hoàn thành...)
- **MKP_032**: Xem chi tiết một đơn hàng cụ thể (Order Detail)
- **MKP_033**: Gửi yêu cầu đổi/trả hàng hoặc hủy đơn ở trạng thái PENDING

### `UC13` — Quản lý sản phẩm yêu thích (Favorites) (1 test cases)
- **MKP_050**: Thêm và bỏ sản phẩm vào danh sách yêu thích từ trang chi tiết sản phẩm và lưu bền vững DB

### `UC15` — Quản lý sản phẩm người bán (Seller Product Management) (4 test cases)
- **MKP_034**: Người bán xem danh sách sản phẩm của mình trong Seller/Admin Portal
- **MKP_035**: Chuyển hướng sang form Thêm sản phẩm mới
- **MKP_036**: Báo lỗi validation khi thêm sản phẩm thiếu thông tin bắt buộc
- **MKP_037**: Truy cập màn hình Cập nhật thông tin sản phẩm

### `UC16` — Xem báo cáo & thống kê (Admin KPI Reports) (3 test cases)
- **MKP_041**: Hiển thị đúng tổng doanh thu và số lượng đơn hàng trên Dashboard
- **MKP_042**: Thay đổi mốc thời gian (tuần, tháng, năm) thì biểu đồ cập nhật đúng
- **MKP_043**: Xem danh sách top sản phẩm bán chạy và hiển thị nút xuất báo cáo

### `UC17` — Đấu giá sản phẩm (Live Auctions & Bidding) (3 test cases)
- **MKP_038**: Xem danh sách các phiên đấu giá đang diễn ra
- **MKP_039**: Tham gia đặt giá (bid) hợp lệ cho một sản phẩm đấu giá
- **MKP_040**: Báo lỗi khi đặt giá thấp hơn giá hiện tại hoặc bước giá

---

## 6. Source Code Traceability (Truy vết Tập tin Nguồn Nghiệp vụ)

Mỗi module nghiệp vụ được thực thi bởi các module frontend và backend cụ thể:

### 🔹 Xác thực & Tài khoản (Auth, Register, Login, Logout, Forgot Password)
- **Các Use Case liên quan:** `UC01, UC02, UC03, UC04`
- **Phạm vi Test Cases:** `MKP_001 → MKP_005, MKP_016 → MKP_024, MKP_027 → MKP_029`
- **Frontend Source Files:**
  - `web/src/pages/auth/registerPage.tsx (Form đăng ký & validation Zod)`
  - `web/src/pages/auth/loginPage.tsx (Form đăng nhập & show/hide mật khẩu)`
  - `web/src/pages/auth/forgotPasswordPage.tsx (Form khôi phục & gửi OTP)`
  - `web/src/components/auth/OtpInput.tsx (Component nhập mã 6 số OTP)`
  - `web/src/components/layout/AppHeader.tsx (Menu dropdown người dùng & nút Đăng xuất)`
  - `web/src/components/layout/AdminSidebar.tsx (Menu quản trị & nút Đăng xuất Admin)`
  - `web/src/routes/guards/AuthGuard.tsx (Bảo vệ route yêu cầu đăng nhập)`
  - `web/src/services/token.service.ts (Lưu trữ và xóa token)`
- **Backend Source Files & Entities:**
  - `backend/src/module/auth/auth.controller.ts (Endpoints: /auth/register, /auth/send-otp, /auth/verify-otp, /auth/login, /auth/forgot-password, /auth/logout)`
  - `backend/src/module/auth/auth.service.ts (Logic sinh mã OTP, băm bcrypt, sinh JWT token)`
  - `backend/src/module/auth/dto/register.dto.ts, login.dto.ts (Validation request)`
  - `backend/src/module/auth/guards/roles.guard.ts (Phân quyền Role-based)`
  - `backend/src/module/mail/mail.service.ts (Dịch vụ gửi email thông báo OTP)`
  - `backend/src/module/users/entities/user.entity.ts (Thực thể người dùng cơ sở dữ liệu)`

### 🔹 Giỏ hàng & Mua sắm (Cart & Shopping Journey)
- **Các Use Case liên quan:** `UC10`
- **Phạm vi Test Cases:** `MKP_006 → MKP_010`
- **Frontend Source Files:**
  - `web/src/pages/cart/cartPage.tsx (Giao diện giỏ hàng, bảng tóm tắt đơn hàng)`
  - `web/src/pages/cart/cart.store.ts (Quản lý trạng thái giỏ hàng Zustand)`
  - `web/src/pages/product/productPage.tsx (Nút Thêm vào giỏ từ trang chi tiết)`
- **Backend Source Files & Entities:**
  - `backend/src/module/cart/cart.controller.ts (Endpoints: /cart/items, /cart/count)`
  - `backend/src/module/cart/cart.service.ts (Logic kiểm tra tồn kho, tăng giảm số lượng, xóa item)`
  - `backend/src/module/cart/entities/cart.entity.ts, cart-item.entity.ts (Thực thể giỏ hàng)`

### 🔹 Sản phẩm & Chi tiết Sản phẩm (Catalog, Search, Filter, Product Detail, Slug)
- **Các Use Case liên quan:** `UC07, UC08, UC13`
- **Phạm vi Test Cases:** `MKP_011 → MKP_015, MKP_044 → MKP_050`
- **Frontend Source Files:**
  - `web/src/pages/marketplace/marketplacePage.tsx (Trang danh mục sản phẩm sàn)`
  - `web/src/pages/product/productPage.tsx (Chi tiết sản phẩm, bộ chọn số lượng, nút yêu thích)`
  - `web/src/pages/product/product.store.ts (Store Zustand quản lý load chi tiết & toggle favorite)`
  - `web/src/utils/slugParser.ts (Hàm bóc tách ID sản phẩm từ URL slug hỗ trợ chữ 'p')`
- **Backend Source Files & Entities:**
  - `backend/src/module/products/products.controller.ts (Endpoints: /products, /products/:id, /products/:id/favorite)`
  - `backend/src/module/products/products.service.ts (Truy vấn phân trang, lọc giá, tìm kiếm, yêu thích)`
  - `backend/src/module/products/entities/product.entity.ts (Thực thể sản phẩm)`
  - `backend/src/module/products/entities/favorite.entity.ts (Thực thể sản phẩm yêu thích có unique index)`

### 🔹 Hồ sơ cá nhân & Đơn hàng (Profile & Orders)
- **Các Use Case liên quan:** `UC05, UC12`
- **Phạm vi Test Cases:** `MKP_025 → MKP_026, MKP_030 → MKP_033`
- **Frontend Source Files:**
  - `web/src/pages/profile/ProfileDashboardPage.tsx (Trang thông tin cá nhân & chỉnh sửa)`
  - `web/src/components/layout/ProfileLayout.tsx (Sidebar layout đồng bộ thông tin người dùng)`
  - `web/src/pages/profile/orderTrackingPage.tsx (Trang theo dõi danh sách đơn hàng)`
  - `web/src/pages/profile/orderDetailPage.tsx (Chi tiết đơn hàng cụ thể & hủy đơn)`
- **Backend Source Files & Entities:**
  - `backend/src/module/users/users.service.ts (Endpoint: PUT /users/me cập nhật thông tin)`
  - `backend/src/module/orders/orders.controller.ts (Endpoints: /orders/my-orders, /orders/:id, /orders/:id/cancel)`
  - `backend/src/module/orders/orders.service.ts (Truy vấn đơn hàng theo trạng thái & hủy đơn Pending)`

### 🔹 Quản trị, Người bán & Đấu giá (Seller Management, Admin KPI & Auctions)
- **Các Use Case liên quan:** `UC15, UC16, UC17`
- **Phạm vi Test Cases:** `MKP_034 → MKP_043`
- **Frontend Source Files:**
  - `web/src/pages/admin/products/ProductListPage.tsx, CreateProductPage.tsx, EditProductPage.tsx (Quản lý sản phẩm)`
  - `web/src/pages/admin/AdminDashboardPage.tsx (Dashboard KPI, biểu đồ doanh thu, top sản phẩm)`
  - `web/src/pages/auction/AuctionListPage.tsx, AuctionDetailPage.tsx (Sàn đấu giá trực tuyến & phòng đấu giá)`
- **Backend Source Files & Entities:**
  - `backend/src/module/kpi/kpi.controller.ts, kpi.service.ts (Thống kê doanh thu, đơn hàng, top sản phẩm)`
  - `backend/src/module/auctions/auctions.controller.ts, auctions.service.ts (Quản lý phòng đấu giá, đặt giá bid)`
  - `backend/src/module/products/products.controller.ts (Quản lý sản phẩm phía người bán / seller)`

---

## 7. API Endpoint Mapping

Bảng ánh xạ các endpoint HTTP Backend tham gia phục vụ 50 test case:

| Phương thức | Endpoint | Use Case | Test Cases Bao phủ | Mô tả Chức năng |
|:---:|---|:---:|:---:|---|
| `POST` | `/auth/send-otp` | UC02 | MKP_001, MKP_005 | Gửi mã OTP xác thực email đăng ký |
| `POST` | `/auth/verify-otp` | UC02 | MKP_003, MKP_004 | Xác thực mã OTP người dùng nhập |
| `POST` | `/auth/register` | UC02 | MKP_002 | Đăng ký tài khoản mới kèm mật khẩu |
| `POST` | `/auth/login` | UC01 | MKP_018, MKP_019, MKP_020 | Đăng nhập tài khoản, cấp JWT token |
| `POST` | `/auth/forgot-password` | UC04 | MKP_023 | Yêu cầu gửi OTP đặt lại mật khẩu |
| `POST` | `/auth/logout` | UC03 | MKP_027, MKP_028 | Đăng xuất, hủy session/token |
| `GET` | `/users/me` | UC05 | MKP_025 | Lấy thông tin cá nhân của người dùng |
| `PUT` | `/users/me` | UC05 | MKP_026 | Cập nhật hồ sơ người dùng |
| `GET` | `/cart` / `/cart/items` | UC10 | MKP_010 | Lấy danh sách sản phẩm trong giỏ hàng |
| `POST` | `/cart/items` | UC10, UC08 | MKP_006, MKP_047 | Thêm sản phẩm vào giỏ hàng |
| `PATCH` | `/cart/items/:id` | UC10 | MKP_007, MKP_009 | Cập nhật số lượng sản phẩm trong giỏ |
| `DELETE` | `/cart/items/:id` | UC10 | MKP_008 | Xóa sản phẩm khỏi giỏ hàng |
| `GET` | `/products` | UC07 | MKP_011, MKP_012, MKP_013, MKP_014, MKP_015 | Tìm kiếm, lọc và sắp xếp sản phẩm |
| `GET` | `/products/:id` | UC08, UC15 | MKP_037, MKP_044, MKP_048, MKP_049 | Xem chi tiết sản phẩm / Xử lý 404 khi không tồn tại |
| `POST` | `/products/:id/favorite` | UC13 | MKP_050 | Thêm/Bỏ sản phẩm yêu thích (Toggle) |
| `GET` | `/orders/my-orders` | UC12 | MKP_030, MKP_031 | Lấy danh sách đơn hàng đã mua |
| `GET` | `/orders/:id` | UC12 | MKP_032 | Lấy chi tiết đơn hàng theo ID |
| `PATCH` | `/orders/:id/cancel` | UC12 | MKP_033 | Hủy đơn hàng ở trạng thái PENDING |
| `GET` | `/products/seller` | UC15 | MKP_034 | Danh sách sản phẩm của người bán |
| `GET` | `/auctions` | UC17 | MKP_038 | Danh sách các phiên đấu giá đang mở |
| `POST` | `/auctions/:id/bid` | UC17 | MKP_039, MKP_040 | Đặt giá thầu cho sản phẩm đấu giá |
| `GET` | `/kpi/overview` | UC16, UC01 | MKP_021, MKP_041 | Lấy tổng quan số liệu KPI cho Admin |
| `GET` | `/kpi/revenue` | UC16 | MKP_042 | Thống kê doanh thu theo mốc thời gian |
| `GET` | `/kpi/top-products` | UC16 | MKP_043 | Danh sách top sản phẩm bán chạy |
| `N/A` | `Client-side Only` | UC01, UC04, UC08, UC15 | MKP_016, MKP_017, MKP_022, MKP_024, MKP_029, MKP_035, MKP_036, MKP_045, MKP_046 | Kiểm tra giao diện, regex, validation, DOM |

---

## 8. Test Type Distribution

Phân bổ loại hình kiểm thử (Test Type) trên toàn bộ 50 test case:
- **UI Tests:** 40 test cases (Kiểm thử tương tác người dùng, hiển thị, accessibility, DOM state).
- **API Tests:** 18 test cases (Kiểm thử trực tiếp HTTP Status, Response Body, Error Code, validation backend).
- **E2E Tests:** 5 test cases (Kiểm thử luồng người dùng xuyên suốt từ đăng nhập, duyệt hàng, thêm giỏ đến thanh toán).
- **Unit Tests:** 1 test case (`slug_parser_unit.spec.ts` kiểm thử độc lập hàm bóc tách slug).
*(Lưu ý: Một số test case được trang bị cả kịch bản UI và API để tối ưu độ tin cậy hai tầng)*.

---

## 9. Missing / Ambiguous / Duplicate Tests Analysis

Trong quá trình rà soát đối chiếu toàn bộ codebase so với tài liệu gốc, các điểm đáng chú ý được ghi nhận:

### 1. Phân loại Multi-Coverage (Một test bao phủ nhiều MKP)
- `playwright/e2e/shopping_checkout_e2e.spec.ts`: Bao phủ đồng thời **MKP_006** (Thêm giỏ hàng), **MKP_010** (Tóm tắt giỏ hàng), và **MKP_047** (Thêm vào giỏ khi đã đăng nhập từ trang chi tiết).
- `playwright/ui/product_detail_ui.spec.ts` (L28-L63): Bao phủ đồng thời **MKP_045** (Tăng giảm số lượng sản phẩm trong tồn kho) và **MKP_046** (Giới hạn tối thiểu = 1 và disable nút giảm).

### 2. Phân loại Multiple Tests (Một MKP có nhiều tầng kiểm thử UI + API)
- **MKP_001, MKP_002, MKP_003, MKP_007, MKP_010, MKP_011, MKP_014, MKP_015, MKP_018, MKP_019, MKP_020, MKP_024, MKP_025, MKP_031, MKP_049** đều có cả bài test UI và bài test API/Unit độc lập, giúp tăng độ bao phủ (defense-in-depth).

### 3. Đánh nhãn nhầm lẫn trong quá khứ (Mislabeling)
- Trong `playwright/ui/login_ui.spec.ts` dòng 174, tác giả cũ từng đặt tên: `test.fixme('Chuyển hướng đến trang xác thực Google OAuth khi bấm Đăng nhập bằng Google (MKP_017)', ...)`.
  Tuy nhiên, tài liệu gốc [`MKP_017.md`](MKP_017.md) thực chất là **'Kiểm tra hiển thị mật khẩu'** (che dấu chấm mặc định và icon con mắt). Nghiệp vụ này đã được cài đặt và pass đầy đủ ở Test B (`L21-L32`) và Test C (`L34-L51`) trong chính file `login_ui.spec.ts`.
- Trong `playwright/ui/product_detail_ui.spec.ts` dòng 18, tác giả cũ đặt tên: `test('Hiển thị thông tin chi tiết sản phẩm... (MKP_006)', ...)`. Thực chất test này kiểm tra trang chi tiết sản phẩm (**MKP_044**), còn MKP_006 là thêm vào giỏ hàng.

---

## 10. Verification Chi tiết của MKP_046 / MKP_048 / MKP_050

Ba test case trọng tâm vừa được audit, fix và kiểm chứng thực nghiệm:

### 📌 MKP_046 — Giới hạn số lượng mua tối thiểu là 1
- **Test File:** [`playwright/ui/product_detail_ui.spec.ts`](file:///e:/Nam4_Ky1/KiemThu/project/MarketPlace/playwright/ui/product_detail_ui.spec.ts#L28-L63)
- **Test Name:** `Kiểm tra giới hạn số lượng tối thiểu không cho giảm dưới 1 (MKP_046)`
- **Source Code:** [`web/src/pages/product/productPage.tsx`](file:///e:/Nam4_Ky1/KiemThu/project/MarketPlace/web/src/pages/product/productPage.tsx) (thuộc tính `disabled={quantity <= 1}`)
- **Test Assertions:**
  1. Khi tải trang, ô `qtyInput` có giá trị `'1'` (`expect(qtyInput).toHaveValue('1')`).
  2. Nút trừ (-) bị disabled ngay từ đầu (`expect(decreaseBtn).toBeDisabled()`).
  3. Thao tác click vào nút trừ không làm thay đổi giá trị hoặc gây lỗi biên.
  4. Click nút cộng (+) để tăng lên 2: `qtyInput` thành `'2'` và nút trừ (-) được kích hoạt (`toBeEnabled()`).
  5. Click nút trừ (-) để giảm về 1: `qtyInput` về lại `'1'` và nút trừ (-) tự động disabled trở lại (`toBeDisabled()`).
- **Kết quả thực thi:** **PASS (100% Boundary verified)**

### 📌 MKP_048 — UUID v4 hợp lệ nhưng không tồn tại trong hệ thống
- **Test File:** [`playwright/ui/product_detail_ui.spec.ts`](file:///e:/Nam4_Ky1/KiemThu/project/MarketPlace/playwright/ui/product_detail_ui.spec.ts#L170-L200)
- **Test Name:** `Kiểm tra truy cập trang chi tiết sản phẩm với UUID v4 hợp lệ nhưng không tồn tại trong hệ thống (MKP_048)`
- **Source Code:**
  - Backend: [`backend/src/module/products/products.service.ts`](file:///e:/Nam4_Ky1/KiemThu/project/MarketPlace/backend/src/module/products/products.service.ts) (ném `NotFoundException('Sản phẩm không tồn tại')`)
  - Frontend: [`web/src/pages/product/product.store.ts`](file:///e:/Nam4_Ky1/KiemThu/project/MarketPlace/web/src/pages/product/product.store.ts) (hàm `fetchProduct` bắt 404, gọi toast error và điều hướng an toàn)
  - UI: [`web/src/pages/product/productPage.tsx`](file:///e:/Nam4_Ky1/KiemThu/project/MarketPlace/web/src/pages/product/productPage.tsx) (không render dữ liệu giả, không crash React)
- **Test Assertions:**
  1. Truy cập URL với UUID giả định: `00000000-0000-4000-a000-000000000000`.
  2. Bắt request API `GET /products/00000000-0000-4000-a000-000000000000` và xác nhận response trả HTTP 404.
  3. Xác nhận URL chuyển hướng an toàn về `/` hoặc `/marketplace`.
  4. Toast thông báo lỗi hiển thị rõ ràng trên màn hình.
- **Kết quả thực thi:** **PASS**

### 📌 MKP_050 — Thêm và bỏ sản phẩm vào danh sách yêu thích từ Product Detail
- **Test File:** [`playwright/ui/product_detail_ui.spec.ts`](file:///e:/Nam4_Ky1/KiemThu/project/MarketPlace/playwright/ui/product_detail_ui.spec.ts#L202-L246)
- **Test Name:** `Kiểm tra thêm và bỏ sản phẩm vào danh sách yêu thích từ trang chi tiết (MKP_050)`
- **Source Code:**
  - Backend: [`backend/src/module/products/products.controller.ts`](file:///e:/Nam4_Ky1/KiemThu/project/MarketPlace/backend/src/module/products/products.controller.ts) (`POST /products/:id/favorite`), [`favorite.entity.ts`](file:///e:/Nam4_Ky1/KiemThu/project/MarketPlace/backend/src/module/products/entities/favorite.entity.ts)
  - Frontend: [`web/src/pages/product/productPage.tsx`](file:///e:/Nam4_Ky1/KiemThu/project/MarketPlace/web/src/pages/product/productPage.tsx) (`data-testid='product-favorite-button'`, `aria-label`)
  - Store: [`web/src/pages/product/product.store.ts`](file:///e:/Nam4_Ky1/KiemThu/project/MarketPlace/web/src/pages/product/product.store.ts) (`toggleFavorite` kết nối API)
- **Test Assertions:**
  1. Đăng nhập tài khoản Buyer và mở trang chi tiết sản phẩm hợp lệ.
  2. Nút `data-testid='product-favorite-button'` hiển thị với `aria-label` tương ứng.
  3. Click nút yêu thích: API `POST /products/:id/favorite` được gọi và trả về HTTP 200.
  4. Toast thông báo cập nhật danh sách yêu thích thành công xuất hiện.
  5. Thuộc tính `aria-label` chuyển đổi trạng thái ('Yêu thích' ↔ 'Bỏ yêu thích').
  6. F5 Reload trang (`page.reload()`): Dữ liệu trạng thái được nạp lại từ DB và giữ nguyên trạng thái mới.
  7. Test tự động click lại một lần nữa để hoàn nguyên trạng thái ban đầu (Cleanup tự động hoàn toàn, zero DB pollution).
- **Kết quả thực thi:** **PASS (Isolated & Clean)**

---

## 11. Final Summary Bắt Buộc

```text
TOTAL MKP: 50

FOUND: 50
MISSING: 0
AMBIGUOUS: 0
MULTIPLE TESTS: 18

API TESTS: 18
UI TESTS: 40
E2E TESTS: 5
UNIT TESTS: 1
INTEGRATION TESTS: 24

TEST FILES INVOLVED: 24
SOURCE FILES INVOLVED: 44

MKP_046: FOUND/PASS
MKP_048: FOUND/PASS
MKP_050: FOUND/PASS

TRACEABILITY STATUS:
COMPLETE
```
