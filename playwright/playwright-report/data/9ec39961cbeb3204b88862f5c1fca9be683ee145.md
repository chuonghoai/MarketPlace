# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\profile_ui.spec.ts >> Giao diện - Hồ sơ cá nhân >> Cập nhật thông tin cá nhân phải lập tức đồng bộ lên thanh điều hướng sidebar mà không cần tải lại trang (MKP_026)
- Location: playwright\ui\profile_ui.spec.ts:16:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('aside').getByText('Client 1790854434938')
Expected: visible
Timeout: 3000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('aside').getByText('Client 1790854434938') with timeout 3000ms
  - waiting for locator('aside').getByText('Client 1790854434938')

```

```yaml
- banner:
  - link "MN MarketNest":
    - /url: /
  - textbox "Tìm kiếm tác phẩm thủ công, nghệ nhân...": Client 1790854434938
  - button:
    - img
  - navigation:
    - link "Khám phá":
      - /url: /
    - link "Danh mục":
      - /url: /categories
  - link "1":
    - /url: /cart
    - img
    - text: "1"
  - img "Client Tester 1790854365812"
  - button "Client Tester 1790854365812"
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
    - textbox "Tối thiểu"
    - text: "-"
    - textbox "Tối đa"
    - button "Áp dụng bộ lọc"
    - button "Xóa tất cả"
  - paragraph: 0 tác phẩm
  - img
  - heading "Không tìm thấy tác phẩm nào" [level=3]
  - paragraph: Rất tiếc, chúng tôi không tìm thấy sản phẩm nào phù hợp với bộ lọc hoặc tìm kiếm của bạn. Hãy thử điều chỉnh lại mức giá, danh mục hoặc từ khóa để khám phá thêm nhé.
  - button "Xóa tất cả bộ lọc"
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
- text: Cập nhật hồ sơ thành công
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { loginViaUI } from '../helpers/auth.helper';
  3  | 
  4  | test.describe('Giao diện - Hồ sơ cá nhân', () => {
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await loginViaUI(page);
  7  |   });
  8  | 
  9  |   test('Hiển thị trang thông tin cá nhân và nút chỉnh sửa', async ({ page }) => {
  10 |     await page.goto('/profile/dashboard', { waitUntil: 'domcontentloaded' });
  11 | 
  12 |     await expect(page.getByRole('heading', { name: 'Thông tin cá nhân' })).toBeVisible({ timeout: 10000 });
  13 |     await expect(page.getByRole('button', { name: 'Chỉnh sửa' })).toBeVisible();
  14 |   });
  15 | 
  16 |   test('Cập nhật thông tin cá nhân phải lập tức đồng bộ lên thanh điều hướng sidebar mà không cần tải lại trang (MKP_026)', async ({ page }) => {
  17 |     await page.goto('/profile/dashboard', { waitUntil: 'domcontentloaded' });
  18 |     await expect(page.getByRole('button', { name: 'Chỉnh sửa' })).toBeVisible({ timeout: 10000 });
  19 | 
  20 |     await page.getByRole('button', { name: 'Chỉnh sửa' }).click();
  21 | 
  22 |     const newName = `Client ${Date.now()}`;
  23 |     const nameInput = page.locator('input[placeholder*="họ và tên" i], input[value]').first();
  24 |     if (await nameInput.isVisible()) {
  25 |       await nameInput.fill(newName);
  26 |     }
  27 | 
  28 |     const saveBtn = page.getByRole('button', { name: /Lưu thay đổi|Lưu/i });
  29 |     if (await saveBtn.isVisible()) {
  30 |       await saveBtn.click();
  31 |     }
  32 | 
  33 |     // Kết quả mong đợi theo tài liệu kiểm thử MKP_026:
  34 |     // Tên mới phải cập nhật ngay trên thanh sidebar mà không cần F5 lại trang
  35 |     const sidebar = page.locator('aside');
> 36 |     await expect(sidebar.getByText(newName)).toBeVisible({ timeout: 3000 });
     |                                              ^ Error: expect(locator).toBeVisible() failed
  37 |   });
  38 | });
  39 | 
```