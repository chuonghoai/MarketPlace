### Nhóm 1: Nhánh kiểm tra items (Node 2, 3)
1. **Path 1** – `!items = true` (không có items trong DTO):
   `start → 1 → 2(true) → 4 → Exit`

2. **Path 2** – `items != null` nhưng `items.length === 0`:
   `start → 1 → 2(false) → 3(true) → 4 → Exit`

### Nhóm 2: Nhánh kiểm tra địa chỉ (Node 6)
3. **Path 3** – `!address = true` (không tìm thấy địa chỉ):
   `start → 1 → 2(false) → 3(false) → 5 → 6(true) → 7 → Exit`

### Nhóm 3: Nhánh vòng lặp items và kiểm tra sản phẩm (Node 13, 15, 17)
4. **Path 4** – Vòng lặp items không có phần tử (items.length > 0 nhưng map rỗng - trường hợp biên), `packingResult = false`, không có voucher, redis ok, COD, không có validVouchers, transaction thành công, không phải MOMO/VNPAY/PAYPAL, `user != null`:
   `start → 1 → 2(false) → 3(false) → 5 → 6(false) → 8 → 9 → 10 → 11 → 12 → 13(false) → 22 → 23(false) → 25 → 26 → 27 → 28 → 29(false) → 83 → 84 → 85(false) → 99 → ... → 132(success) → 133(false) → 136(false) → 139(false) → 142 → 143 → 144(true) → 145 → 146 → Exit`

5. **Path 5** – Vòng lặp items: product không tồn tại (`!product = true`):
   `start → 1 → 2(false) → 3(false) → 5 → 6(false) → 8 → 9 → 10 → 11 → 12 → 13(true) → 14 → 15(true) → 16 → Exit`

6. **Path 6** – Vòng lặp items: product tồn tại nhưng `quantity > stock`:
   `start → 1 → 2(false) → 3(false) → 5 → 6(false) → 8 → 9 → 10 → 11 → 12 → 13(true) → 14 → 15(false) → 17(true) → 18 → Exit`

7. **Path 7** – Vòng lặp items: product tồn tại, quantity hợp lệ, lặp tiếp (iteration 2):
   `start → 1 → ... → 13(true) → 14 → 15(false) → 17(false) → 19 → 20 → 21 → 13(true) → 14 → 15(true) → 16 → Exit`

### Nhóm 5: Nhánh kiểm tra voucher (Node 29, 30)
8. **Path 9** – `voucherCodes = null` (không truyền voucher):
   `start → 1 → 2(false) → 3(false) → 5 → 6(false) → 8 → ... → 13(false) → 22 → 23(false) → 25 → 26 → 27 → 28 → 29(false) → 83 → ... → 85(false) → 99 → ... → 132(success) → 133(false) → 136(false) → 139(false) → 142 → 143 → 144(false) → 146 → Exit`

9. **Path 10** – `voucherCodes != null` nhưng `voucherCodes.length === 0`:
    `start → 1 → 2(false) → 3(false) → 5 → 6(false) → 8 → ... → 13(false) → 22 → 23(false) → 25 → 26 → 27 → 28 → 29(true) → 30(false) → 83 → ... → 85(false) → 99 → ... → 132(success) → 133(false) → 136(false) → 139(false) → 142 → 143 → 144(true) → 145 → 146 → Exit`

### Nhóm 6: Nhánh exception khi checkVoucherEligibility (Node 35/41)
10. **Path 11** – Vòng lặp codes: `checkVoucherEligibility` ném exception:
    `start → 1 → ... → 29(true) → 30(true) → 31 → 32 → 33(true) → 34 → 35 → 41(exception) → 42 → Exit`

### Nhóm 7: Nhánh loại voucher FREESHIP_CASH / FREESHIP_PERCENT (Node 37, 38)
11. **Path 12** – Voucher hợp lệ, `voucher_type = FREESHIP_CASH`: tăng `freeshipCount`:
    `start → 1 → ... → 33(true) → 34 → 35 → 36 → 37(true) → 39 → 33(false) → 43 → ...`

12. **Path 13** – Voucher hợp lệ, `voucher_type = FREESHIP_PERCENT`: tăng `freeshipCount`:
    `start → 1 → ... → 33(true) → 34 → 35 → 36 → 37(false) → 38(true) → 39 → 33(false) → 43 → ...`

