# Web Frontend Architecture (`MarketPlace Web`)

Thư mục này chứa toàn bộ quy tắc về kiến trúc (architecture), thiết kế giao diện (design system) và chuẩn phát triển bắt buộc đối với tất cả AI Agents khi làm việc trên dự án Web Frontend (`web/`).

---

## 1. Công nghệ & Stack cốt lõi (Tech Stack)

- **Framework & Runtime:** React 19 + TypeScript (strict mode)
- **Build Tool:** Vite 8 (`@vitejs/plugin-react`)
- **Styling:** TailwindCSS v4 (`@tailwindcss/vite`, `@theme` token trong `src/index.css`)
- **Routing:** React Router v7 (`react-router-dom`)
- **State Management:**
  - Global / Admin State: **Zustand**
  - Scoped Domain State: **React Context** (như `CartContext`)
  - Local Component State: React `useState` / `useReducer`
- **HTTP Client:** Axios (được bọc trong `apiClient` singleton tại `src/core/api/apiClient.ts`)
- **Icons:** Lucide React (`lucide-react`)
- **Forms & Validation:** `react-hook-form`
- **Realtime / WebSocket:** `socket.io-client`
- **Maps:** Leaflet + React Leaflet (`leaflet`, `react-leaflet`)
- **SEO & Head:** React Helmet Async (`react-helmet-async`)

---

## 2. Nguyên tắc bất di bất dịch (Core Principles)

1. **AI Agent BẮT BUỘC** phải đọc các rule trong thư mục này trước khi triển khai hoặc chỉnh sửa code.
2. **Feature Tham Chiếu (Reference Architecture):**
   - **Authentication & User Flow:** `src/features/auth/` (gồm DTO, Enum, Repository, Service) và `src/pages/auth/`.
   - **Marketplace & Products:** `src/features/products/` và `src/pages/marketplace/`.
   - **Admin Management:** `src/admin/` kết hợp Zustand store (`voucher.store.ts`, `products.store.ts`).
3. **Repository Pattern:** Toàn bộ API calls phải thông qua Service -> Repository (`*Api.repository.ts` / `*Mock.repository.ts` implement Interface `*.repository.ts`), **KHÔNG BAO GIỜ** gọi `axios` trực tiếp trong React component.
4. **Không Over-engineering:** Tái sử dụng các UI components sẵn có (`src/components/`), hook dùng chung và design token trước khi tạo mới.

---

## 3. Cấu trúc tài liệu chi tiết:

- [`architecture/`](architecture/README.md): Quy tắc phân tầng (UI, Service, Repository, DTO, State Management).
- [`design/`](design/design.md): Design System, Color Tokens, Typography, Dark/Light Mode, Custom Utilities.
- [`navigation/`](navigation/README.md): Quy tắc Routing với React Router v7 và Route Guards (`AuthGuard`).
- [`feature-development/`](feature-development/README.md): Quy trình phát triển tính năng mới từ DTO đến UI.
- [`localization/`](localization/README.md): Quy tắc hiển thị text, tránh hardcoded strings và chuẩn hóa thông điệp.
