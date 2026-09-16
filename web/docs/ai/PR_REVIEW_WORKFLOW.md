# PR Review Workflow

Tài liệu này định nghĩa quy trình Code Review dành cho AI Agent. Mục tiêu là giúp AI đánh giá một Pull Request (PR) khắt khe và hệ thống như một Senior Developer, dựa trên các tài liệu Kiến trúc của dự án E-Commerce Platform.

## 1. Các tiêu chí kiểm tra (Review Criteria)

AI phải quét qua toàn bộ thay đổi của PR và đánh giá lần lượt theo 4 nhóm tiêu chí sau:

### 1.1. Architecture (Kiến trúc)
- **Vi phạm layer**: Code tính toán nghiệp vụ (business logic) có bị đẩy vào `*.repository.ts` hoặc `*.tsx` không? Lời gọi API (`axios`, `fetch`) có lọt vào Page hoặc Controller không?
- **Vi phạm Dependency Direction**: Thư mục `features/` có import từ `pages/` (import chéo/ngược) không?
- **Vi phạm Feature Boundary**: Các module domain (VD: `features/products` và `features/cart`) có dính chặt lấy nhau và cross-import bừa bãi không? (Nên mix logic ở tầng Store/Controller của Page thay vì nối chéo 2 Feature).

### 1.2. Code Quality (Chất lượng mã nguồn)
- **File quá lớn**: File Controller hoặc Store có chứa quá nhiều logic không liên quan?
- **Component quá lớn**: File UI `.tsx` có dài hơn 300 dòng không? Có bị nhồi nhét quá nhiều thẻ HTML/JSX không?
- **Duplicate code**: Đoạn logic vừa viết có bị lặp lại với một hàm đã có sẵn ở `utils` hoặc một service khác không?
- **Dead code**: Có biến, import, hoặc hàm nào được khai báo nhưng không bao giờ dùng đến không?

### 1.3. Frontend & State Management
- **State management**: `useState` có được dùng đúng chỗ không? (Global state phải ở Context, Data state phức tạp ở Store, UI state ở Controller). Component `.tsx` có đang tự giữ state không?
- **Component separation**: Đã bóc tách các component dùng chung chưa? Logic hiển thị (UI) và Logic xử lý sự kiện (Handler) đã được tách bạch rõ ràng qua custom hook (`use*Controller`) chưa?
- **Service & Repository Usage**: Service có trả về đúng kiểu dữ liệu (`ApiResponse`) không? Controller có quên handle trường hợp `loading` hoặc `error` không?

### 1.4. Naming & Maintainability
- **Naming**: File và folder có tuân thủ quy tắc (VD: Kebab-case cho folder feature, PascalCase cho UI Component) không? Tên biến có ngữ nghĩa và tuân thủ camelCase không?
- **Maintainability**: Code có dễ đọc không? Các hàm có quá dài (hơn 50 dòng) hoặc có quá nhiều tham số truyền vào không? Logic này có dễ dàng viết Unit Test sau này không?

## 2. Phân loại mức độ Issue và Đề xuất (Issue Classification)

Mỗi lỗi tìm thấy trong PR, AI phải gắn nhãn mức độ nghiêm trọng và ĐƯA RA HƯỚNG SỬA:

- **[CRITICAL]**:
  - *Định nghĩa*: Lỗi gây crash app, lỗi security (lộ token, lộ API key), hoặc phá vỡ hoàn toàn kiến trúc nền tảng (Ví dụ: import vòng lặp circular dependency giữa `core` và `pages`).
  - *Hành động*: Bắt buộc Block PR. Yêu cầu viết lại.

- **[HIGH]**:
  - *Định nghĩa*: Lỗi vi phạm nghiêm trọng Architecture Rules. (Ví dụ: Repository chứa logic tính toán nghiệp vụ; Component `.tsx` trực tiếp gọi `fetch()` hoặc `apiClient`).
  - *Hành động*: Yêu cầu Refactor. Cung cấp snippet code để dev bóc tách logic ra Service/Controller.

- **[MEDIUM]**:
  - *Định nghĩa*: Lỗi liên quan đến Code Quality, Maintainability, hoặc Anti-Pattern nhẹ. (Ví dụ: File `Page.tsx` dài hơn 400 dòng; Khai báo `useState` tràn lan trong file giao diện; Duplicate code).
  - *Hành động*: Đề xuất Extract Component hoặc chuyển state vào Controller/Store.

- **[LOW]**:
  - *Định nghĩa*: Lỗi Naming convention, formatting, typo, console.log bị sót, hoặc Dead code.
  - *Hành động*: Ghi chú nhẹ nhàng, có thể tự động commit fix nếu được cho phép.

## 3. Tổng kết Review (Review Summary)

Cuối bài Review, AI phải đưa ra kết luận:
- Phê duyệt (Approve): Nếu không có lỗi `[CRITICAL]` hay `[HIGH]`.
- Yêu cầu sửa đổi (Request Changes): Liệt kê danh sách các task dev cần làm theo thứ tự ưu tiên.
