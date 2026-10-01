# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\search_filter_ui.spec.ts >> Giao diện - Tìm kiếm và bộ lọc sàn thương mại >> Hiển thị thông báo lỗi màu đỏ khi giá tối thiểu lớn hơn giá tối đa (MKP_014)
- Location: playwright\ui\search_filter_ui.spec.ts:12:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/Giá tối thiểu phải nhỏ hơn giá tối đa/i)
Expected: visible
Timeout: 3000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText(/Giá tối thiểu phải nhỏ hơn giá tối đa/i) with timeout 3000ms
  - waiting for getByText(/Giá tối thiểu phải nhỏ hơn giá tối đa/i)

```

```yaml
- banner:
  - link "MN MarketNest":
    - /url: /
  - textbox "Tìm kiếm tác phẩm thủ công, nghệ nhân..."
  - button:
    - img
  - navigation:
    - link "Khám phá":
      - /url: /
    - link "Danh mục":
      - /url: /categories
  - link:
    - /url: /cart
    - img
  - link "Đăng nhập":
    - /url: /login
- main:
  - heading "Khám phá Marketplace" [level=1]
  - paragraph: Nơi tập hợp những tác phẩm thủ công tinh xảo nhất từ cộng đồng nghệ nhân của chúng tôi.
  - complementary:
    - heading "Bộ lọc sản phẩm" [level=2]
    - heading "Sắp xếp theo" [level=3]
    - radio "Mới nhất" [checked]
    - text: Mới nhất
    - radio "Giá tăng dần"
    - text: Giá tăng dần
    - radio "Giá giảm dần"
    - text: Giá giảm dần
    - radio "Phổ biến nhất"
    - text: Phổ biến nhất
    - heading "Danh mục" [level=3]
    - checkbox "Bát đĩa gốm sứ 7"
    - text: Bát đĩa gốm sứ 7
    - checkbox "Ấm chén trà 5"
    - text: Ấm chén trà 5
    - checkbox "Bình hoa gốm 6"
    - text: Bình hoa gốm 6
    - checkbox "Đồ gốm trang trí 5"
    - text: Đồ gốm trang trí 5
    - heading "Khoảng giá (VNĐ)" [level=3]
    - textbox "Tối thiểu": "500000"
    - text: "-"
    - textbox "Tối đa": "100000"
    - button "Áp dụng bộ lọc"
    - button "Xóa tất cả"
  - paragraph: 23 tác phẩm
  - link "Phễu đan tre -10% Phễu đan tre 50.000đ 45.000đ":
    - /url: /pheu-dan-tre-pe2f6a99e-0fa6-4928-b846-1e7cd29f7ea4
    - img "Phễu đan tre"
    - text: "-10%"
    - heading "Phễu đan tre" [level=3]
    - text: 50.000đ 45.000đ
    - button "Thêm vào giỏ hàng":
      - img
  - link "giỏ đan sợi mây giỏ đan sợi mây 120.000đ":
    - /url: /gio-dan-soi-may-p79268256-cf4c-4a67-a324-f319569b0daf
    - img "giỏ đan sợi mây"
    - heading "giỏ đan sợi mây" [level=3]
    - text: 120.000đ
    - button "Thêm vào giỏ hàng":
      - img
  - link "Đồ thủ công dân gian Đồ thủ công dân gian 100.000đ":
    - /url: /do-thu-cong-dan-gian-pcf7adde0-0e26-4f34-b5cd-4bbbfa566f84
    - img "Đồ thủ công dân gian"
    - heading "Đồ thủ công dân gian" [level=3]
    - text: 100.000đ
    - button "Thêm vào giỏ hàng":
      - img
  - link "Đèn xông tinh dầu thấu quang -12% Đèn xông tinh dầu thấu quang 250.000đ 220.000đ":
    - /url: /den-xong-tinh-dau-thau-quang-pprod0020-0000-0000-0000-000000000020
    - img "Đèn xông tinh dầu thấu quang"
    - text: "-12%"
    - heading "Đèn xông tinh dầu thấu quang" [level=3]
    - text: 250.000đ 220.000đ
    - button "Thêm vào giỏ hàng":
      - img
  - link "Tượng Phật Di Lặc dâng vàng -20% Tượng Phật Di Lặc dâng vàng 1.500.000đ 1.200.000đ":
    - /url: /tuong-phat-di-lac-dang-vang-pprod0019-0000-0000-0000-000000000019
    - img "Tượng Phật Di Lặc dâng vàng"
    - text: "-20%"
    - heading "Tượng Phật Di Lặc dâng vàng" [level=3]
    - text: 1.500.000đ 1.200.000đ
    - button "Thêm vào giỏ hàng":
      - img
  - link "Thác nước phong thủy gốm sứ -20% Thác nước phong thủy gốm sứ 1.200.000đ 950.000đ":
    - /url: /thac-nuoc-phong-thuy-gom-su-pprod0018-0000-0000-0000-000000000018
    - img "Thác nước phong thủy gốm sứ"
    - text: "-20%"
    - heading "Thác nước phong thủy gốm sứ" [level=3]
    - text: 1.200.000đ 950.000đ
    - button "Thêm vào giỏ hàng":
      - img
  - link "Tượng chú tiểu ngồi thiền Tượng chú tiểu ngồi thiền 150.000đ":
    - /url: /tuong-chu-tieu-ngoi-thien-pprod0017-0000-0000-0000-000000000017
    - img "Tượng chú tiểu ngồi thiền"
    - heading "Tượng chú tiểu ngồi thiền" [level=3]
    - text: 150.000đ
    - button "Thêm vào giỏ hàng":
      - img
  - link "Lư xông trầm hương gốm sứ -20% Lư xông trầm hương gốm sứ 350.000đ 280.000đ":
    - /url: /lu-xong-tram-huong-gom-su-pprod0016-0000-0000-0000-000000000016
    - img "Lư xông trầm hương gốm sứ"
    - text: "-20%"
    - heading "Lư xông trầm hương gốm sứ" [level=3]
    - text: 350.000đ 280.000đ
    - button "Thêm vào giỏ hàng":
      - img
  - link "Bình cắm hoa men kết tinh cao cấp -16% Bình cắm hoa men kết tinh cao cấp 1.800.000đ 1.500.000đ":
    - /url: /binh-cam-hoa-men-ket-tinh-cao-cap-pprod0015-0000-0000-0000-000000000015
    - img "Bình cắm hoa men kết tinh cao cấp"
    - text: "-16%"
    - heading "Bình cắm hoa men kết tinh cao cấp" [level=3]
    - text: 1.800.000đ 1.500.000đ
    - button "Thêm vào giỏ hàng":
      - img
  - link "Set 3 lọ hoa mini decor bàn làm việc -16% Set 3 lọ hoa mini decor bàn làm việc 300.000đ 250.000đ":
    - /url: /set-3-lo-hoa-mini-decor-ban-lam-viec-pprod0014-0000-0000-0000-000000000014
    - img "Set 3 lọ hoa mini decor bàn làm việc"
    - text: "-16%"
    - heading "Set 3 lọ hoa mini decor bàn làm việc" [level=3]
    - text: 300.000đ 250.000đ
    - button "Thêm vào giỏ hàng":
      - img
  - link "Bình gốm vuốt tay dáng bom -10% Bình gốm vuốt tay dáng bom 950.000đ 850.000đ":
    - /url: /binh-gom-vuot-tay-dang-bom-pprod0013-0000-0000-0000-000000000013
    - img "Bình gốm vuốt tay dáng bom"
    - text: "-10%"
    - heading "Bình gốm vuốt tay dáng bom" [level=3]
    - text: 950.000đ 850.000đ
    - button "Thêm vào giỏ hàng":
      - img
  - link "Lọ hoa tỏi men rạn họa tiết chuồn chuồn -15% Lọ hoa tỏi men rạn họa tiết chuồn chuồn 650.000đ 550.000đ":
    - /url: /lo-hoa-toi-men-ran-hoa-tiet-chuon-chuon-pprod0012-0000-0000-0000-000000000012
    - img "Lọ hoa tỏi men rạn họa tiết chuồn chuồn"
    - text: "-15%"
    - heading "Lọ hoa tỏi men rạn họa tiết chuồn chuồn" [level=3]
    - text: 650.000đ 550.000đ
    - button "Thêm vào giỏ hàng":
      - img
  - link "Bình hoa gốm mộc dáng chuông -12% Bình hoa gốm mộc dáng chuông 400.000đ 350.000đ":
    - /url: /binh-hoa-gom-moc-dang-chuong-pprod0011-0000-0000-0000-000000000011
    - img "Bình hoa gốm mộc dáng chuông"
    - text: "-12%"
    - heading "Bình hoa gốm mộc dáng chuông" [level=3]
    - text: 400.000đ 350.000đ
    - button "Thêm vào giỏ hàng":
      - img
  - link "Chén tống tống trà thủy tinh -20% Chén tống tống trà thủy tinh 150.000đ 120.000đ":
    - /url: /chen-tong-tong-tra-thuy-tinh-pprod0010-0000-0000-0000-000000000010
    - img "Chén tống tống trà thủy tinh"
    - text: "-20%"
    - heading "Chén tống tống trà thủy tinh" [level=3]
    - text: 150.000đ 120.000đ
    - button "Thêm vào giỏ hàng":
      - img
  - link "Bộ kỷ trà đắp nổi hoa mai -20% Bộ kỷ trà đắp nổi hoa mai 1.200.000đ 950.000đ":
    - /url: /bo-ky-tra-dap-noi-hoa-mai-pprod0009-0000-0000-0000-000000000009
    - img "Bộ kỷ trà đắp nổi hoa mai"
    - text: "-20%"
    - heading "Bộ kỷ trà đắp nổi hoa mai" [level=3]
    - text: 1.200.000đ 950.000đ
    - button "Thêm vào giỏ hàng":
      - img
  - link "Ấm trà gốm mộc vuốt tay Ấm trà gốm mộc vuốt tay 450.000đ":
    - /url: /am-tra-gom-moc-vuot-tay-pprod0008-0000-0000-0000-000000000008
    - img "Ấm trà gốm mộc vuốt tay"
    - heading "Ấm trà gốm mộc vuốt tay" [level=3]
    - text: 450.000đ
    - button "Thêm vào giỏ hàng":
      - img
  - link "Bộ ấm chén men ngọc sương -18% Bộ ấm chén men ngọc sương 800.000đ 650.000đ":
    - /url: /bo-am-chen-men-ngoc-suong-pprod0007-0000-0000-0000-000000000007
    - img "Bộ ấm chén men ngọc sương"
    - text: "-18%"
    - heading "Bộ ấm chén men ngọc sương" [level=3]
    - text: 800.000đ 650.000đ
    - button "Thêm vào giỏ hàng":
      - img
  - link "Bộ ấm trà tử sa Nghi Hưng -7% Bộ ấm trà tử sa Nghi Hưng 2.000.000đ 1.850.000đ":
    - /url: /bo-am-tra-tu-sa-nghi-hung-pprod0006-0000-0000-0000-000000000006
    - img "Bộ ấm trà tử sa Nghi Hưng"
    - text: "-7%"
    - heading "Bộ ấm trà tử sa Nghi Hưng" [level=3]
    - text: 2.000.000đ 1.850.000đ
    - button "Thêm vào giỏ hàng":
      - img
  - link "Đĩa decor hình chiếc lá -21% Đĩa decor hình chiếc lá 190.000đ 150.000đ":
    - /url: /dia-decor-hinh-chiec-la-pprod0005-0000-0000-0000-000000000005
    - img "Đĩa decor hình chiếc lá"
    - text: "-21%"
    - heading "Đĩa decor hình chiếc lá" [level=3]
    - text: 190.000đ 150.000đ
    - button "Thêm vào giỏ hàng":
      - img
  - link "Tô canh gốm Nhật họa tiết sóng Tô canh gốm Nhật họa tiết sóng 220.000đ":
    - /url: /to-canh-gom-nhat-hoa-tiet-song-pprod0004-0000-0000-0000-000000000004
    - img "Tô canh gốm Nhật họa tiết sóng"
    - heading "Tô canh gốm Nhật họa tiết sóng" [level=3]
    - text: 220.000đ
    - button "Thêm vào giỏ hàng":
      - img
  - link "Set 6 bát cơm men hỏa biến -18% Set 6 bát cơm men hỏa biến 550.000đ 450.000đ":
    - /url: /set-6-bat-com-men-hoa-bien-pprod0003-0000-0000-0000-000000000003
    - img "Set 6 bát cơm men hỏa biến"
    - text: "-18%"
    - heading "Set 6 bát cơm men hỏa biến" [level=3]
    - text: 550.000đ 450.000đ
    - button "Thêm vào giỏ hàng":
      - img
  - link "Đĩa gốm men rạn giả cổ -10% Đĩa gốm men rạn giả cổ 200.000đ 180.000đ":
    - /url: /dia-gom-men-ran-gia-co-pprod0002-0000-0000-0000-000000000002
    - img "Đĩa gốm men rạn giả cổ"
    - text: "-10%"
    - heading "Đĩa gốm men rạn giả cổ" [level=3]
    - text: 200.000đ 180.000đ
    - button "Thêm vào giỏ hàng":
      - img
  - link "Bộ bát đĩa hoa mặt trời men kem Bộ bát đĩa hoa mặt trời men kem 1.500.000đ":
    - /url: /bo-bat-dia-hoa-mat-troi-men-kem-pprod0001-0000-0000-0000-000000000001
    - img "Bộ bát đĩa hoa mặt trời men kem"
    - heading "Bộ bát đĩa hoa mặt trời men kem" [level=3]
    - text: 1.500.000đ
    - button "Thêm vào giỏ hàng":
      - img
