# Kiểm thử Tự động với Playwright

Thư mục này chứa toàn bộ các kịch bản kiểm thử tự động (automation test) cho dự án sử dụng [Playwright](https://playwright.dev/).

## 1. Playwright dùng để làm gì?
- **API automation test**: Kiểm thử trực tiếp các endpoint backend không cần thông qua giao diện.
- **UI automation test**: Kiểm thử hoạt động của các thành phần giao diện (UI) một cách độc lập.
- **E2E automation test**: Kiểm thử toàn bộ quy trình người dùng (End-to-End) từ frontend đến backend và database.

## 2. Cấu trúc thư mục

```text
playwright/
├── api/                   # Chứa các file test API (*_api.spec.ts)
├── ui/                    # Chứa các file test giao diện (*_ui.spec.ts)
├── e2e/                   # Chứa các file test End-to-End (*_e2e.spec.ts)
├── playwright.config.ts   # File cấu hình của Playwright
└── README.md              # Hướng dẫn sử dụng
```

## 3. Điều kiện cần trước khi chạy test

- Đảm bảo **Backend** đang chạy (mặc định tại `http://localhost:3000`).
- Đảm bảo **Web (Frontend)** đang chạy (mặc định tại `http://localhost:5173`).
- **Database** phải hoạt động để E2E và API test có thể xử lý dữ liệu thực (Dự án tự động sinh 3 tài khoản mặc định `admin@example.com`, `staff@example.com`, `client@example.com` với mật khẩu `password123`).

## 4. Các lệnh chạy test

Bạn có thể chạy test từ thư mục root của dự án bằng các lệnh `npm`.

### 4.1. Chạy toàn bộ test
```bash
npm run test:all
```

### 4.2. Chạy API test
```bash
npm run test:api
```

### 4.3. Chạy UI test
```bash
npm run test:ui
```

### 4.4. Chạy E2E test
```bash
npm run test:e2e
```

### 4.5. Chạy một test file cụ thể
Để chạy riêng biệt một file test (ví dụ `login_api.spec.ts`), sử dụng cú pháp chuẩn của npm:
```bash
npm run test -- login_api.spec.ts
```

### 4.6. Chạy trực tiếp bằng npx (Tùy chọn)
Nếu bạn đã cài đặt Playwright, bạn cũng có thể chạy lệnh trực tiếp thông qua npx:
```bash
npx playwright test
npx playwright test --project=api
npx playwright test playwright/api/login_api.spec.ts
```
