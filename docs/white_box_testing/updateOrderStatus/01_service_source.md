# Mã nguồn Service `updateOrderStatus`

File gốc: `backend/src/module/orders/orders.service.ts`

```typescript
async updateOrderStatus(id: string, updateDto: UpdateOrderStatusDto): Promise<OrderDetailDto> {
  const order = await this.orderRepository.findOne({ where: { id }, relations: ['items', 'address'] }); // [1]
  if (!order) { // [2]
    throw new NotFoundException(`Không tìm thấy đơn hàng với ID ${id}`); // [3]
  }

  const oldStatus = order.status; // [4]
  order.status = updateDto.status; // [5]

  if (updateDto.note) { // [6]
    order.note = updateDto.note; // [7]
  }

  const history = Array.isArray(order.statusHistory) // [8]
    ? order.statusHistory // [9]
    : [ // [10]
        {
          status: EOrderStatus.PENDING,
          timestamp: order.createdAt,
          note: 'Đơn hàng đã được tạo'
        }
      ];

  let defaultNote = 'Admin cập nhật trạng thái'; // [11]
  switch (updateDto.status) { // [12]
    case EOrderStatus.PREPARING:
      defaultNote = 'Shop đang chuẩn bị hàng'; // [13]
      break;
    case EOrderStatus.SHIPPING:
      defaultNote = 'Đơn hàng đang được giao'; // [14]
      break;
    case EOrderStatus.DELIVERED:
      defaultNote = 'Đơn hàng đã được giao thành công'; // [15]
      break;
    case EOrderStatus.SUCCESS:
      defaultNote = 'Đơn hàng đã hoàn tất'; // [16]
      break;
    case EOrderStatus.CANCELLED:
      defaultNote = 'Đơn hàng đã bị hủy'; // [17]
      break;
    case EOrderStatus.RETURNED:
      defaultNote = 'Yêu cầu trả hàng/hoàn tiền'; // [18]
      break;
  }

  history.push({ // [19]
    status: updateDto.status,
    timestamp: new Date(),
    note: updateDto.note || defaultNote // [20] updateDto.note (if true), [21] defaultNote (if false)
  });

  order.statusHistory = history; // [22]
  if (updateDto.status === EOrderStatus.SUCCESS) { // [23]
    order.paymentStatus = EPaymentStatus.PAID; // [24]
  }
  const saved = await this.orderRepository.save(order); // [25]

  if (updateDto.status === EOrderStatus.SUCCESS) { // [26]
    if (oldStatus !== EOrderStatus.SUCCESS) { // [27]
      for (const item of order.items) { // [28]
        await this.productRepository.increment({ id: item.productId }, 'soldCount', item.quantity); // [29]
      }
    }
  }

  if (updateDto.status === EOrderStatus.CANCELLED || updateDto.status === EOrderStatus.RETURNED) { // [30], [31]
    await this.checkoutService.rollbackVouchersForOrder(order.id); // [32]
    if (oldStatus !== EOrderStatus.CANCELLED && oldStatus !== EOrderStatus.RETURNED) { // [33], [34]
      for (const item of order.items) { // [35]
        await this.productRepository.increment({ id: item.productId }, 'stock', item.quantity); // [36]
      }
    }
  }

  let newStatusStr = ''; // [37]
  switch (updateDto.status) { // [38]
    case EOrderStatus.PREPARING: 
      newStatusStr = 'Đơn hàng đang được chuẩn bị'; // [39]
      break;
    case EOrderStatus.SHIPPING: 
      newStatusStr = 'Đơn hàng đang được giao, vui lòng chú ý điện thoại'; // [40]
      break;
    case EOrderStatus.DELIVERED: 
      newStatusStr = 'Giao hàng thành công'; // [41]
      break;
    case EOrderStatus.SUCCESS: 
      newStatusStr = 'Đơn hàng đã hoàn tất'; // [42]
      break;
    case EOrderStatus.CANCELLED: 
      newStatusStr = 'Đơn hàng của bạn đã bị hủy'; // [43]
      break;
    case EOrderStatus.RETURNED: 
      newStatusStr = 'Yêu cầu trả hàng/hoàn tiền'; // [44]
      break;
    default: 
      newStatusStr = 'Đã cập nhật'; // [45]
      break;
  }
  
  const cancelReason = updateDto.status === EOrderStatus.CANCELLED // [46]
    ? updateDto.note // [47]
    : undefined; // [48]

  this.sendStatusUpdateEmail(saved, newStatusStr, cancelReason); // [49]

  if (updateDto.status === EOrderStatus.SUCCESS && saved.paymentMethod === EPaymentMethod.COD) { // [50], [51]
    console.log('Send billing email to user'); // [52]
    this.sendBillingEmail(saved); // [53]
  }

  return this.mapToOrderDetailDto(saved); // [54]
}
```
