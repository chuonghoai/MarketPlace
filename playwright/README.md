# Hệ Thống Kiểm Thử Tự Động Playwright — MarketPlace

Thư mục này chứa toàn bộ các kịch bản kiểm thử tự động (Automated Testing) cho dự án MarketPlace sử dụng [Playwright Test](https://playwright.dev/).

---

## 1. Tổng Quan & Cấu Trúc Hệ Thống

Hệ thống kiểm thử hiện bao gồm **184 test cases** được chia thành 4 dự án (projects) độc lập:

| Nhóm Kiểm Thử | Thư Mục / File | Số Lượng Tests | Mô Tả |
| :--- | :--- | :--- | :--- |
| **Unit** | `playwright/ui/*unit.spec.ts` | 12 tests | Kiểm thử độc lập logic thuần túy (slug parser, utils) không phụ thuộc trình duyệt |
| **API** | `playwright/api/` | 68 tests | Kiểm thử tích hợp trực tiếp các REST endpoints backend (Auth, Products, Cart, Orders, Wallets...) |
| **UI** | `playwright/ui/` | 100 tests | Kiểm thử giao diện, tương tác form, validate đầu vào, giỏ hàng, thông báo... |
| **E2E** | `playwright/e2e/` | 4 tests | Kiểm thử hành trình luồng người dùng hoàn chỉnh từ Login đến Mua hàng & Thanh toán |

### Cấu Trúc Thư Mục

```text
playwright/
├── api/                   # Kịch bản kiểm thử API (*_api.spec.ts)
├── ui/                    # Kịch bản kiểm thử UI (*_ui.spec.ts & *unit.spec.ts)
├── e2e/                   # Kịch bản kiểm thử hành trình E2E (*_e2e.spec.ts)
├── helpers/               # Tiện ích bổ trợ (Auth helper, test data generator...)
├── playwright-report/     # Báo cáo kết quả kiểm thử HTML (được .gitignore quản lý)
├── test-results/          # Artifacts, screenshots, traces khi chạy test (được .gitignore quản lý)
└── README.md              # Tài liệu hướng dẫn này
```

---

## 2. Cơ Chế Khởi Chạy Dịch Vụ Tự Động (`webServer`)

Playwright đã được cấu hình tính năng `webServer` trong `playwright.config.ts`, tự động điều phối chu trình sống của hệ thống:

- **Tự động khởi động Backend NestJS**: Chạy lệnh `npm run backend:dev` và chờ cổng `http://127.0.0.1:3000/categories` phản hồi 200 OK (sẵn sàng kết nối cơ sở dữ liệu).
- **Tự động khởi động Frontend Vite React**: Chạy lệnh `npm run web:dev` và chờ cổng `http://localhost:5173` sẵn sàng.
- **Tự động dọn dẹp (Teardown)**: Sau khi toàn bộ các kịch bản test kết thúc, các tiến trình backend và frontend tự động tắt sạch sẽ.
- **Tái sử dụng server cục bộ**: Khi đang dev hoặc đã mở sẵn server ở máy cá nhân (`reuseExistingServer: !isCI`), Playwright sẽ tái sử dụng ngay lập tức mà không khởi động lại.

> [!NOTE]
> Bạn **không cần** phải mở thủ công các terminal chạy backend và frontend trước khi chạy test. Chỉ cần gọi lệnh test, Playwright sẽ tự động đảm bảo môi trường sẵn sàng.

---

## 3. Chế Độ Hiển Thị Trình Duyệt (Headless vs Headed)

- **Cục bộ (Local Development)**: Mặc định mở cửa sổ trình duyệt (`headless: false`) để lập trình viên và tester dễ dàng theo dõi trực quan các thao tác của bot.
- **Môi trường CI/CD (GitHub Actions)**: Tự động chạy chế độ ngầm (`headless: true`) thông qua cờ `isCI = !!process.env.CI`.
- **Ép chạy Headless cục bộ**: Bạn có thể kích hoạt headless bằng cách đặt biến môi trường:
  ```bash
  $env:HEADLESS="true"; npm run test:all   # PowerShell trên Windows
  HEADLESS=true npm run test:all           # Linux / macOS / Bash
  ```

---

## 4. Danh Mục Lệnh Thực Thi (NPM Scripts)

Bạn có thể chạy kiểm thử từ thư mục gốc của dự án:

### 4.1. Chạy theo từng nhóm kiểm thử
```bash
# 1. Chạy toàn bộ 184 test cases
npm run test:all

# 2. Chạy nhóm Unit tests (12 tests)
npm run test:unit

# 3. Chạy nhóm API tests (68 tests)
npm run test:api

# 4. Chạy nhóm UI tests (100 tests)
npm run test:ui

# 5. Chạy nhóm End-to-End tests (4 tests)
npm run test:e2e
```

### 4.2. Chạy một file kiểm thử hoặc test case cụ thể
```bash
# Chạy một file test cụ thể
npm run test -- playwright/api/login_api.spec.ts

# Chạy test theo tên cụ thể (-g pattern)
npx playwright test -g "Người dùng đăng nhập thành công"
```

### 4.3. Xem Báo Cáo Kiểm Thử (HTML Report)
```bash
npm run test:report
# hoặc:
npx playwright show-report playwright-report
```

---

## 5. Trạng Thái Các Test Cases Từng Bị Đánh Dấu Expected-Fail

Trong báo cáo kiểm toán trước đây, một số test cases được ghi nhận là dự kiến thất bại (`[EXPECTED FAIL]`) do các bug logic trong ứng dụng. Sau khi rà soát và đối chiếu với mã nguồn thực tế:

1. **MKP_088 (API & UI - Nạp tiền ví với phương thức không hợp lệ)**: Controller backend `wallets.controller.ts` đã bổ sung whitelist chặt chẽ (`['VNPAY', 'MOMO', 'PAYPAL']`) và trả về `400 Bad Request`.
2. **MKP_099 (UI - Đăng ký nghệ nhân với ngày sinh tương lai)**: Giao diện `ArtisanDetailPage.tsx` đã chặn ngày sinh lớn hơn hiện tại và hiển thị hộp thoại cảnh báo.
3. **MKP_077 (UI - Đánh giá đơn hàng)**: Controller `orderEvaluate.controller.ts` đã hỗ trợ fallback dữ liệu và giữ đúng route `/evaluate`.
4. **MKP_078 (UI - Nút đánh giá trong danh sách đơn hàng)**: Component `OrderCard.tsx` đã hiển thị liên kết "Đánh giá" cho các đơn hàng hoàn tất.
5. **MKP_085 (UI - Validate số điện thoại thêm địa chỉ mới)**: Form `AddNewAddress.controller.ts` đã kiểm tra chính xác định dạng 10 chữ số.
6. **MKP_091 & MKP_094 (UI - Quy trình trả hàng & tải tài liệu chứng minh)**: Giao diện đã hiển thị đầy đủ nút xử lý yêu cầu và nút upload tệp.

=> **Kết quả**: Tất cả các kịch bản trên đã được cập nhật nhãn `[FIXED]`, gỡ bỏ `test.fail()` giả lập, chuyển đổi thành các **test case hồi quy thực thụ** và đạt tỉ lệ Pass 100%.

---

## 6. Tích Hợp CI/CD (GitHub Actions)

Hệ thống đã được tích hợp quy trình kiểm thử tự động liên tục thông qua workflow:
`.github/workflows/playwright.yml`

- **Sự kiện kích hoạt**:
  - `push` vào nhánh `main`, `dev`
  - `pull_request` tạo vào `main`, `dev`
  - `workflow_dispatch` (kích hoạt thủ công từ giao diện GitHub)
- **Các bước thực thi**:
  1. Khởi tạo môi trường Node.js 22 trên runner `ubuntu-latest`.
  2. Cài đặt các gói phụ thuộc sạch (`npm ci`).
  3. Cài đặt trình duyệt Playwright và OS dependencies (`npx playwright install --with-deps chromium`).
  4. Chuẩn bị file biến môi trường (`.env.dev` cho backend, `.env` cho web).
  5. Playwright tự động khởi chạy backend và web, thực hiện toàn bộ kiểm thử ở chế độ headless.
  6. Tự động lưu trữ Playwright Report và Test Results làm Artifact tải về trong thời hạn 14 ngày.