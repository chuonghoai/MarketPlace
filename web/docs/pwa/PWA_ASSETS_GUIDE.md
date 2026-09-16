# Hướng dẫn chi tiết chuẩn bị PWA Assets (Dữ liệu tĩnh)

Để Progressive Web App (PWA) có thể hiển thị đẹp mắt và cho phép cài đặt (Add to Home Screen) trên các thiết bị, dự án của bạn cần có các assets (hình ảnh) cụ thể. 

Lưu ý: Mọi file liệt kê dưới đây phải được đặt đúng tên và đúng thư mục để Service Worker / Manifest tự động nhận diện.

---

## 1. Favicon tiêu chuẩn (Dùng cho tab trình duyệt)

- **Tên file:** `favicon.ico`
- **Mục đích sử dụng:** Icon hiển thị trên tab của trình duyệt web (Desktop/Mobile).
- **Kích thước chính xác:** `32x32` hoặc `64x64` pixel.
- **Định dạng:** `.ico`
- **Nền trong suốt:** Có (Nên dùng nền trong suốt).
- **Bo góc:** Tuỳ ý (thường là hình vuông bo góc hoặc logo tự do).
- **Maskable:** Không.
- **Đặt vào thư mục:** `public/`
- **Được khai báo ở đâu:** Thường để trong thẻ `<link>` của `index.html` và config `vite.config.ts` (`includeAssets`).
- **Hậu quả nếu thiếu:** Tab trình duyệt bị trống icon mặc định, làm giảm độ chuyên nghiệp.

---

## 2. Apple Touch Icon (Dành riêng cho iOS / iPhone / iPad)

- **Tên file:** `apple-touch-icon.png`
- **Mục đích sử dụng:** Icon hiển thị trên màn hình chính (Home Screen) của thiết bị iOS khi người dùng nhấn "Add to Home Screen".
- **Kích thước chính xác:** `180x180` pixel.
- **Định dạng:** `PNG`
- **Nền trong suốt:** KHÔNG ĐƯỢC CÓ NỀN TRONG SUỐT (iOS sẽ tự tô màu đen cho phần nền trong suốt). Phải có màu nền đục (ví dụ: nền trắng hoặc nền màu chủ đạo).
- **Bo góc:** KHÔNG (iOS sẽ tự động cắt bo góc, hãy thiết kế hình vuông đặc).
- **Maskable:** Không.
- **Đặt vào thư mục:** `public/`
- **Được khai báo ở đâu:** Config `vite.config.ts` (`includeAssets`) và thẻ `<link rel="apple-touch-icon" ...>` trong `index.html` (nếu khai báo thủ công).
- **Hậu quả nếu thiếu:** PWA cài trên iPhone sẽ tự chụp màn hình tạm hoặc bị lỗi hiển thị biểu tượng trống.

---

## 3. PWA Icon 192x192 (Android / Desktop)

- **Tên file:** `icon-192x192.png`
- **Mục đích sử dụng:** Android Launcher Icon, hiển thị trong App Drawer và màn hình chính trên nền tảng Android và PC.
- **Kích thước chính xác:** `192x192` pixel.
- **Định dạng:** `PNG`
- **Nền trong suốt:** Có thể có.
- **Bo góc:** Không bắt buộc.
- **Maskable:** Không (đây là icon standard).
- **Đặt vào thư mục:** `public/icons/` (Lưu ý: phải tạo thư mục `icons/` bên trong `public/`).
- **Được khai báo ở đâu:** Thuộc tính `icons` trong `manifest` tại `vite.config.ts`.
- **Hậu quả nếu thiếu:** Trình duyệt Chrome sẽ TỪ CHỐI hiển thị nút cài đặt (Install App / Add to Home Screen) vì vi phạm tiêu chuẩn installability của PWA.

---

## 4. PWA Icon 512x512 (Splash Screen / Store)

- **Tên file:** `icon-512x512.png`
- **Mục đích sử dụng:** Icon hiển thị khi mở app (tạo thành Splash screen trên Android) và dùng cho các màn hình có độ phân giải rất cao.
- **Kích thước chính xác:** `512x512` pixel.
- **Định dạng:** `PNG`
- **Nền trong suốt:** Có thể có. Tuy nhiên, đối với Android 8+, OS yêu cầu maskable icon.
- **Bo góc:** Không bắt buộc.
- **Maskable:** Được khai báo dùng chung dưới dạng `any maskable` trong config hiện tại.
- **Đặt vào thư mục:** `public/icons/`
- **Được khai báo ở đâu:** Thuộc tính `icons` trong `manifest` tại `vite.config.ts`.
- **Hậu quả nếu thiếu:** Chrome từ chối cài đặt PWA hoặc Splash Screen hiển thị bị lỗi mờ hạt.

---

## 5. Maskable Icon (Biểu tượng linh hoạt cho Android hiện đại)

*Ghi chú: Config hiện tại đang cấu hình file `icon-512x512.png` đảm nhận luôn vai trò maskable (`purpose: 'any maskable'`). Vì vậy bạn cần thiết kế file `icon-512x512.png` thoả mãn tiêu chuẩn maskable sau đây:*

- **Mục đích sử dụng:** Cho phép hệ điều hành Android tự động cắt icon thành nhiều hình dạng khác nhau (tròn, vuông bo góc, giọt nước...) tuỳ theo theme người dùng.
- **Nền trong suốt:** KHÔNG ĐƯỢC. (Bắt buộc phải có nền màu đục 100%, ví dụ: Nền trắng).
- **Vùng an toàn (Safe Zone):** Logo chính phải nằm trọn vẹn ở tâm điểm, chiếm không quá 80% diện tích icon để tránh bị OS cắt lẹm mất khi bo góc.
- **Bo góc:** KHÔNG (Thiết kế hình vuông đặc 100%).
- **Hậu quả nếu thiếu:** Lighthouse PWA audit sẽ báo lỗi. Trên điện thoại, icon của app sẽ bị thu nhỏ lại và bao quanh bởi một viền trắng dư thừa rất xấu xí.
