1. start → 1 → 2→ 3 → Exit

2. start → 1 → 2(false) → 4 → 5 → 6(true) → 7 → 8(true) → 9 → 11 → 12(PREPARING) → 13 → 19 → 20(true) → 22 → 23(true) → 24 → 25 → 26(false) → 30(false) → 31(false) → 37 → 38(PREPARING) → 39 → 46(false) → 48 → 49 → 50(false) → 54 → Exit

3. start → 1 → 2(false) → 4 → 5 → 6(false) → 8(false) → 10 → 11 → 12(SHIPPING) → 14 → 19 → 20(false) → 21 → 22 → 23(false) → 25 → 26(false) → 30(false) → 31(false) → 37 → 38(SHIPPING) → 40 → 46(false) → 48 → 49 → 50(false) → 54 → Exit

4. start → 1 → 2(false) → 4 → 5 → 6(false) → 8(true) → 9 → 11 → 12(DELIVERED) → 15 → 19 → 20(false) → 21 → 22 → 23(false) → 25 → 26(false) → 30(false) → 31(false) → 37 → 38(DELIVERED) → 41 → 46(false) → 48 → 49 → 50(false) → 54 → Exit

5. start → 1 → 2(false) → 4 → 5 → 6(false) → 8(false) → 10 → 11 → 12(SUCCESS) → 16 → 19 → 20(false) → 21 → 22 → 23(true) → 24 → 25 → 26(true) → 27(true) → 28(true) → 29 → 28(false) → 30(false) → 31(false) → 37 → 38(SUCCESS) → 42 → 46(false) → 48 → 49 → 50(true) → 51(true) → 52 → 53 → 54 → Exit

6. Path 6 – switch(status) = CANCELLED (node 12), status cũ != SUCCESS nên không restore, switch node 38 = CANCELLED, ternary node 46 = true → node 47, node 50 = false:
   `start → 1 → 2(false) → 4 → 5 → 6(false) → 8(false) → 10 → 11 → 12(CANCELLED) → 17 → 19 → 20(false) → 21 → 22 → 23(false) → 25 → 26(false) → 30(true) → 32 → 33(false) → 37 → 38(CANCELLED) → 43 → 46(true) → 47 → 49 → 50(false) → 54 → Exit`

7. Path 7 – switch(status) = RETURNED (node 12), status cũ != CANCELLED và != RETURNED → restore stock loop, switch node 38 = RETURNED, ternary node 46 = false, node 50 = false:
   `start → 1 → 2(false) → 4 → 5 → 6(false) → 8(false) → 10 → 11 → 12(RETURNED) → 18 → 19 → 20(false) → 21 → 22 → 23(false) → 25 → 26(false) → 30(true) → 31(true) → 32 → 33(true) → 34(true) → 35(true) → 36 → 35(false) → 37 → 38(RETURNED) → 44 → 46(false) → 48 → 49 → 50(false) → 54 → Exit`

8. Path 8 – switch(status) = default (node 12 không khớp case nào), ternary node 46 = false, node 50 = false:
   `start → 1 → 2(false) → 4 → 5 → 6(false) → 8(false) → 10 → 11 → 12(default) → 19 → 20(false) → 21 → 22 → 23(false) → 25 → 26(false) → 30(false) → 31(false) → 37 → 38(default) → 45 → 46(false) → 48 → 49 → 50(false) → 54 → Exit`

### Nhóm 5: Nhánh toán tử `||` tại node 20
9. Path 9 – node 20 = true (dùng `updateDto.note` làm note), switch 12 = PREPARING, switch 38 = PREPARING, node 50 = false:
   `start → 1 → 2(false) → 4 → 5 → 6(true) → 7 → 8(false) → 10 → 11 → 12(PREPARING) → 13 → 19 → 20(true) → 22 → 23(false) → 25 → 26(false) → 30(false) → 31(false) → 37 → 38(PREPARING) → 39 → 46(false) → 48 → 49 → 50(false) → 54 → Exit`

