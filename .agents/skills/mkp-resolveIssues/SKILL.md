---
name: mkp-resolveIssues
description: >-
  Tiếp nhận mã bug từ developer, lấy chính xác GitHub Issue tương ứng, đọc và phân tích toàn bộ nội dung Issue, sau đó thực hiện quy trình /mkp-fixbug để sửa bug theo phương án xử lý đã được developer xác định/phê duyệt.
---

# mkp-resolveIssues

Mục đích: Đóng vai trò là lớp workflow điều phối quá trình xử lý bug. Tiếp nhận mã bug từ developer, lấy chính xác GitHub Issue tương ứng, đọc và phân tích toàn bộ nội dung Issue, tiếp nhận phương án của developer, sau đó thực hiện quy trình `/mkp-fixbug` để sửa bug.

## Quy tắc an toàn và Điều kiện dừng (Safety Rules & Stop Conditions)
Dừng ngay workflow và yêu cầu cung cấp thêm thông tin trong các trường hợp sau:
- Không có mã bug hoặc mã bug không hợp lệ khi gọi lệnh.
- Không tìm thấy GitHub Issue chứa mã bug tương ứng.
- Có nhiều Issue cùng mã bug và không xác định được Issue chính xác.
- Issue không có developer được assign (Assignee).
- Không thể đọc nội dung Issue hoặc không xác định được phạm vi bug.
- Developer chưa cung cấp hoặc chưa phê duyệt phương án xử lý.
- Phương án developer đưa ra mâu thuẫn nghiêm trọng với source code.
- Không thể xác minh một giả định quan trọng.

Tuyệt đối KHÔNG tự đoán, KHÔNG tự sửa code, KHÔNG tự tạo hay đóng Issue trong các trường hợp trên.

## Quy trình thực hiện (Workflow)

### Step 1 — Tiếp nhận mã bug
1. Lệnh gọi phải có định dạng: `/mkp-resolveIssues <MÃ_BUG>` (ví dụ: `/mkp-resolveIssues MKP_001`).
2. Mã bug phải được sử dụng để xác định chính xác GitHub Issue.

### Step 2 — Lấy chính xác GitHub Issue
1. Sử dụng công cụ GitHub CLI (`gh issue list --search "<MÃ_BUG>"` hoặc lệnh tương đương) để tìm đúng GitHub Issue.
2. Kiểm tra tính chính xác của Issue bằng cách đối chiếu: Issue number, Issue title, Bug ID, Description, Steps to reproduce, Root cause (nếu có), Proposed solution (nếu có), Labels, Assignee, Comments.
3. Không tự chọn Issue dựa trên tiêu đề gần giống nếu không đúng mã bug.

### Step 3 — Kiểm tra Assignee
1. Kiểm tra người được phân công (Assignee) trên Issue.
2. Nếu chưa có developer được assign, cảnh báo developer và dừng workflow. Không tự assign hay tự ý sửa bug.

### Step 4 — Đọc và phân tích Issue
1. Đọc kỹ và hiểu chính xác các thông tin: Mã bug, Mô tả bug (hiện tượng lỗi), Các bước tái hiện (input, expected/actual result).
2. Đọc nguyên nhân lỗi trong Issue và tự rà soát source code thực tế để xác minh. Không mặc định phân tích ban đầu của AI trên Issue là chính xác.
3. Đọc phương án xử lý (như là thông tin tham khảo).

### Step 5 — Chờ Developer phê duyệt phương án (CRITICAL)
1. **Agent AI KHÔNG được tự ý sửa code ngay sau khi đọc Issue.**
2. Phải tiếp nhận phương án xử lý do developer đưa ra (ví dụ: thông qua prompt kèm lệnh gọi, hoặc comment trên Issue, hoặc yêu cầu developer xác nhận).
3. Mục tiêu: "Developer quyết định hướng xử lý → AI hỗ trợ triển khai".

### Step 6 — Áp dụng quy trình /mkp-fixbug
1. Sau khi developer đã xác định/phê duyệt phương án xử lý, gọi và thực hiện đầy đủ quy trình [mkp-fixbug](../mkp-fixbug/SKILL.md).
2. Tuân thủ mọi quy định của `/mkp-fixbug` (phân tích source code, sửa code, kiểm tra regression, v.v.).
3. **Giới hạn phạm vi:** Chỉ sửa bug được mô tả. Không refactor code không liên quan, không đổi kiến trúc, không tạo mock data che lỗi, không sửa đổi API/DB nếu không cần thiết.

### Step 7 — Xác minh sau khi sửa
1. Kiểm tra kết quả sửa lỗi theo khả năng (compile, lint, logic liên quan, phạm vi thay đổi).
2. **Lưu ý:** Agent AI KHÔNG được tự đóng (close) Issue và KHÔNG tự xác nhận bug đã hết lỗi. Việc này thuộc thẩm quyền của developer/tester sau khi kiểm thử thực tế.

### Step 8 — Báo cáo kết quả
Xuất báo cáo kết quả ngắn gọn theo cấu trúc:
- **Bug**: (Mã bug)
- **GitHub Issue**: (Issue number, Title, Assignee)
- **Nguyên nhân**: (Tóm tắt nguyên nhân thực tế đã xác minh)
- **Phương án developer**: (Tóm tắt phương án đã được phê duyệt)
- **Đã thay đổi**: (Các file/thành phần thay đổi và mục đích)
- **Kiểm tra**: (Các bước đã kiểm tra và kết quả)
- **Trạng thái**: "Đã hoàn thành sửa code, chờ developer/tester kiểm thử và xác nhận trước khi đóng Issue."
