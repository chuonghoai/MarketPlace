# Anti-Pattern Catalog

Tài liệu này liệt kê các loại code bị xem là "code tệ" trong dự án. Việc phát hiện các Pattern này trong Pull Request sẽ dẫn đến việc bị reject ngay lập tức.

## Anti-Pattern #1: "The God Page" (Component ôm đồm)

**Mô tả**: Một file Page (`*Page.tsx`) chứa tất cả mọi thứ: khai báo state (`useState`, `useEffect`), gọi API trực tiếp qua `fetch` hoặc `axios`, chứa hàm tính toán logic nghiệp vụ, và render một cục JSX khổng lồ.

**Lý do vi phạm**: Phá vỡ hoàn toàn nguyên tắc Separation of Concerns của dự án (UI phải "dumb", Controller lo UI State, Store lo Data, Service lo Logic).

**Giải pháp**:
- Chuyển `useState` và `useEffect` sang `*.controller.ts`.
- Chuyển logic gọi API sang `*.store.ts` và `*.service.ts`.
- Nếu JSX vượt quá 250-300 dòng (ví dụ `productPage.tsx` hiện tại là 412 dòng), hãy bóc tách các block thành các component nhỏ gọn trong thư mục `components/` của trang đó.

---

## Anti-Pattern #2: "Smart Repository"

**Mô tả**: Viết logic tính toán giỏ hàng, tính tổng tiền, sắp xếp/lọc dữ liệu mảng phức tạp ngay bên trong `*.repository.ts` thay vì chỉ trả về dữ liệu nguyên bản từ API.

**Lý do vi phạm**: Repository Layer chỉ được phép có logic giao tiếp data (HTTP/Axios request, map Data Transfer Object sang Model). Mọi logic tính toán phải nằm ở tầng `Service` để có thể tái sử dụng và dễ viết unit test.

**Giải pháp**: Di chuyển toàn bộ tính toán (như tính phí ship, tính tổng, filter local array) lên `*.service.ts`. Repository chỉ nên đơn giản như: `return apiClient.get('/endpoint')`.

---

## Anti-Pattern #3: Cross-layer Import (Import xuyên tầng / ngược tầng)

**Mô tả**: Từ file `features/products/services/product.service.ts` import ngược ra thư mục `pages/product/product.store.ts` để cập nhật dữ liệu. Hoặc `core/api/apiClient.ts` đi import một module từ `features/user/...`.

**Lý do vi phạm**: Vi phạm Dependency Direction. Kiến trúc yêu cầu luồng phụ thuộc một chiều: `pages` -> `features` -> `core`.

**Giải pháp**: Service chỉ nên `return` data, người gọi (Store/Controller ở tầng Page) sẽ nhận data đó và tự set vào state của mình. Tuyệt đối không để tầng dưới (Features) biết về sự tồn tại của tầng trên (Pages).

---

## Anti-Pattern #4: Data State Leakage (UI Controller giữ Data quá phức tạp)

**Mô tả**: Controller (`*.controller.ts`) tự động quản lý logic thêm/sửa/xóa phần tử trong danh sách phức tạp hoặc lưu trữ mảng/object to, mà không sử dụng Store hay Context.

**Lý do vi phạm**: Controller sinh ra để quản lý **UI State** (Loading, Active Tab, Toggle Modal...). Nếu Controller chứa cả **Data State** lớn và logic phức tạp, nó sẽ phình to thành God Object.

**Giải pháp**:
- Đối với trang đơn giản (ví dụ list bài viết hiển thị tĩnh), Controller giữ Data State là chấp nhận được.
- Đối với trang phức tạp có tương tác (như Product detail, Cart, Order), phải tách `*.store.ts` để lo Data State.

---

## Anti-Pattern #5: Thao tác UI từ tầng Service/Repository

**Mô tả**: Gọi thư viện `toast("Lỗi rồi", "error")`, `window.alert`, hay `window.location.href = '/'` trực tiếp từ bên trong `*.service.ts` hoặc `*.repository.ts`.

**Lý do vi phạm**: Business Logic (Features) không được phép quan tâm đến việc hiển thị thông báo ra sao hay chuyển trang như thế nào. Điều này làm Service mất tính tái sử dụng (không thể gọi trong background worker, cron job, hoặc CLI).

**Giải pháp**:
- Service / Repository chỉ nên `throw Error` hoặc trả về object dạng `{ success: false, message: "Lỗi rồi" }`.
- Controller hoặc Store ở tầng `pages/` sẽ nhận kết quả đó và gọi `toast()` hoặc `navigate()` dựa trên logic UI của mình. (Có thể thấy mẫu chuẩn ở `product.store.ts`).
