---
name: mkp-newIssues
description: >-
  Đọc mô tả bug, phân tích nguyên nhân gốc rễ trong codebase và tạo link GitHub Issue kèm đầy đủ thông tin (title, description, label) để tạo issue nhanh chóng.
---

# mkp-newIssues

Mục đích: Tiếp nhận mô tả lỗi/bug từ người dùng hoặc quá trình testing, phân tích nguyên nhân kỹ thuật trong codebase và tạo URL GitHub Issue được điền sẵn đầy đủ thông tin để người dùng click tạo Issue ngay lập tức.

## Dependencies
- [Shared Workflow](../rules/shared-workflow.md)
- [Shared Architecture Rules](../rules/shared-architecture-rules.md)
- [Shared Git Rules](../rules/shared-git-rules.md)

## Quy trình thực hiện (Workflow)

### Step 1 — Tiếp nhận và làm rõ mô tả Bug
1. Đọc kỹ mô tả lỗi do người dùng cung cấp (hoặc kết quả kiểm thử):
   - Triệu chứng lỗi (Symptom / Actual behavior).
   - Hành vi kỳ vọng (Expected behavior).
   - Module hoặc nền tảng bị ảnh hưởng (Frontend `web` hay Backend `backend`).
2. Nếu thiếu thông tin quan trọng để tái hiện hoặc định vị lỗi, đặt câu hỏi làm rõ ngắn gọn.

### Step 2 — Truy vết và phân tích Root Cause trong Codebase
1. Sử dụng các công cụ tìm kiếm (`grep_search`, `view_file`) để truy vết luồng xử lý liên quan:
   - Frontend: `UI Component -> Hook / Store -> Repository / API Client -> Interceptor`.
   - Backend: `Controller -> Service -> Repository / Prisma / Entity -> Database / External Service`.
2. Xác định chính xác:
   - File và dòng code gây ra lỗi (kèm file link).
   - Nguyên nhân kỹ thuật cốt lõi (Root Cause) thay vì chỉ nhìn vào triệu chứng bề ngoài.
3. Đề xuất phương án khắc phục (Proposed Fix) an toàn, tránh gây side effects hoặc regression.

### Step 3 — Xác định Issue ID và Title
- Format Title bắt buộc: `[MKP-xxx] <Tóm tắt ngắn gọn lỗi>`
  - `MKP-xxx`: Mã định danh bug/issue (Ví dụ: `[MKP-001]`, `[MKP-002]`,...).
  - Để xác định `MKP-xxx`, trước tiên dùng lệnh `gh --version` để xác định máy tính có github được kết nối hay ko.
  - Nếu chưa có, hãy yêu cầu người dùng cài đặt Github CLI bằng lệnh `winget install --id GitHub.cli`, sau đó yêu cầu người dùng tắt IDE và mở lại để tải được CLI
  - Sau đó kiểm tra lại bằng lệnh `gh --version` để xác định máy tính đã tải thành công GitHub CLI hay chưa.
  - Nếu Github CLI đã sẵn sàng trên máy tính, hãy chạy lệnh `gh issue list` để lấy các danh sách issues đã có trên repo Github
  - Nếu lệnh trả về lỗi chưa đăng nhập, hãy yêu cầu người dùng tự chạy lệnh `gh auth login` để tiến hành đăng nhập Github
  - Cuối cùng chạy lại lệnh `gh issue list` để lấy các danh sách issues đã có trên repo Github
  - Từ danh sách issues trả về, tìm Issue ID lớn nhất trong tiêu đề của issues có mẫu `[MKP-xxx]`
  - Số tiếp theo của `[MKP-xxx]` là số cần để làm ID của issue mới và gợi ý cho người dùng sử dụng mã số đó. Nếu người dùng đã cung cấp mã ID, sử dụng mã đó.
  - Tiêu đề phải rõ ràng, súc tích, phản ánh đúng bản chất lỗi.

### Step 4 — Soạn thảo nội dung Issue Description (Body)
Cấu trúc nội dung Issue theo template chuẩn Markdown:

```markdown
## 📌 Mô tả lỗi (Description / Symptom)
- **Hiện tượng:** [Mô tả chi tiết lỗi xảy ra như thế nào]
- **Kỳ vọng:** [Hành vi đúng đáng lẽ phải diễn ra]
- **Phạm vi ảnh hưởng:** [Frontend (web) / Backend / Cả hai]

---

## 🔁 Các bước tái hiện (Steps to Reproduce)
1. [Bước 1...]
2. [Bước 2...]
3. [Bước 3...]
4. **Kết quả thực tế:** [Lỗi hiển thị / HTTP Status code / Log lỗi]

---

## 🔍 Nguyên nhân gây lỗi (Root Cause Analysis)
- **Vị trí lỗi:** [Tên file và dòng code liên quan, ví dụ: `web/src/...` hoặc `backend/src/...`]
- **Giải thích kỹ thuật:** [Phân tích chi tiết tại sao đoạn code đó gây ra lỗi, logic sai ở đâu]

---

## 💡 Đề xuất phương án khắc phục (Proposed Fix)
- [Mô tả các bước cần sửa chữa trong code]
- [Lưu ý về side effects hoặc test case cần bổ sung]
```

### Step 5 — Tạo GitHub Issue URL
1. Lấy thông tin GitHub Repository (từ `git remote -v`, mặc định là `https://github.com/chuonghoai/MarketPlace`).
2. Xác định các Labels phù hợp (ví dụ: `bug`, `frontend`, `backend`, `high-priority`,...).
3. Encode URI các tham số `title`, `body`, và `labels`:
   - Định dạng URL:
     ```
     https://github.com/{owner}/{repo}/issues/new?title={encodedTitle}&body={encodedBody}&labels={encodedLabels}
     ```
4. Xuất kết quả cho người dùng:
   - **Clickable Link trực tiếp:** Đưa link để người dùng click mở thẳng trang tạo Issue trên trình duyệt.
   - **Nội dung Issue Markdown dự phòng:** Hiển thị trọn vẹn Title, Body, Labels để người dùng có thể dễ dàng copy thủ công trong trường hợp URL quá dài.
