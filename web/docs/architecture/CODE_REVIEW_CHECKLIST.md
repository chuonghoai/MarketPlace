# Code Review Checklist

Sử dụng checklist này khi review Pull Request (PR) để đảm bảo code tuân thủ kiến trúc của E-Commerce Platform.

## 1. Folder Structure Rules

- [ ] File có nằm đúng domain/module không? (Ví dụ: code liên quan tới giỏ hàng phải ở `features/cart`, không vứt lung tung vào `features/products`).
- [ ] Có vi phạm feature boundary không? (Các features nên độc lập, hạn chế tối đa việc cross-import giữa các features. Nếu cần kết hợp dữ liệu, nên thực hiện ở tầng Controller hoặc Store của Page).
- [ ] Component dành riêng cho một trang có được đặt trong `src/pages/{page}/components` không? (Tuyệt đối không đặt vào `src/components` trừ khi dùng chung).

## 2. Repository Rules

- [ ] Repository CÓ CHỨA business logic không? **(PHẢI LÀ KHÔNG)**. Repository chỉ làm nhiệm vụ Data Access (Gọi API, map response).
- [ ] Có gọi UI (như Toast, alert, navigate) từ Repository không? **(PHẢI LÀ KHÔNG)**.
- [ ] Có implement đủ Interface, ApiRepository và MockRepository không? (Đảm bảo app vẫn chạy khi `USE_MOCK = true`).

## 3. Service Rules

- [ ] Service có xử lý đúng trách nhiệm không? (Chứa business logic thuần túy).
- [ ] Service CÓ import React Hooks (`useState`, `useEffect`) hoặc React Component không? **(PHẢI LÀ KHÔNG)**.
- [ ] Service CÓ thao tác trực tiếp với URL, Window, DOM không? **(PHẢI LÀ KHÔNG)**.

## 4. Controller Rules

- [ ] Controller có bị biến thành God Object không? (Controller chỉ nên điều phối UI State và gọi API thông qua Service/Store. Nếu có quá nhiều Data processing, hãy chuyển xuống Service).
- [ ] Mọi xử lý event (`onClick`, `onChange`) trong file `.tsx` đã được tách và đưa vào Controller chưa? (File JSX nên "sạch").
- [ ] File Controller có chứa JSX không? **(PHẢI LÀ KHÔNG)**.

## 5. Component & Page Rules

- [ ] File Page (`*Page.tsx`) có chứa Data Fetching/API Request không? **(PHẢI LÀ KHÔNG)**. Component KHÔNG gọi API trực tiếp.
- [ ] File Component có quá lớn không? (Nên dưới 250-300 dòng. `productPage.tsx` hiện tại dài hơn 400 dòng là một tín hiệu cần refactor tách thành các component nhỏ hơn).
- [ ] Component có khai báo `useState` tràn lan không? (Nếu state dùng để quản lý luồng dữ liệu của cả trang, phải chuyển vào Controller/Store).

## 6. State Rules

- [ ] Global/Domain state có nằm đúng Store hoặc Context không?
- [ ] Store (`*.store.ts`) có chứa UI State không? **(PHẢI LÀ KHÔNG)**. Store chỉ chứa Data (ví dụ: `products: []`). Trạng thái như `isLoading`, `isModalOpen` PHẢI nằm ở Controller.

## 7. Naming Rules

- [ ] Tên file có đúng convention không?
  - Models: `{name}.model.ts`
  - Repository: `{name}.repository.ts`
  - Service: `{name}.service.ts`
  - Controller: `{name}.controller.ts`
  - Store: `{name}.store.ts`
  - Page: `{name}Page.tsx`
- [ ] Tên Hook Controller có bắt đầu bằng `use` và kết thúc bằng `Controller` không? (Ví dụ: `useProductController`).
- [ ] Tên component có sử dụng PascalCase không? (Ví dụ: `ProductReviews.tsx` và `export function ProductReviews`).
