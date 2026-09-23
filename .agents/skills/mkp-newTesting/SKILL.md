---
name: mkp-newTesting
description: Tạo test tự động mới bằng Playwright cho tính năng theo yêu cầu (API, UI hoặc E2E).
---

# mkp-newTesting

Mục đích: Tạo test tự động mới bằng Playwright (API, UI, E2E) dựa trên yêu cầu tính năng. Đảm bảo test được tạo đúng chuẩn, đi qua quá trình đọc hiểu source code thực tế và sử dụng đúng cấu trúc thư mục, lệnh chạy.

## Quy tắc bắt buộc
1. **Không tạo test dựa trên suy đoán**.
2. **Luôn đọc source code** liên quan trước (Controller, Service, Repository, UI Component, Router, etc.).
3. **Không tạo mock API** nếu API thật đã tồn tại và có thể sử dụng.
4. **Không tạo mock data** không cần thiết.
5. **Không sửa application source** chỉ để làm test pass.
6. **Không tạo test ngoài phạm vi** feature người dùng yêu cầu.
7. Đặt file test đúng thư mục tương ứng: `playwright/api/`, `playwright/ui/` hoặc `playwright/e2e/`.
8. File test bắt buộc có hậu tố `_api.spec.ts`, `_ui.spec.ts`, hoặc `_e2e.spec.ts`.
9. Nếu người dùng chưa xác định loại test, **phải hỏi**. Nếu đã xác định, **không hỏi lại**.
10. **Luôn chạy thử test** sau khi tạo bằng các script tương ứng.
11. Không tuyên bố test thành công nếu chưa thực sự chạy và xác nhận kết quả.
12. Không tự động tạo cả API + UI + E2E nếu người dùng chỉ yêu cầu một loại.
13. Không tự ý refactor code production.
14. Tái sử dụng helper/configuration hiện có nếu phù hợp.
15. Kiểm tra trước xem file test cùng loại, cùng chức năng đã tồn tại chưa để tránh tạo duplicate.
16. Tuân thủ convention hiện tại của repository.
17. Dừng và yêu cầu thông tin nếu có lỗi hoặc thông tin thiếu để viết test chính xác, không tự đoán.

## Quy trình tạo test

### Bước 0 — Xác định loại test
Khi người dùng chỉ yêu cầu chung chung (ví dụ: "Tạo test cho đăng nhập"), phải đặt câu hỏi: "Bạn muốn tạo test cho API, UI hay End-to-End?". 
Nếu người dùng đã nói rõ loại test, bỏ qua câu hỏi này.

### Bước 1 — Xác định tính năng
Đọc yêu cầu để xác định chính xác chức năng cần test, không mở rộng sang chức năng khác.

### Bước 2 — Đọc source code
Đọc source code thực tế để hiểu logic:
- **API**: Controller → Service → Repository → DB / Utils.
- **UI**: Page → Component → State → API call → UI result.
- **E2E**: User flow → UI → API → Backend → DB → Result.

### Bước 3 — Xác định test scenario
Xác định: Preconditions, Input, User action / request, Expected result, Assertion.

### Bước 4 — Chọn đúng thư mục
Dựa vào loại test để đặt file vào:
- API: `playwright/api/`
- UI: `playwright/ui/`
- E2E: `playwright/e2e/`

### Bước 5 — Đặt tên file
Sử dụng hậu tố chuẩn: `<feature>_api.spec.ts`, `<feature>_ui.spec.ts`, hoặc `<feature>_e2e.spec.ts`.

### Bước 6 — Viết test
Sử dụng công cụ phù hợp với Playwright:
- API → `request` (APIRequestContext)
- UI → `page` (Không gọi logic backend giả lập)
- E2E → `page` + luồng API/app flow thực tế.

### Bước 7 — Chạy test
Chạy test vừa tạo bằng NPM:
- Ưu tiên chạy riêng: `npm run test -- <test-file-name>`
- Hoặc chạy nhóm (nếu cần): `npm run test:api`, `npm run test:ui`, `npm run test:e2e`

### Bước 8 — Phân tích kết quả
- **Pass**: Báo cáo test thành công.
- **Fail**: Phân tích nguyên nhân (do test sai, cấu hình hay lỗi app). Không tự sửa app source để lấp lỗi. Báo rõ lý do lỗi và chờ người dùng quyết định.
