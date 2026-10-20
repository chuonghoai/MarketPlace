# 04. Bảng Test Cases bao phủ nhánh (Branch Coverage)

| Kịch bản | Mã test case | Đường thi hành | Điều kiện đầu vào | Kết quả mong đợi | Trạng thái |
|:---|:---|:---|:---|:---|:---:|
| Kịch bản 1 | TC01 | 1 -> 2 -> 3 -> 4 -> Exit | `!category` = true (categoryId không hợp lệ) | Ném ra `CustomException` 'Danh mục không tồn tại' | Pass |
| Kịch bản 2 | TC02 | 1 -> 2 -> 3 -> 5 -> 6 -> 7 -> 8 -> 13 -> 14 -> Exit | `!category` = false, `mediaPublicIds` = null/undefined | Tạo product thành công, không gọi `confirmUpload` | Pass |
| Kịch bản 3 | TC03 | 1 -> 2 -> 3 -> 5 -> 6 -> 7 -> 8 -> 9 -> 13 -> 14 -> Exit | `!category` = false, `mediaPublicIds` = [] (mảng rỗng) | Tạo product thành công, không gọi `confirmUpload` | Pass |
| Kịch bản 4 | TC04 | 1 -> 2 -> 3 -> 5 -> 6 -> 7 -> 8 -> 9 -> 10 -> 13 -> 14 -> Exit | `!category` = false, `mediaPublicIds` = ['id1'], `confirmUpload` success | Tạo product thành công, gọi `confirmUpload` thành công | Pass |
| Kịch bản 5 | TC05 | 1 -> 2 -> 3 -> 5 -> 6 -> 7 -> 8 -> 9 -> 10 -> 11 -> 12 -> 13 -> 14 -> Exit | `!category` = false, `mediaPublicIds` = ['id2'], `confirmUpload` throw Error | Tạo product thành công, hệ thống log warning lỗi media | Pass |
