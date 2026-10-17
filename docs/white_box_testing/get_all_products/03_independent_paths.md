# Các đường thi hành tuyến độc lập (Independent Paths) — `getAllProducts`

## 1. Danh sách các node điều kiện (Predicate Nodes)

Trong đồ thị luồng điều khiển (CFG), các node điều kiện là các node có từ 2 cạnh đi ra trở lên (out-degree $\ge 2$), đại diện cho các điểm rẽ nhánh của chương trình:

| STT | Node | Cú pháp / Biểu thức trong code | Loại điều kiện | Số nhánh | Lý do rẽ nhánh |
|:---:|:---:|---|---|:---:|---|
| 1 | **[3]** | `if (rawFiltersObj?.categories)` | Rẽ nhánh if | 2 | Kiểm tra `categories` có nằm trong object `filters` hay không: True (sang [4]), False (sang nhánh bóc tách regex [7]). |
| 2 | **[4]** | `Array.isArray(rawCats) ? ... : ...` | Toán tử 3 ngôi (Ternary) | 2 | Kiểm tra kiểu mảng của categories: True (gán trực tiếp [5]), False (bọc thành mảng 1 phần tử [6]). |
| 3 | **[8]** | `for (const key of Object.keys(rawQuery \|\| {}))` | Vòng lặp for | 2 | Duyệt các key của query param: Có key (vào [9]), Hết key / rỗng (thoát sang [11]). |
| 4 | **[9]** | `if (match)` | Rẽ nhánh if | 2 | Kiểm tra key có khớp regex `filters[categories][index]`: True (lưu map [10]), False (bỏ qua, quay lại [8]). |
| 5 | **[12]** | `if (catValues.length > 0)` | Rẽ nhánh if | 2 | Kiểm tra danh sách category bóc tách được: True (gán `categories = catValues` [13]), False (bỏ qua sang [14]). |
| 6 | **[15]** | `if (dto.search)` | Rẽ nhánh if | 2 | Kiểm tra có từ khóa tìm kiếm: True (gọi OpenSearch [16]), False (bỏ qua sang [20]). |
| 7 | **[17]** | `if (matchedIds.length === 0)` | Rẽ nhánh if | 2 | Kiểm tra kết quả OpenSearch: True (trả về sớm mảng rỗng [18]), False (tiếp tục thêm điều kiện vào qb [19]). |
| 8 | **[20]** | `if (categories && ...)` | Điều kiện 1 của short-circuit AND | 2 | Kiểm tra biến `categories` có truthy: True (đánh giá tiếp [21]), False (bỏ qua lọc danh mục sang [24]). |
| 9 | **[21]** | `Array.isArray(categories)` | Điều kiện 2 của short-circuit AND | 2 | Kiểm tra `categories` có phải mảng: True (đánh giá tiếp [22]), False (bỏ qua sang [24]). |
| 10 | **[22]** | `categories.length > 0` | Điều kiện 3 của short-circuit AND | 2 | Kiểm tra mảng `categories` không rỗng: True (thêm điều kiện `IN` [23]), False (bỏ qua sang [24]). |
| 11 | **[25]** | `if (!isNaN(parsedMin) && ...)` | Điều kiện 1 của short-circuit AND | 2 | Kiểm tra `minPrice` hợp lệ dạng số: True (đánh giá tiếp [26]), False (sang kiểm tra else-if [28]). |
| 12 | **[26]** | `!isNaN(parsedMax)` | Điều kiện 2 của short-circuit AND | 2 | Kiểm tra `maxPrice` hợp lệ dạng số: True (lọc `BETWEEN` [27]), False (chuyển sang else-if [28]). |
| 13 | **[28]** | `else if (!isNaN(parsedMin))` | Rẽ nhánh else-if | 2 | Kiểm tra chỉ có `minPrice` hợp lệ: True (lọc `>= minPrice` [29]), False (chuyển sang else-if [30]). |
| 14 | **[30]** | `else if (!isNaN(parsedMax))` | Rẽ nhánh else-if | 2 | Kiểm tra chỉ có `maxPrice` hợp lệ: True (lọc `<= maxPrice` [31]), False (bỏ qua lọc giá sang [32]). |
| 15 | **[32]** | `switch (sortBy)` | Lệnh switch-case | 4 | Chọn tiêu chí sắp xếp: `PRICE_LOW_TO_HIGH` [33], `PRICE_HIGH_TO_LOW` [34], `POPULARITY` [35], `NEWEST` / default [36]. |

---

## 2. Tính số đường thi hành tuyến độc lập

### Cách 1: Tính theo số cạnh và số đỉnh của đồ thị (Graph Formula)
- Số đỉnh (Nodes) $N = 40$ (bao gồm `start`, các node từ `[1]` đến `[38]`, và `Exit`).
- Số cạnh (Edges) $E = 56$.
- Số thành phần liên thông $P = 1$.

$$V(G) = E - N + 2P = 56 - 40 + 2 \times 1 = 18$$