### Nhóm 6: Nhánh `node 23` (updateDto.note bên trong history.push)
10. Path 10 – node 23 = true (dùng note từ dto), node 24 gán note, switch 38 = SHIPPING, node 50 = false:
    `start → 1 → 2(false) → 4 → 5 → 6(true) → 7 → 8(false) → 10 → 11 → 12(SHIPPING) → 14 → 19 → 20(true) → 22 → 23(true) → 24 → 25 → 26(false) → 30(false) → 31(false) → 37 → 38(SHIPPING) → 40 → 46(false) → 48 → 49 → 50(false) → 54 → Exit`

### Nhóm 7: Nhánh `node 26` (`updateDto.status === SUCCESS`)
11. Path 11 – node 26 = true, node 27 = true (oldStatus != SUCCESS), thực hiện restore stock loop có item, switch 38 = SUCCESS, node 50 = false:
    `start → 1 → 2(false) → 4 → 5 → 6(false) → 8(false) → 10 → 11 → 12(SUCCESS) → 16 → 19 → 20(false) → 21 → 22 → 23(false) → 25 → 26(true) → 27(true) → 28(true) → 29 → 28(false) → 30(false) → 31(false) → 37 → 38(SUCCESS) → 42 → 46(false) → 48 → 49 → 50(false) → 54 → Exit`

12. Path 12 – node 26 = true, node 27 = false (oldStatus == SUCCESS, bỏ qua restore), switch 38 = SUCCESS, node 50 = false:
    `start → 1 → 2(false) → 4 → 5 → 6(false) → 8(false) → 10 → 11 → 12(SUCCESS) → 16 → 19 → 20(false) → 21 → 22 → 23(false) → 25 → 26(true) → 27(false) → 30(false) → 31(false) → 37 → 38(SUCCESS) → 42 → 46(false) → 48 → 49 → 50(false) → 54 → Exit`

13. Path 13 – node 26 = false (status != SUCCESS), không restore, switch 38 = PREPARING, node 50 = false:
    `start → 1 → 2(false) → 4 → 5 → 6(false) → 8(false) → 10 → 11 → 12(PREPARING) → 13 → 19 → 20(false) → 21 → 22 → 23(false) → 25 → 26(false) → 30(false) → 31(false) → 37 → 38(PREPARING) → 39 → 46(false) → 48 → 49 → 50(false) → 54 → Exit`

### Nhóm 8: Nhánh vòng lặp restore stock `node 28`
14. Path 14 – Vòng lặp restore stock node 28 chạy đúng 1 lần, switch 38 = SUCCESS, node 50 = false:
    `start → 1 → 2(false) → 4 → 5 → 6(false) → 8(false) → 10 → 11 → 12(SUCCESS) → 16 → 19 → 20(false) → 21 → 22 → 23(false) → 25 → 26(true) → 27(true) → 28(true) → 29 → 28(false) → 30(false) → 31(false) → 37 → 38(SUCCESS) → 42 → 46(false) → 48 → 49 → 50(false) → 54 → Exit`

15. Path 15 – Vòng lặp restore stock node 28 không chạy (order.items rỗng), switch 38 = SUCCESS, node 50 = false:
    `start → 1 → 2(false) → 4 → 5 → 6(false) → 8(false) → 10 → 11 → 12(SUCCESS) → 16 → 19 → 20(false) → 21 → 22 → 23(false) → 25 → 26(true) → 27(true) → 28(false) → 30(false) → 31(false) → 37 → 38(SUCCESS) → 42 → 46(false) → 48 → 49 → 50(false) → 54 → Exit`

### Nhóm 9: Nhánh `node 30` (`updateDto.status === CANCELLED`)
16. Path 16 – node 30 = true (status == CANCELLED), node 33 = false (oldStatus == CANCELLED), bỏ qua restore item loop, switch 38 = CANCELLED, ternary node 46 = true:
    `start → 1 → 2(false) → 4 → 5 → 6(false) → 8(false) → 10 → 11 → 12(CANCELLED) → 17 → 19 → 20(false) → 21 → 22 → 23(false) → 25 → 26(false) → 30(true) → 32 → 33(false) → 37 → 38(CANCELLED) → 43 → 46(true) → 47 → 49 → 50(false) → 54 → Exit`

