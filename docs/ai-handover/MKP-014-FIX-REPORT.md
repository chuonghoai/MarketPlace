# BÁO CÁO FIX VÀ CODE REVIEW ISSUE [MKP-014] — PRICE FILTER VALIDATION

## A. Git
- **Base Branch:** `origin/dev` (commit `d0a0ed9` - *Merge pull request #16 from chuonghoai/fix/bug_mkp003_mkp004*)
- **Active Branch:** `fix/MKP-014-price-filter-validation`
- **Initial Fix Commit:** `6a6f40a` (`fix(MKP-014): validate product price range`)
- **Review Refinement Commit:** (sẽ cập nhật sau commit)

## B. Root Cause
1. **Frontend:**
   - Trong [`filter.controller.ts`](file:///e:/Nam4_Ky1/KiemThu/project/MarketPlace/web/src/pages/marketplace/components/filter/filter.controller.ts), câu thông báo lỗi hardcode là `"Giá tối thiểu phải nhỏ hơn giá tối đa"` thay vì đặc tả `"Giá tối thiểu phải nhỏ hơn hoặc bằng giá tối đa."`.
   - Chuỗi giá nhập vào chưa được trim khoảng trắng và chuẩn hóa số đúng cách trước khi so sánh `min > max`.
   - Các trường input trong [`marketplaceFilter.tsx`](file:///e:/Nam4_Ky1/KiemThu/project/MarketPlace/web/src/pages/marketplace/components/filter/marketplaceFilter.tsx) chưa được gắn thuộc tính trợ năng `aria-invalid` và `aria-describedby` liên kết với element thông báo lỗi (`#price-range-error` role="alert").
2. **Backend:**
   - Trong [`products.service.ts`](file:///e:/Nam4_Ky1/KiemThu/project/MarketPlace/backend/src/module/products/products.service.ts), hàm `getAllProducts` nhận `filters[minPrice]` và `filters[maxPrice]` từ query nhưng không thực hiện kiểm tra quan hệ `minPrice <= maxPrice`.
   - Khi `minPrice > maxPrice`, backend vẫn chạy câu truy vấn SQL `BETWEEN :minPrice AND :maxPrice` trả về danh sách rỗng kèm HTTP 200 thay vì từ chối request với mã lỗi HTTP 400 (`BadRequestException`).

## C. Code Review Findings & Xử Lý

### 1. Phân loại phát hiện:
- **Finding 1 (Medium - Test Flakiness):**
  - *Vị trí:* [`playwright/api/products_filter_api.spec.ts`](file:///e:/Nam4_Ky1/KiemThu/project/MarketPlace/playwright/api/products_filter_api.spec.ts)
  - *Hiện tượng:* Backend cấu hình `ThrottlerModule` giới hạn 6 request/giây (`ttl: 1000, limit: 6`). Khi Playwright chạy 6 test với 8 request liên tiếp trong < 1.5s, các request cuối bị trả về HTTP 429 Too Many Requests gây flaky test.
  - *Xử lý:* Đã thêm khoảng đệm 250ms giữa các request API (`beforeEach` và giữa các sub-request), đảm bảo test suite chạy ổn định 100% trong mọi lần chạy.
- **Finding 2 (Low - Input Sanitization):**
  - *Vị trí:* [`backend/src/module/products/products.service.ts:88, 97`](file:///e:/Nam4_Ky1/KiemThu/project/MarketPlace/backend/src/module/products/products.service.ts)
  - *Hiện tượng:* Ban đầu dùng `Number.isNaN(parsedMin)` - nếu client truyền chuỗi `'Infinity'`, giá trị `Infinity` không phải NaN và `>= 0` nên có thể đi vào query builder.
  - *Xử lý:* Cập nhật sang `!Number.isFinite(parsedMin)`, loại bỏ cả `NaN` và `±Infinity`, đảm bảo kiểu số hữu hạn hợp lệ.

### 2. Xác minh các nội dung bắt buộc:
1. **Frontend:**
   - `minPrice > maxPrice`: Hiển thị lỗi màu đỏ `"Giá tối thiểu phải nhỏ hơn hoặc bằng giá tối đa."` và dừng submit ngay lập tức.
   - Không phát sinh request mới tới API `/products`.
   - Danh sách sản phẩm và các bộ lọc khác (categories, sortBy, search) được giữ nguyên vẹn.
   - `minPrice === maxPrice`, chỉ nhập min, chỉ nhập max, để trống cả hai: Hoạt động chính xác.
   - Xóa lỗi khi người dùng sửa giá hoặc nhấn "Xóa tất cả".
   - `aria-invalid`, `aria-describedby` và `role="alert"` đã được gắn đầy đủ và hoạt động đồng bộ.
2. **Backend:**
   - Query `minPrice > maxPrice` trả HTTP 400 Bad Request (`VALIDATION_ERROR`).
   - Query parameter được parse sang số an toàn; giá trị `0` hoạt động bình thường, chuỗi sai/âm/vô hạn bị từ chối 400 trước khi chạm vào SQL.
   - Không có luồng nào cho phép khoảng giá sai lọt vào SQL Query.
3. **Tests:**
   - Đầy đủ unit test backend, API test và UI test; UI test xác minh không gọi API khi submit sai.
4. **Git:**
   - Commit nằm trên branch `fix/MKP-014-price-filter-validation`, không đụng tới `dev` hay `main`.

## D. Kết Quả Kiểm Thử (Test Results)
| Bộ test | Lệnh thực tế | Kết quả | Trạng thái |
| :--- | :--- | :--- | :--- |
| **Backend Unit Test** | `npx jest src/module/products/products.service.spec.ts` | **8/8 passed** (100%) | PASS |
| **Playwright API Test** | `npx playwright test playwright/api/products_filter_api.spec.ts` | **6/6 passed** (100%) | PASS |
| **Playwright UI Test** | `npx playwright test playwright/ui/search_filter_ui.spec.ts` | **6/6 passed** (100%) | PASS |
| **Backend Build** | `npm run build` (tại `backend/`) | **Exit code 0** | PASS |
| **Frontend Build** | `npm run build` (tại `web/`) | **Exit code 0** | PASS |
| **Git Diff Check** | `git diff --check` | **Exit code 0** | PASS |

## E. Hướng Dẫn Kiểm Tra Thủ Công Trên Chrome
1. Mở Chrome truy cập: `http://localhost:5173/marketplace`.
2. Tại bộ lọc "Khoảng giá (VNĐ)":
   - Nhập **Tối thiểu**: `500000`, **Tối đa**: `100000`.
3. Nhấn **"Áp dụng bộ lọc"**:
   - Xác nhận hiển thị dòng chữ màu đỏ: `"Giá tối thiểu phải nhỏ hơn hoặc bằng giá tối đa."`.
   - F12 Network tab: Xác nhận **0 request** gửi lên API `/products`.
   - Danh sách sản phẩm không bị thay đổi.
4. Sửa ô **Tối thiểu** thành `50000`:
   - Dòng lỗi tự động biến mất.
5. Nhấn **"Áp dụng bộ lọc"**:
   - Lọc sản phẩm thành công với URL `...minPrice=50000&maxPrice=100000`.
