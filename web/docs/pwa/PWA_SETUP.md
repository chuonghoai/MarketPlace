# PWA Setup & Checklist (Dành cho Developer)

Tài liệu này mô tả chi tiết những gì đã được thiết lập để dự án trở thành một PWA (Progressive Web App) và các bước cuối cùng mà bạn (Nhà phát triển) cần thực hiện để hoàn tất.

## 1. Những gì AI Agent đã cấu hình
- Cài đặt thư viện `vite-plugin-pwa`.
- Cấu hình plugin `VitePWA` bên trong file `vite.config.ts`.
- Tự động inject Service Worker vào source code (`injectRegister: 'auto'`).
- Thiết lập Manifest đầy đủ thông tin: `name`, `short_name`, `theme_color`, `background_color`, `display: 'standalone'`, `start_url`.
- Cấu hình Workbox để tự động cache tĩnh (`js`, `css`, `html`, `png`, `svg`, `woff2`, `ttf`) và không cache API.
- Cấu hình Runtime Caching đặc biệt cho Google Fonts (CacheFirst) để tối ưu hoá tốc độ tải lần sau và truy cập không tốn network resource.

## 2. Những gì Người Phát Triển cần bổ sung
AI không thể tự sinh ra các file đồ hoạ (Logo/Icons). Do đó, để PWA hoàn chỉnh và không bị Chrome báo lỗi thiếu icon, bạn cần bổ sung các file thiết kế theo hướng dẫn chi tiết tại file `PWA_ASSETS_GUIDE.md`.

## 3. Checklist tài nguyên cần bổ sung
Hãy đánh dấu vào các mục sau khi đã hoàn thành thiết kế và bỏ file vào thư mục:

- [x] Tạo thư mục `public/icons/` (nếu chưa có).
- [x] Bổ sung file `public/favicon.ico` (32x32 hoặc 64x64).
- [x] Bổ sung file `public/apple-touch-icon.png` (180x180, KHÔNG nền trong suốt).
- [x] Bổ sung file `public/icons/icon-192x192.png` (192x192).
- [x] Bổ sung file `public/icons/icon-512x512.png` (512x512, dùng làm Splash Screen, KHÔNG nền trong suốt để thoả mãn tiêu chuẩn maskable icon của Android).

## 4. Sau khi bổ sung xong cần làm gì?
Hãy chạy lại các lệnh sau để Vite cập nhật lại file manifest và bundle lại service worker:

```bash
# Restart lại dev server
npm run dev
```

Nếu muốn build ra bản production để xem kết quả PWA thực tế một cách chính xác nhất (Khuyên dùng):
```bash
npm run build
npm run preview
```

## 5. Cách kiểm tra PWA hoạt động trên máy tính (Desktop)
1. Mở trang web (ví dụ: `http://localhost:5173` hoặc qua IP `http://192.168.1.32:5173`).
2. Nhấn `F12` mở Chrome DevTools.
3. Chuyển sang tab **Application**.
4. Ở cột bên trái, chọn **Manifest**:
   - Kiểm tra xem các trường Name, Short name, Start URL có báo lỗi nào không.
   - Kiểm tra mục **Installability** xem có dòng cảnh báo nào không (nếu không có là OK).
   - Kiểm tra phần Icons xem hình ảnh bạn tải lên đã hiện ra đúng chưa.
5. Ở cột bên trái, chọn **Service Workers**:
   - Status phải hiện là `activated` và đang chạy.
   - (Mở rộng) Đánh dấu vào nút `Offline` ở thanh công cụ phía trên. Nhấn F5 lại trang web. Nếu trang web vẫn hiển thị giao diện (dù gọi API báo lỗi network) thì cấu hình cache tĩnh đã thành công.
6. Nhìn lên thanh địa chỉ của Chrome (Address Bar), nếu có biểu tượng mũi tên tải xuống **"Install MarketNest"** (Cài đặt ứng dụng), thì bạn đã cấu hình PWA thành công 100%.

## 6. Cách kiểm tra trên điện thoại Android
1. Đảm bảo điện thoại kết nối **cùng một mạng Wi-Fi** với máy tính.
2. Mở Chrome trên Android, truy cập vào đường dẫn IP (Ví dụ: `http://192.168.1.32:5173`).
3. Đợi vài giây, Chrome sẽ tự động bật popup: **"Thêm MarketNest vào Màn hình chính"** (Add to Home Screen).
4. Nhấn xác nhận cài đặt.
5. Thoát ra màn hình Home của điện thoại, tìm icon MarketNest.
6. Mở app lên. Bạn sẽ thấy app chạy toàn màn hình (không có thanh địa chỉ) giống hệt một Native App, kèm theo đó là Splash Screen (màn hình chờ load) tự động hiển thị Logo của bạn trước khi vào trang chủ.
