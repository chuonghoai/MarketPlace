# UseCase: UC17 - Đấu giá sản phẩm
- Người phụ trách: 
- Chức năng liên quan: Ví điện tử, Quản lý đơn hàng
- Actor: khách hàng, nhân viên, quản trị viên
---

## 1. Mô tả chức năng
- Nhân viên/quản trị viên có thể tạo phiên đấu giá (gồm tiêu đề, thời gian bắt đầu, thời gian kết thúc, thời gian đếm ngược mỗi lượt đặt giá `countdownDuration` mặc định 30s, bước giá tối thiểu `minStepPrice`).
- Đặt vào phiên một hoặc nhiều sản phẩm kèm mức giá khởi điểm (`startPrice`), và kích hoạt vật phẩm đấu giá (`ACTIVE`) để nạp trạng thái vào Redis.
- Khách hàng có thể thấy được phiên đấu giá đang diễn ra từ banner trực tiếp ở trang chủ (`ActiveAuctionBanner`) hoặc trang danh sách đấu giá (`/auctions`), bấm vào để truy cập vào phòng đấu giá trực tiếp (`/auctions/:id`).
- Khách hàng có thể tiến hành đặt mức giá thủ công cao hơn vào sản phẩm (đảm bảo bước giá tối thiểu `minStepPrice`), hoặc thiết lập cơ chế tự động đấu giá (Auto-Bid).

## 2. Kiểm tra điều kiện Ví điện tử (E-Wallet)
- Trước khi cho phép đặt giá thủ công hoặc cài đặt Auto-Bid, hệ thống bắt buộc kiểm tra trạng thái Ví điện tử của khách hàng (ví phải đang hoạt động `ACTIVE`).
- Với đặt giá thủ công: Số dư ví hiện tại (`balance`) phải lớn hơn hoặc bằng mức giá đặt (`price`).
- Với đấu giá tự động (Auto-Bid): Số dư ví hiện tại (`balance`) phải lớn hơn hoặc bằng mức giá trần (`ceilingPrice`).

## 3. Cơ chế đấu giá tự động (Auto-Bid Cascade)
- Khách hàng mở cài đặt tự động đấu giá, nhập bước giá tự động (`autoStepPrice`) và mức giá trần (`ceilingPrice`).
- Cấu hình Auto-Bid của từng người dùng được lưu trên Redis (`auction:{itemId}:autobid:{userId}` và tập hợp `auction:{itemId}:autobidders`).
- Khi có lượt đặt giá mới hoặc có người thiết lập Auto-Bid, hệ thống kích hoạt vòng lặp tự động trả giá (`triggerAutoBidCascade`, tối đa 50 vòng): duyệt qua danh sách Auto-Bidder đang tham gia trên Redis, nếu người đó chưa phải người dẫn đầu hiện tại (`bidderId !== winnerId`) và mức giá kế tiếp (`currentPrice + autoStepPrice`) vẫn nhỏ hơn hoặc bằng mức giá trần (`ceilingPrice`), hệ thống sẽ tự động đặt giá thay cho họ.
- Nếu mức giá kế tiếp vượt quá mức giá trần (`ceilingPrice`), hệ thống tự động dừng nâng giá cho người dùng đó.

## 4. Cơ chế Realtime & Đếm ngược (WebSocket + Redis Lua Script)
- Sử dụng Socket.IO (namespace `/auctions`) kết hợp Redis để đồng bộ trạng thái phòng đấu giá theo thời gian thực (`joinRoom`, `itemState`, `placeBid`, `bidUpdated`, `itemClosed`).
- Mọi lượt đặt giá được xử lý nguyên tử (atomic) bằng **Redis Lua Script** để chống xung đột (race condition) khi nhiều người đặt giá cùng lúc, đồng thời tự động reset bộ đếm ngược về `countdownDuration` (30 giây) sau mỗi lượt nâng giá hợp lệ.

## 5. Kết thúc đấu giá & Thanh toán/Tạo đơn hàng tự động
- Khi đồng hồ đếm ngược 30 giây về `0` mà không có lượt trả giá mới (xử lý qua Server Timer hoặc sự kiện `checkTimeout`), hệ thống chốt phiên đấu giá cho vật phẩm (`status = CLOSED`) và xóa trạng thái tạm trên Redis.
- Nếu có người chiến thắng (`winnerId`), hệ thống thực hiện trong một Database Transaction:
  1. Tự động trừ số tiền trúng đấu giá (`finalPrice`) trực tiếp từ Ví điện tử của người thắng (`deductBalance`).
  2. Trừ tồn kho sản phẩm (`stock - 1`).
  3. Tự động khởi tạo Đơn hàng (`Order` và `OrderItem`) ở trạng thái đang chuẩn bị (`PREPARING`), trạng thái thanh toán đã trả (`PAID`) bằng phương thức Ví điện tử (`WALLET`).