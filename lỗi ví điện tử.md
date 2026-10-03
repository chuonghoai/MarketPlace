Searched for "wallets/me"
Searched for "class WalletsController"
Viewed wallets.controller.ts:1-240
Viewed wallets.service.ts:1-698

Nguyên nhân của lỗi này là do **Race Condition (Điều kiện tương tranh)** xảy ra trong quá trình tạo ví điện tử lần đầu.

Trong file `wallets.service.ts`, hàm `getOrCreateWallet` đang xử lý như sau:

```typescript
async getOrCreateWallet(userId: string, manager?: EntityManager): Promise<Wallet> {
  const repo = manager ? manager.getRepository(Wallet) : this.walletRepository;
  let wallet = await repo.findOne({ where: { userId } }); // 1. Kiểm tra ví đã tồn tại chưa

  if (!wallet) {
    wallet = repo.create({ ... });
    wallet = await repo.save(wallet); // 2. Nếu chưa, tiến hành tạo mới
  }

  return wallet;
}
```

**Chi tiết quá trình gây lỗi:**

1. Khi bạn lần đầu vào trang ví điện tử, Front-end có thể gửi đi **nhiều API requests đồng thời** tới Back-end (ví dụ: lấy thông tin ví `/wallets/me`, lấy lịch sử giao dịch `/wallets/transactions`, lấy danh sách yêu cầu rút tiền `/wallets/withdrawals/me` - đều gọi hàm `getOrCreateWallet`).
2. Cả 2 requests này đều chạy đến bước `findOne` cùng lúc và **cả 2 đều thấy là chưa có ví**.
3. Cả 2 requests tiếp tục chạy đến lệnh `save` cùng lúc.
4. Request đầu tiên sẽ được Database lưu lại thành công. 
5. Request thứ hai sẽ cố gắng chèn thêm 1 bản ghi ví nữa cho cùng 1 User, dẫn đến lỗi Database trả về: `Duplicate entry '...' for key 'wallets.IDX_2ecdb33f23e9a6fc392025c0b9'`.

**Vì sao bạn F5 lại thì bình thường?**
Khi bạn F5 (Refresh), các requests mới sẽ gọi lại API. Lúc này request đầu tiên (bị lỗi ở trên) thực ra đã lưu ví vào Database thành công rồi. Do đó khi gọi lại hàm `getOrCreateWallet`, lệnh `findOne` sẽ tìm thấy ví và trả về luôn, không thực hiện bước `save` tạo mới nữa, nên mọi thứ hoạt động bình thường!

**Cách khắc phục:**
Cần bọc đoạn `save` vào trong một khối `try-catch` để bắt lỗi `ER_DUP_ENTRY`. Nếu có lỗi trùng lặp xảy ra, ta chỉ cần bỏ qua lỗi và gọi lại `findOne` để lấy dữ liệu ví (vì lúc này một request khác đã tạo ví thành công rồi). Hoặc đơn giản là hạn chế việc Front-end gọi nhiều API yêu cầu kiểm tra ví cùng 1 lúc khi chưa khởi tạo.