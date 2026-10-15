# Test case bao phủ nhánh

| STT | Điều kiện đầu vào | Kết quả mong đợi |
|---|---|---|
| 1 | `dto.search = 'khong_ton_tai'`, OpenSearch trả về `matchedIds = []` | Rẽ nhánh True tại [17], thực thi lệnh [18] trả về sớm ApiResponse với mảng rỗng `[]`, `totalItems = 0`, `totalPages = 0` |
| 2 | `dto.search = 'gom su'`, `matchedIds = ['p1', 'p2']`, `rawQuery.filters.categories = ['c1', 'c2']`, `minPrice = '100000'`, `maxPrice = '500000'`, `sortBy = 'price_asc'` | Thực thi các node gán [19], [23], [27], lọc giá BETWEEN 100000 AND 500000, thực thi lệnh [33] sắp xếp giá tăng dần |
| 3 | `rawQuery.filters.categories = 'c1'` (chuỗi đơn lẻ), `sortBy = 'price_desc'`, không tìm kiếm, không lọc giá | Rẽ nhánh False tại [4], thực thi lệnh [6] bọc mảng `['c1']`, thực thi [34] sắp xếp giá giảm dần |
| 4 | `rawQuery = {'filters[categories][0]': 'c1', 'filters[categories][1]': 'c2'}`, `sortBy = 'popularity'` | Regex khớp key [9], rẽ nhánh True tại [12], thực thi lệnh gán [13] (`categories = catValues`), thực thi [35] sắp xếp theo rating giảm dần |
| 5 | `rawQuery = {'otherKey': 'val'}`, không có filter categories, `sortBy = undefined` | Regex không khớp [9], rẽ nhánh False tại [12], bỏ qua [13], sắp xếp mặc định qua [36] theo createdAt giảm dần |
| 6 | `minPrice = '200000'`, `maxPrice = undefined`, không có tiêu chí sắp xếp | Rẽ nhánh False tại [26], rẽ nhánh True tại [28], thực thi lệnh [29] (`price >= 200000`), sắp xếp theo createdAt DESC |
| 7 | `minPrice = undefined`, `maxPrice = '800000'`, không có tiêu chí sắp xếp | Rẽ nhánh False tại [25], rẽ nhánh False tại [28], rẽ nhánh True tại [30], thực thi lệnh [31] (`price <= 800000`), sắp xếp theo createdAt DESC |
| 8 | `dto = {}`, `rawQuery = {}` (không truyền bất kỳ bộ lọc nào) | Bỏ qua toàn bộ các nhánh lọc, lấy danh sách sản phẩm với phân trang mặc định (`page = 1`, `pageSize = 50`), sắp xếp mới nhất tại [36] |
| 9 | `categories` tồn tại nhưng không phải là mảng (`Array.isArray(categories) = false`) | Rẽ nhánh False tại [21], bỏ qua node [23] gán điều kiện lọc danh mục của QueryBuilder |
| 10 | `categories = []` (mảng rỗng, `categories.length > 0 = false`) | Rẽ nhánh False tại [22], bỏ qua node [23] gán điều kiện lọc danh mục của QueryBuilder |
