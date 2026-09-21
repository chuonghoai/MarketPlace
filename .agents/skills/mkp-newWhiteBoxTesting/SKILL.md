---
name: mkp-newWhiteBoxTesting
description: >-
  Phân tích một chức năng trong project, truy vết toàn bộ luồng thực thi thực tế, sau đó tạo bộ tài liệu kỹ thuật phục vụ kiểm thử hộp trắng (White Box Testing).
---

# mkp-newWhiteBoxTesting

## 1. Mục tiêu

Phân tích một chức năng trong project, truy vết toàn bộ luồng thực thi thực tế, sau đó tạo bộ tài liệu kỹ thuật phục vụ **kiểm thử hộp trắng (White Box Testing)**.

Skill hoạt động theo quy trình:
**Xác định chức năng → Truy vết code → Xây dựng sơ đồ luồng thực thi → Xác nhận phạm vi → Phân tích kiểm thử → Xuất tài liệu.**

## 2. Template bắt buộc (`template.puml`)

Mọi đồ thị PlantUML (.puml) được tạo ra phải **tuân thủ 100% cấu trúc của template `template.puml`** được cung cấp. Bản sao của template này đã được đặt tại `.agents/skills/mkp-newWhiteBoxTesting/template.puml` để tham chiếu.
- Sử dụng `skinparam nodesep 15` và `skinparam ranksep 25`.
- Sử dụng node hình tròn: `(1) as n1`.
- Label dòng dữ liệu nằm bên phải node thông qua cú pháp chuẩn của PlantUML: `note right of n1 : d(email)`. Không sử dụng liên kết ẩn.
- Khai báo tất cả các node và note trước, sau đó mới khai báo các mũi tên chỉ luồng.

## 3. Quy tắc hoạt động

### Bước 1: Xác định chức năng cần kiểm thử
- Nhận đầu vào từ người dùng, xác định chức năng dựa trên code thực tế. Không tự ý gộp/tách luồng.

### Bước 2: Truy vết toàn bộ luồng thực thi
- Xác định đầy đủ API, hàm, điều kiện. Không suy đoán luồng xử lý.

### Bước 3: Xây dựng sơ đồ chức năng hoàn chỉnh
- Đúc kết sơ đồ. Hỏi người dùng xác nhận nếu có rẽ nhánh chưa rõ ràng.

## 4. Cấu trúc tài liệu đầu ra

Tạo thư mục `docs/white_box_testing/[ten_chuc_nang]/`.

### File 1: `01_service_source.md`
- Tổng hợp code logic của service trực tiếp xử lý chức năng và các hàm được gọi từ bên ngoài service (ví dụ: Util, Helper, Mapper, service khác) nếu có ảnh hưởng đến luồng, vào duy nhất một file Markdown. Không tạo thêm file riêng. Ghi rõ đường dẫn file gốc và tên hàm của code được bổ sung.
- Không sao chép trùng lặp các hàm nội bộ nếu đã nằm trong code logic service được trích dẫn. Không sửa code gốc của project.
- Đánh số node thống nhất trên toàn bộ nội dung file (đánh số trực tiếp trong code).
- **Quy tắc cho `&&` và `||`**: Phải đánh node riêng cho từng điều kiện con. Ví dụ `if (a && b)` đánh thành `[1] a` và `[2] b`. Không gộp chung toàn bộ biểu thức phức hợp.

### File 2: `02_control_flow_graph.puml`
- CFG cơ bản bằng PlantUML. Tuân thủ cấu trúc `template.puml`.
- **Tuyệt đối không dùng keyword `start` trực tiếp** để vẽ điểm bắt đầu vì sẽ bị lỗi hiển thị hình người (stickman). Phải khai báo: `usecase "start" as start_node` và dùng `start_node --> n1`.
- **Duy nhất một node kết thúc (`End`)**. Phải khai báo `usecase "Exit" as end_node`. Tất cả các nhánh (dù return sớm hay exception) đều phải đi đến node `End` duy nhất đó. Không dừng giữa chừng.
- Để tránh lỗi cú pháp ở các bản PlantUML cũ, hãy khai báo node dạng `usecase "1" as n1` thay vì `(1) as n1`.
- **Vẽ CFG cho `&&` (a && b, tới C nếu đúng, tới D nếu sai):** `a(false) → D`, `a(true) → b`, `b(false) → D`, `b(true) → C`.
- **Vẽ CFG cho `||` (a || b, tới C nếu đúng, tới D nếu sai):** `a(true) → C`, `a(false) → b`, `b(true) → C`, `b(false) → D`.
- Tuân thủ thứ tự đánh giá short-circuit.

### File 3: `03_independent_paths.md`
- Liệt kê các node điều kiện (kể cả các điều kiện con tách ra từ `&&`, `||`) và lý do.
- Tính số đường thi hành tuyến độc lập: `V(G) = P + 1`.

