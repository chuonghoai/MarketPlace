# Marketplace Web Design System

## 1. Tổng quan & Tinh thần thiết kế (Design Philosophy)

Marketplace là nền tảng sàn thương mại điện tử mua sắm hiện đại, mang phong cách **Artisan & Warm Editorial**, đem lại cảm giác tin cậy, ấm áp, cao cấp và tràn đầy cảm hứng mua sắm.

### Giá trị cốt lõi:
- **Ấm cúng & Cao cấp (Warm & Premium):** Sử dụng gam màu Terracotta / Burnt Orange phối cùng nền Warm Cream (`#FFFBF5`) tạo sự gần gũi nhưng sang trọng.
- **Rõ ràng & Dễ thao tác (Clarity & Usability):** Thông tin sản phẩm, giá cả, đánh giá và giỏ hàng được tổ chức mạch lạc, nổi bật nút Call-To-Action (CTA).
- **Nhất quán theo Design Token:** Mọi màu sắc, phông chữ, khoảng cách và bo góc đều tuân thủ Design Tokens được khai báo trong `src/index.css`.

---

## 2. Hệ thống màu sắc (Color Tokens)

Toàn bộ màu sắc được định nghĩa trong `@theme` tại `web/src/index.css`:

### 2.1 Brand & Neutral Palette
| Token Variable | Tailwind Class | Hex Code | Ý nghĩa / Mục đích sử dụng |
|---|---|---|---|
| `--color-primary` | `text-primary`, `bg-primary` | `#9b2f00` | Deep Terracotta - Màu thương hiệu chính khi hover |
| `--color-primary-container` | `bg-primary-container` | `#C2410C` | Primary Action / CTA Button, Highlight chính |
| `--color-on-primary-container` | `text-on-primary-container` | `#ffece7` | Chữ trên nền Primary Container |
| `--color-secondary` | `text-secondary`, `bg-secondary` | `#7d562d` | Earthy Brown - Nhấn phụ, nhãn phụ, tag đặc biệt |
| `--color-tertiary` | `text-tertiary`, `bg-tertiary` | `#3f5d1d` | Organic Olive Green - Nhãn ưu đãi, voucher, eco tags |
| `--color-background-page` | `bg-background-page` | `#FFFBF5` | Nền trang tổng thể (Warm Cream) |
| `--color-surface-card` | `bg-surface-card` | `#FFFFFF` | Nền Card sản phẩm, Modal, Box nội dung |
| `--color-surface-container` | `bg-surface-container` | `#f4ede6` | Nền bảng, dải phân cách nhẹ |
| `--color-text-ink` | `text-text-ink` | `#1C1917` | Màu chữ chính (Dark Charcoal) |
| `--color-text-muted` | `text-text-muted` | `#78726f` | Màu chữ phụ, mô tả, ngày tháng |
| `--color-border-subtle` | `border-border-subtle` | `#E7E5E4` | Đường viền mỏng giữa các card |
| `--color-border-medium` | `border-border-medium` | `#D6D3D1` | Đường viền input field, table border |

### 2.2 Semantic Status Colors
| Trạng thái | Hex Code | Sử dụng cho |
|---|---|---|
| **Success** | `#22C55E` | Đặt hàng thành công, còn hàng, thanh toán hoàn tất |
| **Warning** | `#F59E0B` | Sắp hết hàng, đơn hàng đang chờ xử lý |
| **Error** | `#DC2626` / `#ba1a1a` | Lỗi validation, hết hàng, hủy đơn, lỗi mạng |
| **Info** | `#3B82F6` | Thông báo hệ thống, mã vận đơn, trợ giúp |

---

## 3. Hệ thống Typography (Phông chữ)

Ứng dụng kết hợp 3 phông chữ chuẩn Google Fonts:

```css
--font-headline: "Lora", serif;           /* Tiêu đề trang, Banner, Tên sản phẩm nổi bật */
--font-body: "Open Sans", sans-serif;      /* Nội dung chính, mô tả, nút bấm, bảng dữ liệu */
--font-mono: "Source Code Pro", monospace; /* Mã đơn hàng, SKU, Mã giảm giá, Số tiền */
```

### Quy tắc sử dụng Typography:
- `font-headline`: Dùng cho `<h1>`, `<h2>`, tên sản phẩm lớn trên Hero / Product Detail để tạo chất liệu cao cấp.
- `font-body`: Dùng cho toàn bộ UI body text, input, button, table cells.
- `font-mono`: Dùng cho mã voucher (`DISCOUNT20`), mã đơn hàng (`#ORD-9821`), số liệu kỹ thuật.

---

## 4. UI Utilities & Class chuẩn

Các utility class dùng chung được khai báo tại `@layer utilities` trong `src/index.css`:

### 4.1 Button Classes
- `.btn-primary`: Nền `--color-primary-container` (`#C2410C`), chữ trắng kem, hover chuyển sang `--color-primary` (`#9b2f00`). Dùng cho CTA chính ("Mua ngay", "Thêm vào giỏ", "Xác nhận").
- `.btn-secondary`: Viền 1.5px `--color-primary-container`, chữ màu cam cháy, hover có nền kem nhẹ. Dùng cho thao tác phụ ("Xem chi tiết", "Hủy", "Lọc").

### 4.2 Form & Input Classes
- `.input-field`: Viền `--color-border-medium`, nền trắng, focus có ring bóng cam 3px (`rgba(194, 65, 12, 0.2)`).
- `.card-border`: Viền 1px `--color-border-subtle`, dùng cho mọi Product Card và Container.

---

## 5. Quy tắc Dark / Light Mode & Độ tương phản (Contrast Rules)

1. **Kiểm tra độ tương phản:** Text chính `text-text-ink` trên nền `bg-background-page` hoặc `bg-surface-card` phải luôn đạt chuẩn WCAG AA (tối thiểu 4.5:1).
2. **Không hardcode màu cố định:** Sử dụng Tailwind theme tokens hoặc CSS variables thay vì viết cứng mã hex inline.
3. **Icons:** Icon Lucide React phải có màu đồng bộ với text xung quanh (ví dụ: `className="w-5 h-5 text-text-muted hover:text-primary"`).
