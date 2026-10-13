# BÁO CÁO FIX BUG [MKP-014] — PRICE FILTER VALIDATION

## A. Git
- **Base Branch:** `origin/dev` (commit `d0a0ed9` - *Merge pull request #16 from chuonghoai/fix/bug_mkp003_mkp004*)
- **Active Branch:** `fix/MKP-014-price-filter-validation`
- **Commit Message:** `fix(MKP-014): validate product price range`

## B. Root Cause
1. **Frontend:**
   - Trong [`filter.controller.ts`](file:///e:/Nam4_Ky1/KiemThu/project/MarketPlace/web/src/pages/marketplace/components/filter/filter.controller.ts), câu thông báo lỗi hardcode là `"Giá tối thiểu phải nhỏ hơn giá tối đa"` thay vì đặc tả `"Giá tối thiểu phải nhỏ hơn hoặc bằng giá tối đa."`.
   - Ngoài ra, chuỗi giá nhập vào chưa được trim khoảng trắng và chuẩn hóa số đúng cách trước khi so sánh `min > max`.
   - Các trường input trong [`marketplaceFilter.tsx`](file:///e:/Nam4_Ky1/KiemThu/project/MarketPlace/web/src/pages/marketplace/components/filter/marketplaceFilter.tsx) chưa được gắn thuộc tính trợ năng `aria-invalid` và `aria-describedby` liên kết với thẻ thông báo lỗi (`#price-range-error` role="alert").
2. **Backend:**
   - Trong [`products.service.ts`](file:///e:/Nam4_Ky1/KiemThu/project/MarketPlace/backend/src/module/products/products.service.ts), hàm `getAllProducts` nhận `filters[minPrice]` và `filters[maxPrice]` từ query nhưng không thực hiện kiểm tra quan hệ `minPrice <= maxPrice`.
   - Khi `minPrice > maxPrice`, backend vẫn chạy câu truy vấn SQL `BETWEEN :minPrice AND :maxPrice` trả về danh sách rỗng kèm HTTP 200 thay vì từ chối request với mã lỗi HTTP 400 (`BadRequestException`).

## C. Các Thay Đổi (Changes)
### 1. Frontend
- [`web/src/pages/marketplace/components/filter/filter.controller.ts`](file:///e:/Nam4_Ky1/KiemThu/project/MarketPlace/web/src/pages/marketplace/components/filter/filter.controller.ts):
  - Chuẩn hóa kiểm tra `minTrim` và `maxTrim`. Khi cả hai trường được nhập và `minNum > maxNum`, đặt lỗi `"Giá tối thiểu phải nhỏ hơn hoặc bằng giá tối đa."` và dừng submit ngay lập tức (`return`).
  - Không thay đổi `searchParams`, nhờ đó không kích hoạt hook `useMarketplaceController` fetch API, giữ nguyên 100% danh sách sản phẩm hiện tại trên giao diện.
  - Khi người dùng chỉnh sửa giá hoặc nhấn "Xóa tất cả", `priceError` tự động được xóa về chuỗi rỗng.
- [`web/src/pages/marketplace/components/filter/marketplaceFilter.tsx`](file:///e:/Nam4_Ky1/KiemThu/project/MarketPlace/web/src/pages/marketplace/components/filter/marketplaceFilter.tsx):
  - Bổ sung `aria-invalid={priceError ? "true" : "false"}` và `aria-describedby={priceError ? "price-range-error" : undefined}` vào 2 ô nhập giá tối thiểu / tối đa.
  - Bổ sung `id="price-range-error"` và `role="alert"` cho thẻ `<p>` thông báo lỗi màu đỏ (`text-market-error`).

### 2. Backend
- [`backend/src/module/products/products.service.ts`](file:///e:/Nam4_Ky1/KiemThu/project/MarketPlace/backend/src/module/products/products.service.ts):
  - Import và ném `BadRequestException` trong `getAllProducts` trước khi tạo QueryBuilder.
  - Kiểm tra `hasMin` và `hasMax`, xác thực số hợp lệ và không âm.
  - Nếu `parsedMin > parsedMax`, ném `BadRequestException('minPrice must be less than or equal to maxPrice')` trả về HTTP 400 `VALIDATION_ERROR`.
  - Hỗ trợ đầy đủ các trường hợp: `minPrice === maxPrice`, chỉ `minPrice`, chỉ `maxPrice`, cả hai để trống, và giá trị `0`.

### 3. Tests
- **Backend Unit Tests:** Tạo mới [`backend/src/module/products/products.service.spec.ts`](file:///e:/Nam4_Ky1/KiemThu/project/MarketPlace/backend/src/module/products/products.service.spec.ts) bao phủ toàn bộ 8 kịch bản (min > max, min == max, min < max, chỉ min, chỉ max, không có khoảng giá, query sai định dạng, giá bằng 0).
- **Playwright API Tests:** Cập nhật [`playwright/api/products_filter_api.spec.ts`](file:///e:/Nam4_Ky1/KiemThu/project/MarketPlace/playwright/api/products_filter_api.spec.ts) bổ sung test cases kiểm tra HTTP 400 khi `minPrice > maxPrice`, chấp nhận khi `minPrice === maxPrice`, chấp nhận chỉ min/max, từ chối định dạng sai/âm.
- **Playwright UI Tests:** Cập nhật [`playwright/ui/search_filter_ui.spec.ts`](file:///e:/Nam4_Ky1/KiemThu/project/MarketPlace/playwright/ui/search_filter_ui.spec.ts) kiểm tra luồng người dùng:
  - Nhập 500.000 & 100.000: hiển thị lỗi đỏ, không gọi API, danh sách giữ nguyên.
  - Sửa lại thành giá hợp lệ: thông báo lỗi tự biến mất, submit thành công.
  - Hai giá bằng nhau: không báo lỗi.
  - Chỉ nhập 1 trong 2 giá: áp dụng bộ lọc bình thường.

## D. Kết Quả Kiểm Thử (Test Results)
1. **Backend Unit Tests (Jest):**
   - Command: `npx jest src/module/products/products.service.spec.ts`
   - Result: **8/8 passed** (100%).
2. **Playwright API Tests:**
   - Command: `npx playwright test playwright/api/products_filter_api.spec.ts`
   - Result: **6/6 passed** (100%).
3. **Playwright UI Tests:**
   - Command: `npx playwright test playwright/ui/search_filter_ui.spec.ts`
   - Result: **6/6 passed** (100%).
4. **Build & Typecheck:**
   - Backend: `npm run build` -> Exit code 0 (thành công).
   - Frontend: `npm run build` (`tsc -b && vite build --mode prod`) -> Exit code 0 (thành công).

## E. Các Điểm Cần Lưu Ý & Hướng Dẫn Kiểm Tra Thủ Công
- **Vấn đề tồn tại từ trước:** Bộ test `auctions` trong backend đang thiếu mock module và một số file frontend có cảnh báo eslint từ các đợt phát triển trước; các phần này không bị ảnh hưởng và hoạt động độc lập với tính năng lọc sản phẩm.
- **Các bước kiểm tra thủ công trên trình duyệt (Chrome):**
  1. Mở trình duyệt truy cập `http://localhost:5173/marketplace`.
  2. Tại phần "Khoảng giá (VNĐ)":
     - Nhập ô "Tối thiểu": `500000`
     - Nhập ô "Tối đa": `100000`
  3. Nhấn "Áp dụng bộ lọc":
     - Xác nhận hiển thị thông báo lỗi màu đỏ: *"Giá tối thiểu phải nhỏ hơn hoặc bằng giá tối đa."* ngay dưới 2 ô nhập.
     - Mở DevTools Network: xác nhận **không có** request nào gửi tới `/products`.
     - Danh sách sản phẩm trên màn hình giữ nguyên, không biến mất hoặc chuyển thành danh sách trống.
  4. Sửa ô "Tối thiểu" thành `50000`:
     - Xác nhận thông báo lỗi tự động biến mất ngay khi nhập.
  5. Nhấn "Áp dụng bộ lọc":
     - Xác nhận URL chuyển thành `...minPrice=50000&maxPrice=100000` và danh sách sản phẩm được lọc thành công.