### File 4: `04_branch_test_cases.md`
- Bảng test case cho các nhánh CFG.
- **Bắt buộc bảng chỉ có đúng 3 cột**: `STT | Điều kiện đầu vào | Kết quả mong đợi`
- Không thêm bất kỳ cột nào khác.
- Test case bao phủ nhánh, tuân thủ short-circuit. Nhánh không thể đạt được thì ghi giải thích bên ngoài bảng.

### File 5: `05_data_flow_graph.puml`
- Đồ thị dòng dữ liệu chung.
- Khai báo node dạng `usecase "1" as n1`.
- Các thao tác `d`, `u`, `k`, `~d`, `~u`, `~k` **phải ghi rõ tên biến** (VD: `d(email)`).
- Không đặt các ký hiệu thao tác vào bên trong node. Các thao tác này phải nằm ở label riêng bên phải node thông qua cú pháp: `note right of n1 : d(email)`. Tuyệt đối không dùng cơ chế liên kết ẩn.
- Đảm bảo duy nhất một node `End` (`usecase "Exit" as end_node`).
- **Quy tắc Kill biến (k)**: 
  - Tổng hợp danh sách tất cả biến đã xuất hiện thao tác Definition (`d`) trong đồ thị.
  - Với từng biến trong danh sách, bắt buộc bổ sung thao tác Kill (`k`) tại node `Exit` duy nhất (ví dụ: `k(email)`, `k(userId)`).
  - Các thao tác Kill phải được thể hiện bằng label nằm bên phải node Exit thông qua cú pháp `note right of end_node : k(email)\nk(userId)`.
  - Không tạo thêm node Exit mới, không đặt label Kill bên trong node, và không được bỏ sót bất kỳ biến nào đã được Definition.

### File 6 trở đi: `06_liveness_[ten_bien].puml`
- Đồ thị liveness riêng cho từng biến. Duy nhất 1 `End`.
- Khai báo node thao tác dạng `usecase "d(email)" as n1`.
- Các node không có thao tác liên quan đến biến phải để trống hoàn toàn bằng cú pháp `usecase " " as n2` (Tuyệt đối không dùng `() as n2` hoặc `usecase ""` vì gây lỗi cú pháp).
- **Tuyệt đối không được tạo thêm note label cho node trắng**. Không tạo `note right`, `note left` hoặc bất kỳ note/label rỗng nào cho node trắng chỉ để căn chỉnh bố cục. Node trắng chỉ tồn tại để bảo toàn cấu trúc luồng đồ thị. Trước khi xuất file, phải kiểm tra và loại bỏ mọi note/label rỗng gắn với node trắng.
- **Quy tắc Kill biến (k)**: Nếu biến đang được phân tích có xuất hiện thao tác Definition (`d`) trong đồ thị, phải bổ sung thao tác Kill (`k`) của chính biến đó tại node Exit duy nhất (ví dụ: `k(email)`). Không đưa thao tác Kill của biến khác vào file liveness hiện tại. Không tạo thêm node Exit. Nếu biến không có Definition, không tự động thêm Kill và phải ghi rõ lý do.
- Cuối file có báo cáo kịch bản, chuỗi thao tác (kèm tên biến), và kết luận tính hợp lệ.

## 5. Quy tắc kiểm chứng & Chất lượng
- Không sửa code nghiệp vụ của project. 
- Mọi đồ thị phải tuân thủ quy tắc 1 node `End` duy nhất.
- Đảm bảo sự nhất quán trong việc chia tách các điều kiện con `&&` và `||` trên toàn bộ tài liệu (từ CFG, đường thi hành tới test case).
- **Kiểm chứng Kill biến**:
  - Đối chiếu danh sách biến có thao tác `d` với danh sách biến có thao tác `k` tại Exit. Bảo đảm mọi biến đã Definition đều có thao tác Kill tương ứng tại Exit.
  - Đối với từng file liveness, bảo đảm thao tác Kill chỉ áp dụng cho biến đang được phân tích.
  - Bảo đảm không có nhiều node Exit trong cùng một đồ thị, không làm thay đổi luồng điều khiển, và trình bày đúng cấu trúc template.

## 6. Checklist kiểm tra trước khi hoàn thành
- [ ] Đã tổng hợp đầy đủ các biến được Definition (`d`) trong `05_data_flow_graph.puml`.
- [ ] Mỗi biến đã Definition đều có label Kill (`k`) tại node Exit duy nhất.
- [ ] Tất cả file liveness đều có thao tác Kill tại Exit đối với biến đã Definition.
- [ ] Các thao tác Kill trong file liveness chỉ áp dụng cho biến đang phân tích.
- [ ] Không tạo thêm node Exit để biểu diễn Kill.
- [ ] Các label Kill tuân thủ đúng template `template.puml`.

> **Lưu ý sau khi hoàn thành quy trình:** Việc vẽ các sơ đồ kiểm thử đời sống biến (liveness) có thể vẫn còn thiếu sót. Nếu agent AI vô tình bỏ sót sơ đồ của bất kỳ biến nào, hãy nhắc nhở người dùng để tiếp tục thực hiện lại quy trình `/mkp-newWhiteBoxTesting` với biến bị thiếu đó.