13. **Path 14** – Voucher hợp lệ, type khác (PERCENT/CASH): tăng `nonFreeshipCount`:
    `start → 1 → ... → 33(true) → 34 → 35 → 36 → 37(false) → 38(false) → 40 → 33(false) → 43 → ...`

### Nhóm 8: Nhánh giới hạn voucher (Node 43, 45)
14. **Path 15** – `freeshipCount > 1`: ném lỗi quá nhiều voucher miễn phí vận chuyển:
    `start → 1 → ... → 33(false) → 43(true) → 44 → Exit`

15. **Path 16** – `freeshipCount <= 1` nhưng `nonFreeshipCount > 2`: ném lỗi quá nhiều voucher giảm giá:
    `start → 1 → ... → 33(false) → 43(false) → 45(true) → 46 → Exit`

### Nhóm 9: Vòng lặp tính giảm giá sản phẩm (Node 49, 50, 52, 53, 55)
16. **Path 17** – Vòng lặp `validVouchers` lần 1: không có phần tử (validVouchers rỗng):
    `start → 1 → ... → 45(false) → 47 → 48 → 49(false) → 67 → ...`

17. **Path 18** – voucher type = PERCENT, `max_discount_amount = null`, `discount <= remaining`:
    `start → 1 → ... → 49(true) → 50(true) → 51 → 52(false) → 55(false) → 57 → 58 → 59 → 49 → ...`

18. **Path 19** – voucher type = PERCENT, `max_discount_amount != null` và `discount > max_discount_amount`, `discount <= remaining`:
    `start → 1 → ... → 49(true) → 50(true) → 51 → 52(true) → 53(true) → 54 → 55(false) → 57 → 58 → 59 → 49 → ...`

19. **Path 20** – voucher type = PERCENT, `max_discount_amount = true` nhưng `discount <= max_discount_amount`, `discount > remaining`:
    `start → 1 → ... → 49(true) → 50(true) → 51 → 52(true) → 53(false) → 55(true) → 56 → 57 → 58 → 59 → 49 → ...`

20. **Path 21** – voucher type = PERCENT, `discount > remaining` (cap discount):
    `start → 1 → ... → 49(true) → 50(true) → 51 → 52(false) → 55(true) → 56 → 57 → 58 → 59 → 49 → ...`

21. **Path 22** – voucher type = CASH, `discount <= remaining`:
    `start → 1 → ... → 49(true) → 50(false) → 60(true) → 61 → 62(false) → 64 → 65 → 66 → 49 → ...`

22. **Path 23** – voucher type = CASH, `discount > remaining`:
    `start → 1 → ... → 49(true) → 50(false) → 60(true) → 61 → 62(true) → 63 → 64 → 65 → 66 → 49 → ...`

23. **Path 24** – voucher type != PERCENT và != CASH (bỏ qua, không có else):
    `start → 1 → ... → 49(true) → 50(false) → 60(false) → 49 → ...`

### Nhóm 10: Vòng lặp tính giảm phí ship (Node 67, 68, 70, 71, 74, 77, 79)
24. **Path 25** – Vòng lặp 2 không có phần tử:
    `start → 1 → ... → 49(false) → 67(false) → 83 → ...`

25. **Path 26** – voucher type = FREESHIP_PERCENT, `max_discount_amount = null`, `discount <= (shipping - discount_so_far)`:
    `start → 1 → ... → 67(true) → 68(true) → 69 → 70(false) → 73 → 74(false) → 76 → 67 → ...`

26. **Path 27** – voucher type = FREESHIP_PERCENT, `max_discount_amount != null` và `discount > max`:
    `start → 1 → ... → 67(true) → 68(true) → 69 → 70(true) → 71(true) → 72 → 73 → 74(false) → 76 → 67 → ...`

27. **Path 28** – voucher type = FREESHIP_PERCENT, `discount > shippingFee - shippingDiscountAmount` (cap):
    `start → 1 → ... → 67(true) → 68(true) → 69 → 70(false) → 73 → 74(true) → 75 → 76 → 67 → ...`

28. **Path 29** – voucher type = FREESHIP_CASH, `discount <= (shipping - discount_so_far)`:
    `start → 1 → ... → 67(true) → 68(false) → 77(true) → 78 → 79(false) → 81 → 82 → 67 → ...`

