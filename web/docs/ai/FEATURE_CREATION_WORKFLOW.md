# Feature Creation Workflow

Tài liệu này định nghĩa quy trình AI Agent phải tuân thủ khi được yêu cầu tạo một Feature (Tính năng) hoặc một Page (Trang) mới trong E-Commerce Platform.

## 1. Khi nào tạo Feature mới?

- Tạo Feature mới (`src/features/{featureName}`) khi yêu cầu liên quan đến một nhóm nghiệp vụ logic riêng biệt (domain), có API endpoint riêng và có thao tác dữ liệu phức tạp.
- Tạo Page mới (`src/pages/{pageName}`) khi yêu cầu đơn thuần là thêm một màn hình hiển thị cho người dùng.
- **Lưu ý**: Một Page thường tiêu thụ (consume) nhiều Feature.

## 2. Quy tắc tiền xử lý (Pre-coding Analysis)

**TRƯỚC KHI SINH CODE MỚI**, AI bắt buộc phải thực hiện các bước sau:

1. **Tìm kiếm Pattern**: Tìm ít nhất 3 feature/page tương tự đã tồn tại trong project (Ví dụ: `products`, `cart`, `marketplace`, `order-checkout`).
2. **So sánh Kiến trúc**: Đối chiếu 3 feature tìm được theo các tiêu chí:
   - *Folder structure*: Có chia folder `models`, `repositories`, `services`, `components` không?
   - *Service structure*: Khởi tạo class như thế nào? Singleton hay Inject?
   - *Repository structure*: Có chia `ApiRepository` và `MockRepository` không?
   - *Controller structure*: Cách định nghĩa custom hook `use...Controller`, cách return state và functions.
3. **Quyết định Pattern**: AI **chỉ được tạo code theo pattern phổ biến nhất** tìm thấy từ sự so sánh trên.
4. **Xử lý ngoại lệ**: Nếu phát hiện các feature cũ đang dùng nhiều pattern khác nhau, AI phải dừng lại, ghi chú rõ ràng vào file output (hoặc báo cáo cho User) pattern nào được chọn làm chuẩn và lý do (thường là pattern tuân thủ đúng nhất với `ARCHITECTURE_RULES.md`).

## 3. Quy ước Naming (Naming Conventions)

AI phải áp dụng chuẩn naming sau:
- **Thư mục (Folder)**: Dùng `kebab-case` hoặc chữ thường (VD: `order-checkout`, `products`).
- **Models**: `src/features/{name}/models/{name}.model.ts` (Interface dùng PascalCase).
- **Repository**: `src/features/{name}/repositories/{name}.repository.ts` (Interface) và `{name}Api.repository.ts`, `{name}Mock.repository.ts` (Class).
- **Service**: `src/features/{name}/services/{name}.service.ts` (Class dùng PascalCase, instance export dùng camelCase).
- **Page Component**: `src/pages/{name}/{name}Page.tsx` (Component Name dùng PascalCase).
- **Controller**: `src/pages/{name}/{name}.controller.ts` (Tên hook: `use{Name}Controller`).
- **Store**: `src/pages/{name}/{name}.store.ts` (Tên hook: `use{Name}Store`).

## 4. Trình tự tạo Code (Code Generation Sequence)

Khi được phê duyệt tạo tính năng, AI hãy tuân thủ trình tự sinh code từ trong ra ngoài (Bottom-up):
1. **Core Domain**: Tạo `*.model.ts` trước để định nghĩa cấu trúc dữ liệu.
2. **Data Access**: Tạo `*.repository.ts` kèm theo bản Mock và bản API thực tế.
3. **Business Logic**: Tạo `*.service.ts` để bọc các Repositories.
4. **Data State (Nếu cần)**: Tạo `*.store.ts` ở tầng `pages/`.
5. **UI Logic**: Tạo `*.controller.ts` để kết nối UI với Store/Service.
6. **Presentation**: Tạo `*Page.tsx` và chia nhỏ các phần UI vào thư mục `components/`.
7. **Routing**: Cuối cùng, khai báo Page mới vào hệ thống Routing.

## 5. Cách Reuse code hiện có

- Thay vì tự viết lại các hàm call API, luôn sử dụng `apiClient` từ `core/api/apiClient.ts`.
- Thay vì tự quản lý LocalStorage, luôn dùng module trong `core/storage/`.
- Tận dụng tối đa các UI Component dùng chung (như Toast) từ thư mục `src/components/`.
