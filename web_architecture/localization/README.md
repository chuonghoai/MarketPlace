# Localization & User-Facing Text Guidelines (Web Frontend)

Tài liệu này quy định các tiêu chuẩn về văn bản hiển thị cho người dùng (User-Facing Text), thông báo lỗi và chuẩn hóa ngôn ngữ trong ứng dụng Web Frontend Marketplace.

---

## 1. Nguyên tắc cốt lõi

1. **Nhất quán về ngôn ngữ:** Toàn bộ giao diện người dùng, nút bấm, nhãn trường (labels), placeholders, thông báo toast, modal xác nhận và thông điệp lỗi phải được viết nhất quán theo ngôn ngữ chính của nền tảng (Tiếng Việt).
2. **Không phân tán chuỗi thông báo (Avoid Magic Strings):**
   - Các thông điệp thông báo chung, tiêu đề modal, placeholder mẫu nên được định nghĩa tập trung trong `src/core/constants/` hoặc hằng số của feature.
   - Các thông điệp lỗi từ Backend (`response.error.message` hoặc `response.message`) phải được ưu tiên hiển thị trực tiếp cho người dùng.
3. **Phân biệt rõ ràng giữa Technical Logs và User Messages:**
   - `console.error` / `console.log`: Dùng chuỗi kỹ thuật tiếng Anh hoặc debug info.
   - UI Toast / Modal / Error Banner: BẮT BUỘC dùng câu chữ lịch sự, rõ ràng, dễ hiểu đối với người dùng cuối (ví dụ: "Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu.").

---

## 2. Quy chuẩn thông báo lỗi (Error Messaging)

Khi xử lý lỗi trong Form hoặc Service:
- **Validation Form:** Đưa ra hướng dẫn cụ thể thay vì chỉ báo "Lỗi" (ví dụ: "Mật khẩu phải chứa ít nhất 6 ký tự", "Vui lòng nhập địa chỉ email hợp lệ").
- **Lỗi mạng / Server:** "Không thể kết nối đến máy chủ. Vui lòng thử lại sau giây lát."
- **Lỗi hết phiên:** "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."

---

## 3. Mở rộng hệ thống Đa ngôn ngữ (i18n Future-readiness)

Nếu dự án tích hợp thư viện đa ngôn ngữ (như `i18next` hoặc `react-intl`) trong tương lai:
- Mọi chuỗi user-facing text sẽ được chuyển đổi sang key tương ứng (`t('auth.login_title')`).
- File ngôn ngữ sẽ được đặt trong `src/locales/vi.json` và `src/locales/en.json`.
