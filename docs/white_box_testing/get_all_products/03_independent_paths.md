# Các đường thi hành tuyến độc lập

## 1. Danh sách các node điều kiện

- **[3]**: `rawFiltersObj?.categories` (Kiểm tra categories có trong filters object)
- **[4]**: `Array.isArray(rawCats)` (Kiểm tra rawCats là mảng hay chuỗi đơn lẻ)
- **[8]**: `for key of Object.keys(rawQuery)` (Vòng lặp duyệt các key trong query params)
- **[9]**: `match` (Kiểm tra key có khớp regex `filters[categories][index]`)
- **[12]**: `catValues.length > 0` (Kiểm tra danh sách category trích xuất từ regex có phần tử)
- **[15]**: `dto.search` (Kiểm tra có từ khóa tìm kiếm hay không)
- **[17]**: `matchedIds.length === 0` (Kiểm tra danh sách ID khớp từ OpenSearch có rỗng không)
- **[20]**: `categories` (Kiểm tra categories có tồn tại)
- **[21]**: `Array.isArray(categories)` (Kiểm tra categories là mảng)
- **[22]**: `categories.length > 0` (Kiểm tra mảng categories không rỗng)
- **[25]**: `!isNaN(parsedMin)` (Kiểm tra minPrice hợp lệ dạng số)
- **[26]**: `!isNaN(parsedMax)` (Kiểm tra maxPrice hợp lệ dạng số)
- **[28]**: `!isNaN(parsedMin)` (Kiểm tra chỉ có minPrice hợp lệ)
- **[30]**: `!isNaN(parsedMax)` (Kiểm tra chỉ có maxPrice hợp lệ)
- **[32]**: `switch (sortBy)` (Rẽ 4 nhánh sắp xếp: PRICE_LOW_TO_HIGH, PRICE_HIGH_TO_LOW, POPULARITY, NEWEST/mặc định)

## 2. Tính số đường thi hành tuyến độc lập

Số lượng điều kiện (P) = 17
V(G) = P + 1 = 17 + 1 = 18

## 3. Các đường thi hành độc lập

Hệ thống có 10 đường cơ sở độc lập bao phủ toàn bộ 38 nút và các nhánh rẽ:

- **Path 1**: `start -> 1 -> 2 -> 3 -> 4 -> 5 -> 14 -> 15 -> 16 -> 17 -> 18 -> Exit`
- **Path 2**: `start -> 1 -> 2 -> 3 -> 4 -> 5 -> 14 -> 15 -> 16 -> 17 -> 19 -> 20 -> 21 -> 22 -> 23 -> 24 -> 25 -> 26 -> 27 -> 32 -> 33 -> 37 -> 38 -> Exit`
- **Path 3**: `start -> 1 -> 2 -> 3 -> 4 -> 6 -> 14 -> 15 -> 20 -> 21 -> 22 -> 23 -> 24 -> 25 -> 28 -> 30 -> 32 -> 34 -> 37 -> 38 -> Exit`
- **Path 4**: `start -> 1 -> 2 -> 3 -> 7 -> 8 -> 9 -> 10 -> 8 -> 11 -> 12 -> 13 -> 14 -> 15 -> 20 -> 21 -> 22 -> 23 -> 24 -> 25 -> 28 -> 30 -> 32 -> 35 -> 37 -> 38 -> Exit`
- **Path 5**: `start -> 1 -> 2 -> 3 -> 7 -> 8 -> 9 -> 8 -> 11 -> 12 -> 14 -> 15 -> 20 -> 24 -> 25 -> 28 -> 30 -> 32 -> 36 -> 37 -> 38 -> Exit`
- **Path 6**: `start -> 1 -> 2 -> 3 -> 7 -> 8 -> 11 -> 12 -> 14 -> 15 -> 20 -> 24 -> 25 -> 26 -> 28 -> 29 -> 32 -> 36 -> 37 -> 38 -> Exit`
- **Path 7**: `start -> 1 -> 2 -> 3 -> 7 -> 8 -> 11 -> 12 -> 14 -> 15 -> 20 -> 24 -> 25 -> 28 -> 30 -> 31 -> 32 -> 36 -> 37 -> 38 -> Exit`
- **Path 8**: `start -> 1 -> 2 -> 3 -> 7 -> 8 -> 11 -> 12 -> 14 -> 15 -> 20 -> 24 -> 25 -> 28 -> 30 -> 32 -> 36 -> 37 -> 38 -> Exit`
- **Path 9**: `start -> 1 -> 2 -> 3 -> 4 -> 5 -> 14 -> 15 -> 20 -> 21 -> 24 -> 25 -> 28 -> 30 -> 32 -> 36 -> 37 -> 38 -> Exit`
- **Path 10**: `start -> 1 -> 2 -> 3 -> 4 -> 5 -> 14 -> 15 -> 20 -> 21 -> 22 -> 24 -> 25 -> 28 -> 30 -> 32 -> 36 -> 37 -> 38 -> Exit`