### Cách 2: Tính theo số điểm quyết định (Predicate Nodes Formula)
Đồ thị có 14 nút điều kiện nhị phân (mỗi nút tăng $2 - 1 = 1$ nhánh độc lập) và 1 lệnh switch-case 4 nhánh (tăng $4 - 1 = 3$ nhánh độc lập):

$$P_{total} = (14 \times 1) + (1 \times 3) = 14 + 3 = 17$$
$$V(G) = P_{total} + 1 = 17 + 1 = 18$$

> **Kết luận**: Đồ thị có **độ phức tạp Cyclomatic $V(G) = 18$**.
> Do đó, tập cơ sở của phương pháp kiểm thử White Box (Basis Path Testing) gồm đúng **18 đường thi hành độc lập tuyến tính (18 Basis Paths)**, tương ứng với **18 Test Cases** cần thiết để bao phủ toàn bộ 100% câu lệnh (Statement Coverage) và 100% nhánh rẽ (Branch Coverage).

---

## 3. Danh sách 18 Đường thi hành độc lập (Basis Independent Paths)

Path 1: 1 → 2 → 3 → 4 → 5 → 14 → 15 → 16 → 17 → 18 → Exit
Path 2: 1 → 2 → 3 → 4 → 5 → 14 → 15 → 16 → 17 → 19 → 20 → 21 → 22 → 23 → 24 → 25 → 26 → 27 → 32 → 33 → 37 → 38 → Exit
Path 3: 1 → 2 → 3 → 4 → 6 → 14 → 15 → 20 → 21 → 22 → 23 → 24 → 25 → 26 → 28 → 29 → 32 → 34 → 37 → 38 → Exit
Path 4: 1 → 2 → 3 → 7 → 8 → 9 → 10 → 8 → 11 → 12 → 13 → 14 → 15 → 20 → 21 → 22 → 23 → 24 → 25 → 28 → 30 → 31 → 32 → 35 → 37 → 38 → Exit
Path 5: 1 → 2 → 3 → 7 → 8 → 9 → 8 → 11 → 12 → 14 → 15 → 20 → 24 → 25 → 28 → 30 → 32 → 36 → 37 → 38 → Exit
Path 6: 1 → 2 → 3 → 7 → 8 → 11 → 12 → 14 → 15 → 20 → 24 → 25 → 26 → 27 → 32 → 36 → 37 → 38 → Exit
Path 7: 1 → 2 → 3 → 7 → 8 → 11 → 12 → 14 → 15 → 20 → 24 → 25 → 26 → 28 → 29 → 32 → 33 → 37 → 38 → Exit
Path 8: 1 → 2 → 3 → 7 → 8 → 11 → 12 → 14 → 15 → 20 → 24 → 25 → 28 → 30 → 31 → 32 → 34 → 37 → 38 → Exit
Path 9: 1 → 2 → 3 → 7 → 8 → 11 → 12 → 14 → 15 → 20 → 24 → 25 → 28 → 30 → 32 → 35 → 37 → 38 → Exit
Path 10: 1 → 2 → 3 → 4 → 5 → 14 → 15 → 20 → 21 → 24 → 25 → 28 → 30 → 32 → 36 → 37 → 38 → Exit
Path 11: 1 → 2 → 3 → 4 → 5 → 14 → 15 → 20 → 21 → 22 → 24 → 25 → 28 → 30 → 32 → 36 → 37 → 38 → Exit
Path 12: 1 → 2 → 3 → 4 → 6 → 14 → 15 → 16 → 17 → 19 → 20 → 21 → 22 → 23 → 24 → 25 → 26 → 27 → 32 → 34 → 37 → 38 → Exit
Path 13: 1 → 2 → 3 → 7 → 8 → 9 → 10 → 8 → 11 → 12 → 13 → 14 → 15 → 16 → 17 → 19 → 20 → 21 → 22 → 23 → 24 → 25 → 26 → 28 → 29 → 32 → 35 → 37 → 38 → Exit
Path 14: 1 → 2 → 3 → 7 → 8 → 11 → 12 → 14 → 15 → 16 → 17 → 19 → 20 → 24 → 25 → 28 → 30 → 31 → 32 → 36 → 37 → 38 → Exit
Path 15: 1 → 2 → 3 → 7 → 8 → 11 → 12 → 14 → 15 → 16 → 17 → 19 → 20 → 24 → 25 → 28 → 30 → 32 → 33 → 37 → 38 → Exit
Path 16: 1 → 2 → 3 → 4 → 5 → 14 → 15 → 20 → 21 → 22 → 23 → 24 → 25 → 26 → 28 → 29 → 32 → 33 → 37 → 38 → Exit
Path 17: 1 → 2 → 3 → 4 → 6 → 14 → 15 → 20 → 21 → 22 → 23 → 24 → 25 → 28 → 30 → 31 → 32 → 35 → 37 → 38 → Exit
Path 18: 1 → 2 → 3 → 4 → 6 → 14 → 15 → 20 → 21 → 22 → 23 → 24 → 25 → 28 → 30 → 32 → 36 → 37 → 38 → Exit
