# Đường thi hành tuyến độc lập

## 1. Các node điều kiện
- **Node 1**: `!dto.items`
- **Node 2**: `dto.items.length === 0`
- **Node 5**: `!address`
- **Node 8**: `for (const item of dto.items)`
- **Node 10**: `!product`
- **Node 12**: `item.quantity > product.stock`
- **Node 16**: `if (packingResult)`
- **Node 19**: `dto.voucherCodes`
- **Node 20**: `dto.voucherCodes.length > 0`
- **Node 22**: `for (const code of dto.voucherCodes)`
- **Node 24**: Lỗi catch khi `checkVoucherEligibility`
- **Node 25**: `voucher_type === FREESHIP_CASH`
- **Node 26**: `voucher_type === FREESHIP_PERCENT`
- **Node 31**: `freeshipCount > 1`
- **Node 32**: `nonFreeshipCount > 2` (Lưu ý: đánh nhầm node trong code block, đây là kiểm tra số lượng voucher)
- **Node 36**: `for (const v of validVouchers)` (loop 1)
- **Node 37**: `v.voucher_type === VoucherType.PERCENT`
- **Node 39**: `v.max_discount_amount`
- **Node 40**: `discount > v.max_discount_amount`
- **Node 42**: `discount > remainingSubTotal`
- **Node 46**: `v.voucher_type === VoucherType.CASH`
- **Node 47**: `discount > remainingSubTotal`
- **Node 50**: `for (const v of validVouchers)` (loop 2)
- **Node 51**: `v.voucher_type === VoucherType.FREESHIP_PERCENT`
- **Node 53**: `v.max_discount_amount`
- **Node 54**: `discount > v.max_discount_amount`
- **Node 56**: `discount > shippingFee - shippingDiscountAmount`
- **Node 60**: `v.voucher_type === VoucherType.FREESHIP_CASH`
- **Node 61**: `discount > shippingFee - shippingDiscountAmount`
- **Node 65**: `for (const item of validOrderItems)`
- **Node 67**: `res === -1`
- **Node 69**: `res2 === 0`
- **Node 72**: `res === 0`
- **Node 77**: `dto.paymentMethod === 'COD'`
- **Node 78**: `for (const v of validVouchers)` (loop 3)
- **Node 80**: `!lockedVoucher`
- **Node 82**: `lockedVoucher.used_count >= lockedVoucher.total_limit`
- **Node 86**: `for (const item of validOrderItems)` (loop update product)
- **Node 88**: `result.affected === 0`
- **Node 90**: `validVouchers.length > 0`
- **Node 104**: `dto.paymentMethod === 'MOMO'`
- **Node 107**: `dto.paymentMethod === 'VNPAY'`
- **Node 110**: `dto.paymentMethod === 'PAYPAL'`
- **Node 114**: `user != null`

**Tổng số node điều kiện (P):** 45

## 2. Tính toán V(G)
Độ phức tạp Cyclomatic của luồng:
`V(G) = P + 1 = 45 + 1 = 46`

## 3. Danh sách đường thi hành (Mẫu đại diện)
1. **Path 1 (Lỗi giỏ hàng trống):**
   `start -> 1 -> 3 -> Exit`
   
2. **Path 2 (Thanh toán MOMO thành công):**
   `start -> 1 -> 2 -> 4 -> 5 -> 7 -> 8 -> 9 -> 10 -> 12 -> 14 -> 8 (kết thúc lặp) -> 15 -> 16 -> 18 -> 19 -> 64 -> 65 -> 66 -> 67 -> 72 -> 74 -> 65 (kết thúc lặp) -> 75 -> 76 -> 77 -> 85 -> 86 -> 87 -> 88 -> 86 (kết thúc) -> 90 -> 92 -> 104 -> 105 -> 106 -> Exit`

3. **Path 3 (Thanh toán COD thành công):**
   `start -> 1 -> 2 -> 4 -> 5 -> 7 -> 8 -> 9 -> 10 -> 12 -> 14 -> 8 (kết thúc lặp) -> 15 -> 16 -> 18 -> 19 -> 64 -> 65 -> 66 -> 67 -> 72 -> 74 -> 65 (kết thúc lặp) -> 75 -> 76 -> 77 -> 78 -> 79 -> 80 -> 82 -> 84 -> 78 (kết thúc) -> 85 -> 86 -> 87 -> 88 -> 86 (kết thúc) -> 90 -> 92 -> 104 -> 107 -> 110 -> 113 -> 114 -> 115 -> 116 -> 117 -> Exit`