- contentinfo:
  - heading "MarketNest" [level=3]
  - paragraph: Tôn vinh giá trị thủ công và những câu chuyện đằng sau mỗi tác phẩm. Nơi kết nối những tâm hồn yêu nghệ thuật và những bàn tay tài hoa trên toàn thế giới.
  - heading "Khám phá" [level=4]
  - list:
    - listitem:
      - link "Tác phẩm mới":
        - /url: "#"
    - listitem:
      - link "Gốm sứ & Điêu khắc":
        - /url: "#"
    - listitem:
      - link "Đồ da thủ công":
        - /url: "#"
    - listitem:
      - link "Nghệ nhân nổi bật":
        - /url: "#"
  - heading "Hỗ trợ" [level=4]
  - list:
    - listitem:
      - link "Trung tâm trợ giúp":
        - /url: "#"
    - listitem:
      - link "Vận chuyển & Trả hàng":
        - /url: "#"
    - listitem:
      - link "Trở thành người bán":
        - /url: "#"
    - listitem:
      - link "Chính sách bảo mật":
        - /url: "#"
  - paragraph: © 2026 MarketNest. All rights reserved.
  - text: Sáng tạo • Bền vững • Cộng đồng
- img
- text: Không tìm thấy mã sản phẩm
- img
- text: Không tìm thấy mã sản phẩm
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Giao diện - Tìm kiếm và bộ lọc sàn thương mại', () => {
  4  |   test('Hiển thị ô nhập tìm kiếm và các tùy chọn lọc trên trang Marketplace (MKP_011)', async ({ page }) => {
  5  |     await page.goto('/marketplace', { waitUntil: 'domcontentloaded' });
  6  | 
  7  |     await expect(page.getByPlaceholder('Tối thiểu')).toBeVisible({ timeout: 10000 });
  8  |     await expect(page.getByPlaceholder('Tối đa')).toBeVisible();
  9  |     await expect(page.getByRole('button', { name: 'Áp dụng bộ lọc' })).toBeVisible();
  10 |   });
  11 | 
  12 |   test('Hiển thị thông báo lỗi màu đỏ khi giá tối thiểu lớn hơn giá tối đa (MKP_014)', async ({ page }) => {
  13 |     await page.goto('/marketplace', { waitUntil: 'domcontentloaded' });
  14 | 
  15 |     await expect(page.getByPlaceholder('Tối thiểu')).toBeVisible({ timeout: 10000 });
  16 |     await page.getByPlaceholder('Tối thiểu').fill('500000');
  17 |     await page.getByPlaceholder('Tối đa').fill('100000');
  18 |     await page.getByRole('button', { name: 'Áp dụng bộ lọc' }).click();
  19 | 
  20 |     // Kết quả mong đợi theo tài liệu kiểm thử MKP_014:
  21 |     // Hiển thị thông báo lỗi kiểm tra: Giá tối thiểu phải nhỏ hơn giá tối đa
> 22 |     await expect(page.getByText(/Giá tối thiểu phải nhỏ hơn giá tối đa/i)).toBeVisible({ timeout: 3000 });
     |                                                                            ^ Error: expect(locator).toBeVisible() failed
  23 |   });
  24 | 
  25 |   test('Áp dụng tùy chọn sắp xếp sản phẩm chính xác (MKP_015)', async ({ page }) => {
  26 |     await page.goto('/marketplace', { waitUntil: 'domcontentloaded' });
  27 | 
  28 |     const sortOption = page.locator('label', { hasText: 'Giá tăng dần' });
  29 |     if (await sortOption.isVisible({ timeout: 5000 })) {
  30 |       await sortOption.click();
  31 |       await page.getByRole('button', { name: 'Áp dụng bộ lọc' }).click();
  32 |       await expect(page).toHaveURL(/sortBy=PRICE_LOW_TO_HIGH/, { timeout: 5000 });
  33 |     }
  34 |   });
  35 | });
  36 | 
```