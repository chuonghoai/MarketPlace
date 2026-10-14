# 04. Bảng Test Cases bao phủ nhánh (Branch Coverage)

| STT | Điều kiện đầu vào | Kết quả mong đợi |
| --- | --- | --- |
| 1 | `request.reviews = []` (Mảng đánh giá rỗng) | Không thực hiện lặp, trả về `{ submittedCount: 0 }` |
| 2 | `request.reviews` có 1 phần tử, `orderItemId` không tồn tại (`!orderItem = true`) | Bỏ qua phần tử qua `continue`, trả về `{ submittedCount: 0 }` |
| 3 | `request.reviews` có 1 phần tử, `orderItem` tồn tại nhưng đã đánh giá (`!orderItem = false`, `orderItem.isReviewed = true`) | Bỏ qua phần tử qua `continue`, trả về `{ submittedCount: 0 }` |
| 4 | `request.reviews` có 1 phần tử hợp lệ (`!orderItem = false`, `orderItem.isReviewed = false`), query trung bình rating trả về `result = null` (`result = false`) | Lưu review, gán `isReviewed = true`, gán `avg = 0`, cập nhật rating sản phẩm = 0, trả về `{ submittedCount: 1 }` |
| 5 | `request.reviews` có 1 phần tử hợp lệ, query trả về `result` tồn tại nhưng `result.avgRating = null` (`result = true`, `result.avgRating = false`) | Lưu review, gán `isReviewed = true`, gán `avg = 0`, cập nhật rating sản phẩm = 0, trả về `{ submittedCount: 1 }` |
| 6 | `request.reviews` có 1 phần tử hợp lệ, query trả về `result` tồn tại và `result.avgRating = 4.5` (`result = true`, `result.avgRating = true`) | Lưu review, gán `isReviewed = true`, tính `avg = 4.5`, cập nhật rating sản phẩm = 4.5, trả về `{ submittedCount: 1 }` |
| 7 | `request.reviews` có 2 phần tử (1 phần tử hợp lệ và 1 phần tử đã review `orderItem.isReviewed = true`) | Thực hiện lặp 2 lần, chỉ lưu và cập nhật sản phẩm cho phần tử hợp lệ, trả về `{ submittedCount: 1 }` |
