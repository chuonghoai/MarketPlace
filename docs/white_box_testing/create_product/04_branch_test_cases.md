# 04. Bảng Test Cases bao phủ nhánh (Branch Coverage)

| STT | Điều kiện đầu vào | Kết quả mong đợi |
| --- | --- | --- |
| 1 | `!category` = true (categoryId không hợp lệ) | Ném ra `CustomException` 'Danh mục không tồn tại' |
| 2 | `!category` = false, `mediaPublicIds` = null/undefined | Tạo product thành công, không gọi `confirmUpload` |
| 3 | `!category` = false, `mediaPublicIds` = [] (mảng rỗng) | Tạo product thành công, không gọi `confirmUpload` |
| 4 | `!category` = false, `mediaPublicIds` = ['id1'], `confirmUpload` success | Tạo product thành công, gọi `confirmUpload` thành công |
| 5 | `!category` = false, `mediaPublicIds` = ['id2'], `confirmUpload` throw Error | Tạo product thành công, hệ thống log warning lỗi media |