29. **Path 30** – voucher type = FREESHIP_CASH, `discount > (shipping - discount_so_far)` (cap):
    `start → 1 → ... → 67(true) → 68(false) → 77(true) → 78 → 79(true) → 80 → 81 → 82 → 67 → ...`

30. **Path 31** – voucher type != FREESHIP_PERCENT và != FREESHIP_CASH:
    `start → 1 → ... → 67(true) → 68(false) → 77(false) → 67 → ...`

### Nhóm 11: Vòng lặp Redis deduct stock (Node 85, 87, 91, 95)
31. **Path 32** – Vòng lặp Redis không có phần tử (validOrderItems rỗng):
    `start → 1 → ... → 83 → 84 → 85(false) → 99 → ...`

32. **Path 33** – `res = -1` (chưa có cache), `setStockNx` rồi deduct lại, `res2 != 0` (thành công):
    `start → 1 → ... → 85(true) → 86 → 87(true) → 88 → 89 → 90 → 91(false) → 94 → 85 → ...`

33. **Path 34** – `res = -1`, deduct lại, `res2 = 0` (hết hàng, rollback Redis):
    `start → 1 → ... → 85(true) → 86 → 87(true) → 88 → 89 → 90 → 91(true) → 92 → 93 → Exit`

34. **Path 35** – `res = 0` (hết hàng ngay, rollback Redis):
    `start → 1 → ... → 85(true) → 86 → 87(false) → 95(true) → 96 → 97 → Exit`

35. **Path 36** – `res > 0` (deduct thành công):
    `start → 1 → ... → 85(true) → 86 → 87(false) → 95(false) → 98 → 85 → ...`

### Nhóm 12: Transaction - COD voucher validation (Node 104, 105, 107, 109)
36. **Path 37** – `paymentMethod = 'COD'`, không có validVouchers (vòng lặp 105 không chạy):
    `start → 1 → ... → 99 → ... → 103 → 104(true) → 105(false) → 113 → ...`

37. **Path 38** – `paymentMethod = 'COD'`, có voucher, `!lockedVoucher = true` (không tồn tại):
    `start → 1 → ... → 104(true) → 105(true) → 106 → 107(true) → 108 → 127 → ... → 132(thrown) → Exit`

38. **Path 39** – `paymentMethod = 'COD'`, có voucher, lockedVoucher tồn tại, `used_count >= total_limit`:
    `start → 1 → ... → 104(true) → 105(true) → 106 → 107(false) → 109(true) → 110 → 127 → ... → 132(thrown) → Exit`

39. **Path 40** – `paymentMethod = 'COD'`, voucher valid, sử dụng thành công, lặp tiếp:
    `start → 1 → ... → 104(true) → 105(true) → 106 → 107(false) → 109(false) → 111 → 112 → 105 → ...`

### Nhóm 13: Transaction - product stock update (Node 119, 121)
40. **Path 41** – Vòng lặp update product: `result.affected = 0` (không đủ hàng, rollback):
    `start → 1 → ... → 104(false) → 113 → ... → 119(true) → 120 → 121(true) → 122 → 127 → ... → 132(thrown) → Exit`

41. **Path 42** – Vòng lặp update product: thành công, `validVouchers.length > 0` (lưu orderVouchers):
    `start → 1 → ... → 119(true) → 120 → 121(false) → 119 → ... → 119(false) → 123(true) → 124 → 125 → 126 → 131 → 132(success) → ...`

42. **Path 43** – Vòng lặp update product: thành công, `validVouchers.length = 0` (không lưu vouchers):
    `start → 1 → ... → 119(true) → 120 → 121(false) → 119(false) → 123(false) → 126 → 131 → 132(success) → ...`

### Nhóm 14: Payment method routing sau transaction (Node 133, 136, 139, 144)
43. **Path 44** – `paymentMethod = 'MOMO'`, trả về payUrl MOMO:
    `start → 1 → ... → 132(success) → 133(true) → 134 → 135 → Exit`

44. **Path 45** – `paymentMethod = 'VNPAY'`, trả về payUrl VNPAY:
    `start → 1 → ... → 132(success) → 133(false) → 136(true) → 137 → 138 → Exit`