17. Path 17 – node 30 = false, node 31 = false (status != CANCELLED và != RETURNED), không vào restore, switch 38 = DELIVERING, ternary node 46 = false:
    `start → 1 → 2(false) → 4 → 5 → 6(false) → 8(false) → 10 → 11 → 12(DELIVERED) → 15 → 19 → 20(false) → 21 → 22 → 23(false) → 25 → 26(false) → 30(false) → 31(false) → 37 → 38(DELIVERED) → 41 → 46(false) → 48 → 49 → 50(false) → 54 → Exit`

### Nhóm 10: Nhánh `node 31` (`updateDto.status === RETURNED`)
18. Path 18 – node 30 = false, node 31 = true (status == RETURNED), node 33 = true (oldStatus != CANCELLED), node 34 = true (oldStatus != RETURNED), vòng lặp restore item loop có item, switch 38 = RETURNED, node 46 = false:
    `start → 1 → 2(false) → 4 → 5 → 6(false) → 8(false) → 10 → 11 → 12(RETURNED) → 18 → 19 → 20(false) → 21 → 22 → 23(false) → 25 → 26(false) → 30(false) → 31(true) → 32 → 33(true) → 34(true) → 35(true) → 36 → 35(false) → 37 → 38(RETURNED) → 44 → 46(false) → 48 → 49 → 50(false) → 54 → Exit`

19. Path 19 – node 30 = false, node 31 = true, node 33 = true, node 34 = false (oldStatus == RETURNED), bỏ qua restore item loop, switch 38 = RETURNED, node 46 = false:
    `start → 1 → 2(false) → 4 → 5 → 6(false) → 8(false) → 10 → 11 → 12(RETURNED) → 18 → 19 → 20(false) → 21 → 22 → 23(false) → 25 → 26(false) → 30(false) → 31(true) → 32 → 33(true) → 34(false) → 37 → 38(RETURNED) → 44 → 46(false) → 48 → 49 → 50(false) → 54 → Exit`

20. Path 20 – node 30 = true, node 33 = true (oldStatus != CANCELLED), node 34 = true (oldStatus != RETURNED), vòng lặp restore item có item, switch 38 = CANCELLED, node 46 = true:
    `start → 1 → 2(false) → 4 → 5 → 6(false) → 8(false) → 10 → 11 → 12(CANCELLED) → 17 → 19 → 20(false) → 21 → 22 → 23(false) → 25 → 26(false) → 30(true) → 32 → 33(true) → 34(true) → 35(true) → 36 → 35(false) → 37 → 38(CANCELLED) → 43 → 46(true) → 47 → 49 → 50(false) → 54 → Exit`

### Nhóm 11: Vòng lặp restore item `node 35`
21. Path 21 – Vòng lặp restore item node 35 chạy đúng 1 lần:
    `start → 1 → 2(false) → 4 → 5 → 6(false) → 8(false) → 10 → 11 → 12(CANCELLED) → 17 → 19 → 20(false) → 21 → 22 → 23(false) → 25 → 26(false) → 30(true) → 32 → 33(true) → 34(true) → 35(true) → 36 → 35(false) → 37 → 38(CANCELLED) → 43 → 46(false) → 48 → 49 → 50(false) → 54 → Exit`

22. Path 22 – Vòng lặp restore item không chạy (order.items rỗng):
    `start → 1 → 2(false) → 4 → 5 → 6(false) → 8(false) → 10 → 11 → 12(CANCELLED) → 17 → 19 → 20(false) → 21 → 22 → 23(false) → 25 → 26(false) → 30(true) → 32 → 33(true) → 34(true) → 35(false) → 37 → 38(CANCELLED) → 43 → 46(false) → 48 → 49 → 50(false) → 54 → Exit`

