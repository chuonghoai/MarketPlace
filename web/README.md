# 🎨 MarketNest

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Zustand-4A4A4A?style=for-the-badge&logo=react&logoColor=white" alt="Zustand"/>
  <img src="https://img.shields.io/badge/License-MIT-success?style=for-the-badge" alt="License"/>
</p>

### 🌿 Nền tảng thương mại điện tử sản phẩm thủ công mỹ nghệ - Frontend Client

> Kết nối nghệ nhân với khách hàng thông qua nền tảng mua sắm trực tuyến hiện đại, thân thiện và dễ sử dụng. Giao diện Frontend mang đến trải nghiệm mượt mà, tối ưu hóa tỷ lệ chuyển đổi cho cả người mua và người quản lý.

---

## 📚 Mục lục

* [Giới thiệu](#-giới-thiệu)
* [Chức năng](#-chức-năng)
* [Công nghệ sử dụng](#️-công-nghệ-sử-dụng)
* [Cấu trúc dự án](#️-cấu-trúc-dự-án)
* [Cài đặt dự án](#️-cài-đặt-dự-án)
* [Cấu hình biến môi trường](#-cấu-hình-biến-môi-trường)
* [Chạy dự án](#️-chạy-dự-án)
* [Hướng dẫn đóng góp](#-hướng-dẫn-đóng-góp)
* [Ghi chú](#-ghi-chú)

---

## 🚀 Giới thiệu

**MarketNest Frontend** là bộ mặt của hệ thống thương mại điện tử chuyên cung cấp các sản phẩm thủ công mỹ nghệ tinh xảo. Dự án được thiết kế với mục đích:
- 🎨 **Cung cấp trải nghiệm người dùng (UX) xuất sắc**, giao diện (UI) hiện đại, trực quan, dễ dàng thao tác.
- ⚡ **Tốc độ tải trang cực nhanh** nhờ vào sự hỗ trợ của công cụ build Vite và tối ưu hóa component của React.
- 📱 **Tương thích hoàn hảo trên mọi thiết bị** (Responsive Design) từ máy tính bàn, laptop đến điện thoại di động nhờ Tailwind CSS.
- 🛠️ **Hỗ trợ quản trị toàn diện** với màn hình Dashboard trực quan dành riêng cho Quản trị viên (Admin) theo dõi tiến độ kinh doanh.

Hệ thống được phát triển hướng tới cả 2 đối tượng chính: **Khách hàng mua sắm** và **Ban quản trị hệ thống**.

---

## 💻 Chức năng

### 👤 Chức năng dành cho Khách hàng
* 📝 **Đăng ký tài khoản**: Hỗ trợ người dùng mới tạo tài khoản nhanh chóng.
* 🔐 **Đăng nhập**: Xác thực an toàn và quản lý phiên đăng nhập.
* 🛍️ **Duyệt sản phẩm**: Khám phá thế giới đồ thủ công mỹ nghệ thông qua Marketplace đa dạng.
* 🔎 **Tìm kiếm sản phẩm**: Công cụ tìm kiếm nhanh với gợi ý trực quan.
* 🏷️ **Lọc theo danh mục**: Dễ dàng phân loại và tìm sản phẩm theo ý muốn.
* 📦 **Xem chi tiết sản phẩm**: Thông tin chi tiết, hình ảnh sắc nét và giá cả minh bạch.
* 🛒 **Quản lý giỏ hàng**: Thêm, chỉnh sửa số lượng hoặc xóa sản phẩm một cách dễ dàng.
* 💳 **Thanh toán đơn hàng**: Tích hợp các cổng thanh toán an toàn (MoMo, VNPay, PayPal).
* 🎁 **Sử dụng voucher**: Nhập mã giảm giá để nhận ưu đãi trực tiếp khi thanh toán.
* 🚚 **Theo dõi đơn hàng**: Xem trạng thái và lịch sử mua hàng cá nhân.
* ⭐ **Đánh giá sản phẩm**: Để lại bình luận, đánh giá sao cho sản phẩm.
* 👤 **Quản lý hồ sơ cá nhân**: Cập nhật avatar, thông tin và địa chỉ giao hàng.

### 👨‍💼 Chức năng dành cho Quản trị viên
* 📊 **Dashboard (Tổng quan)**: Cung cấp cái nhìn bao quát về doanh thu, đơn hàng và các chỉ số thống kê quan trọng.
* 📦 **Quản lý sản phẩm**: Thêm mới, chỉnh sửa thông tin hoặc xóa bỏ sản phẩm khỏi danh mục hệ thống.
* 📑 **Quản lý đơn hàng**: Xem danh sách chi tiết đơn hàng, xử lý trạng thái đơn hàng.
* 🎟️ **Quản lý voucher**: Khởi tạo và thiết lập các chương trình mã giảm giá.
* 👥 **Quản lý người dùng**: Quản lý thông tin tài khoản người bán và khách hàng.

---

## 🛠️ Công nghệ sử dụng

Dự án Frontend được xây dựng bằng những công nghệ hiện đại và phổ biến nhất:

| Công nghệ | Vai trò |
| :--- | :--- |
| <img src="https://skillicons.dev/icons?i=react" width="20"/> **React 19** | Thư viện UI cốt lõi để xây dựng giao diện người dùng |
| <img src="https://skillicons.dev/icons?i=typescript" width="20"/> **TypeScript** | Ngôn ngữ lập trình chính với type-checking chặt chẽ |
| <img src="https://skillicons.dev/icons?i=vite" width="20"/> **Vite** | Công cụ build siêu tốc, mang lại trải nghiệm DX tối đa |
| 🐻 **Zustand** | Quản lý trạng thái (State Management) gọn nhẹ và hiệu quả |
| <img src="https://skillicons.dev/icons?i=tailwind" width="20"/> **Tailwind CSS** | Framework CSS utility-first giúp style giao diện linh hoạt |
| 🔗 **Axios** | Thư viện giao tiếp HTTP/API với Backend |
| 🛣️ **React Router DOM** | Quản lý điều hướng (Routing) đa trang trong ứng dụng SPA |
| 📝 **React Hook Form** | Quản lý và xác thực form hiệu quả |
| 📍 **React-Leaflet** | Tích hợp bản đồ trực quan |
| 🎨 **Lucide React** | Thư viện icon đẹp mắt và nhẹ nhàng |

---

## 🗂️ Cấu trúc dự án

Dự án được phân chia thư mục rõ ràng, giúp dễ tìm kiếm và bảo trì mã nguồn:

```text
src/
├── admin/             # Các trang và component dành riêng cho giao diện Admin
│   └── pages/         # Trang chi tiết: Dashboard, Quản lý đơn hàng, Sản phẩm, Voucher...
├── assets/            # Lưu trữ tài nguyên tĩnh (Hình ảnh, Logo, Icons toàn cục)
├── components/        # Các UI component có thể tái sử dụng (Button, Input, Modal, Table...)
├── core/              # Các cấu hình và tiện ích cốt lõi của ứng dụng
├── features/          # Chứa logic chia theo từng tính năng (Auth, Cart, Product...)
├── log/               # Tiện ích ghi log ở phía client
├── pages/             # Chứa các trang chính của ứng dụng dành cho khách hàng
│   ├── auth/          # Đăng nhập, đăng ký
│   ├── cart/          # Giỏ hàng
│   ├── marketplace/   # Màn hình khám phá sản phẩm
│   ├── order-checkout/ # Quy trình thanh toán
│   ├── product/       # Trang chi tiết sản phẩm
│   └── profile/       # Hồ sơ cá nhân
├── routes/            # Khai báo và cấu hình các route trong ứng dụng
├── utils/             # Các hàm Helper tiện ích dùng chung
├── App.tsx            # Component gốc bao bọc toàn ứng dụng
├── index.css          # File style CSS chung toàn cục (chứa các directives của Tailwind)
└── main.tsx           # File khởi chạy gốc, mount React vào DOM
```

---

## ⚙️ Cài đặt dự án

Để phát triển dự án, bạn cần đảm bảo máy tính đã cài đặt **Node.js (v18+)** và npm/yarn.

### 1️⃣ Clone source code
```bash
git clone <repository-url>
cd E-CommercePlatform
```

### 2️⃣ Cài đặt thư viện
```bash
npm install
```

### 3️⃣ Cấu hình môi trường
Tạo một file `.env` (copy từ `.env.example` nếu có) tại thư mục gốc và cung cấp các thông số API.

---

## 🔑 Cấu hình biến môi trường

Dự án quản lý cấu hình thông qua 3 loại môi trường (Environment) khác nhau:

### 1. Local (`.env.local`)
**Mục đích:**
- Phát triển hằng ngày.
- Chạy trên máy cá nhân.
- **Giải thích:** Frontend gọi backend thông qua `localhost`. Database và các service sử dụng cấu hình cục bộ của máy tính.

### 2. LAN (`.env.lan`)
**Mục đích:**
- Test trên thiết bị khác trong cùng mạng LAN.
- Ví dụ: Dùng điện thoại di động truy cập frontend, và frontend gọi về backend đang chạy trong máy dev.
- **Giải thích:** Các URL `localhost` cần được thay thế bằng IP LAN thực tế của máy dev (Ví dụ: `http://192.168.1.32`).

### 3. Preview (`.env.preview`)
**Mục đích:**
- Test bản production build trực tiếp ở môi trường local trước khi deploy chính thức.
- **Quan trọng:** File preview có thể linh hoạt thay đổi tùy mục đích test:
  - **Cấu hình giống Local:** Khi bạn muốn preview ngay trên desktop của máy dev.
  - **Cấu hình giống LAN:** Khi bạn muốn preview build và mở trên thiết bị mobile (để test PWA Standalone).
  - **Cấu hình Production:** Trỏ về API Production thực tế khi test giao diện.

---

**Danh sách các biến môi trường (Áp dụng chung):**

| Biến | Ý nghĩa |
| :--- | :--- |
| `VITE_API_BASE_URL` | URL kết nối tới máy chủ Backend |
| `VITE_API_TIMEOUT` | Thời gian chờ tối đa cho một Request (tính bằng ms) |

---

## ▶️ Chạy dự án

Hệ thống cung cấp sẵn các script để chuyển đổi mượt mà giữa các mục đích phát triển khác nhau.

### 1. Development mode (Chạy Local)

**Mục đích:**
- Viết code hằng ngày.
- Tự động cập nhật giao diện khi sửa code (Hot reload).
- Chạy và test tính năng cơ bản trên máy tính.

**Thông tin:**
- Lệnh khởi chạy: 
  ```bash
  npm run dev
  ```
- URL truy cập: `http://localhost:5173`
- Environment tương ứng: Đọc từ file `.env.local`

---

### 2. LAN / Mobile Testing mode (Test trên Điện thoại)

**Mục đích:**
- Test giao diện Responsive trực tiếp trên điện thoại di động (hoặc máy tính khác cùng mạng).
- Test quy trình thanh toán VNPay/MoMo thực tế trên Mobile (đảm bảo ngân hàng redirect về lại điện thoại thay vì `localhost`).

**Thông tin:**
- Lệnh khởi chạy: 
  ```bash
  npm run dev:lan
  ```
- URL truy cập: `http://<YOUR_LOCAL_IP>:5173` (Ví dụ: `http://192.168.1.32:5173`)
- Environment tương ứng: Đọc từ file `.env.lan` (Lưu ý: Bạn phải mở file này và thay thế `<YOUR_LOCAL_IP>` thành IP LAN thực tế của máy).

---

### 3. Preview mode (Xem trước bản Build & PWA)

**Mục đích:**
- Chạy thử nghiệm bản build đóng gói cuối cùng ở môi trường local trước khi Deploy.
- Test cài đặt PWA (Progressive Web App) và Service Worker (Vì Service worker chỉ hoạt động trên file đã build).

**Thông tin:**
- Lệnh khởi chạy:
  ```bash
  # 1. Build source code ra thư mục dist
  npm run build:preview
  
  # 2. Chạy server local để host file build
  npm run preview
  ```
- URL truy cập: `http://localhost:4173` (hoặc `http://<YOUR_LOCAL_IP>:4173` nếu bạn đang dùng điện thoại).
- Environment tương ứng: Đọc từ file `.env.preview` (Nhớ cập nhật `<YOUR_LOCAL_IP>` nếu test bằng điện thoại).

---

## 🤝 Hướng dẫn đóng góp

Chúng tôi luôn hoan nghênh những đóng góp từ cộng đồng. Hãy làm theo các bước sau để đóng góp vào dự án:

- [x] **Fork** repository này về tài khoản cá nhân.
- [x] **Tạo branch mới** chứa tính năng hoặc bản vá lỗi của bạn: `git checkout -b feature/ten-tinh-nang`
- [x] **Commit code** với thông điệp rõ ràng: `git commit -m 'Cải thiện giao diện trang chi tiết sản phẩm'`
- [x] **Push branch** lên GitHub: `git push origin feature/ten-tinh-nang`
- [x] **Tạo Pull Request** để chúng tôi review và merge code.

---

## 🌐 Link Deploy

- **Frontend (Vercel):** [https://marketnestplatform.vercel.app](https://marketnestplatform.vercel.app)
- **Backend (Render):** [https://marketnestplatform.onrender.com](https://marketnestplatform.onrender.com)

---

## 📌 Ghi chú

> ⚠️ Đây là dự án được xây dựng phục vụ mục đích học tập, nghiên cứu và thực hành phát triển phần mềm.
>
> 🚫 Không được thiết kế cho môi trường thương mại thực tế.
>
> 🎓 Dự án được phát triển nhằm nâng cao kỹ năng thiết kế hệ thống, lập trình Fullstack, thiết kế UI/UX và triển khai ứng dụng web.