### Nhóm 12: Các nhánh `switch` node 38 (6 case còn lại)
23. Path 23 – switch node 38 = default (trạng thái không khớp), node 46 = false, node 50 = false:
    `start → 1 → 2(false) → 4 → 5 → 6(false) → 8(false) → 10 → 11 → 12(default) → 19 → 20(false) → 21 → 22 → 23(false) → 25 → 26(false) → 30(false) → 31(false) → 37 → 38(default) → 45 → 46(false) → 48 → 49 → 50(false) → 54 → Exit`

### Nhóm 13: Nhánh `node 46` (ternary cancelReason)
24. Path 24 – node 46 = true (status == CANCELLED), node 47 gán cancelReason từ note, node 50 = false:
    `start → 1 → 2(false) → 4 → 5 → 6(false) → 8(false) → 10 → 11 → 12(CANCELLED) → 17 → 19 → 20(false) → 21 → 22 → 23(false) → 25 → 26(false) → 30(true) → 32 → 33(false) → 37 → 38(CANCELLED) → 43 → 46(true) → 47 → 49 → 50(false) → 54 → Exit`

25. Path 25 – node 46 = false (status != CANCELLED), node 48 không gán cancelReason, node 50 = false:
    `start → 1 → 2(false) → 4 → 5 → 6(false) → 8(false) → 10 → 11 → 12(PREPARING) → 13 → 19 → 20(false) → 21 → 22 → 23(false) → 25 → 26(false) → 30(false) → 31(false) → 37 → 38(PREPARING) → 39 → 46(false) → 48 → 49 → 50(false) → 54 → Exit`

### Nhóm 14: Nhánh `node 50` và `node 51` (refund logic)
26. Path 26 – node 50 = true (SUCCESS), node 51 = true (COD), thực hiện tạo và gửi refund wallet, node 52 → 53:
    `start → 1 → 2(false) → 4 → 5 → 6(false) → 8(false) → 10 → 11 → 12(SUCCESS) → 16 → 19 → 20(false) → 21 → 22 → 23(false) → 25 → 26(true) → 27(true) → 28(false) → 30(false) → 31(false) → 37 → 38(SUCCESS) → 42 → 46(false) → 48 → 49 → 50(true) → 51(true) → 52 → 53 → 54 → Exit`

27. Path 27 – node 50 = true (SUCCESS), node 51 = false (không phải COD), bỏ qua refund, node 54:
    `start → 1 → 2(false) → 4 → 5 → 6(false) → 8(false) → 10 → 11 → 12(SUCCESS) → 16 → 19 → 20(false) → 21 → 22 → 23(false) → 25 → 26(true) → 27(true) → 28(false) → 30(false) → 31(false) → 37 → 38(SUCCESS) → 42 → 46(false) → 48 → 49 → 50(true) → 51(false) → 54 → Exit`

28. Path 28 – node 50 = false (status != SUCCESS), bỏ qua logic refund, node 54:
    `start → 1 → 2(false) → 4 → 5 → 6(false) → 8(false) → 10 → 11 → 12(SHIPPING) → 14 → 19 → 20(false) → 21 → 22 → 23(false) → 25 → 26(false) → 30(false) → 31(false) → 37 → 38(SHIPPING) → 40 → 46(false) → 48 → 49 → 50(false) → 54 → Exit`

29. Path 29 – Kết hợp: Có note, `Array.isArray = true`, update SUCCESS, oldStatus == SUCCESS (skip restore), switch 38 = SUCCESS, ternary 46 = false, node 50 = true, node 51 = true (đường tổng hợp):
    `start → 1 → 2(false) → 4 → 5 → 6(true) → 7 → 8(true) → 9 → 11 → 12(SUCCESS) → 16 → 19 → 20(true) → 22 → 23(true) → 24 → 25 → 26(true) → 27(false) → 30(false) → 31(false) → 37 → 38(SUCCESS) → 42 → 46(false) → 48 → 49 → 50(true) → 51(true) → 52 → 53 → 54 → Exit`
