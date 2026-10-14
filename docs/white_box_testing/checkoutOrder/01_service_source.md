# Mã nguồn Service `checkoutOrder`

File gốc: `backend/src/module/checkout/checkout.service.ts`

```typescript
async checkoutOrder(createOrderDto: CreateOrderDto, userId: string, ipAddr: string = '127.0.0.1'): Promise<{ orderId: string; payUrl: string | null, paymentRequired: boolean }> { // [1]
  if (!createOrderDto.items /* [2] */ || createOrderDto.items.length === 0 /* [3] */ ) {
    throw new BadRequestException('Giỏ hàng trống'); // [4]
  }

  const address = await this.addressRepository.findOne({ where: { id: createOrderDto.addressId, userId } }); // [5]
  
  if (!address) { // [6]
    throw new NotFoundException('Không tìm thấy địa chỉ giao hàng'); // [7]
  }

  const productIds = createOrderDto.items.map((i) => i.productId); // [8]
  const products = await this.productRepository.findBy({ id: In(productIds) }); // [9]
  const productMap = new Map(products.map((p) => [p.id, p])); // [10]
  let subTotal = 0; // [11]
  const validOrderItems = []; // [12]

  for (const item of createOrderDto.items) { // [13]
    const product = productMap.get(item.productId); // [14]
    
    if (!product) { // [15]
      throw new NotFoundException(`Sản phẩm ${item.productId} không tồn tại`); // [16]
    }
    
    if (item.quantity > product.stock) { // [17]
      throw new BadRequestException(`Sản phẩm "${product.name}" không đủ hàng`); // [18]
    }

    const price = Number(product.price); // [19]
    subTotal += price * item.quantity; // [20]
    validOrderItems.push({ /* ... */ }); // [21]
  }

  const { boxLength, boxWidth, boxHeight, boxWeight, packingResult } = this.shippingService.calculateOptimalBox(createOrderDto.items, productMap); // [22]
  
  if (packingResult) { // [23]
    console.log("[checkoutOrder] Kiện hàng tối ưu:", packingResult); // [24]
  }

  const shippingFee = await this.shippingService.calcShippingFeeGHN(address.districtCode, address.wardCode.toString(), boxWeight, boxLength, boxWidth, boxHeight); // [25]
  
  let discountAmount = 0; // [26]
  let shippingDiscountAmount = 0; // [27]
  let validVouchers: Voucher[] = []; // [28]

  if (createOrderDto.voucherCodes /* [29] */ && createOrderDto.voucherCodes.length > 0 /* [30] */ ) {
    let freeshipCount = 0; // [31]
    let nonFreeshipCount = 0; // [32]

    for (const code of createOrderDto.voucherCodes) { // [33]
      try { // [34]
        const voucher = await this.vouchersService.checkVoucherEligibility(code, userId, subTotal); // [35]
        validVouchers.push(voucher); // [36]
        
        if (voucher.voucher_type === VoucherType.FREESHIP_CASH /* [37] */ || voucher.voucher_type === VoucherType.FREESHIP_PERCENT /* [38] */ ) {
          freeshipCount++; // [39]
        } else {
          nonFreeshipCount++; // [40]
        }
      } catch (e) { // [41]
        throw new BadRequestException(e.message); // [42]
      }
    }

    if (freeshipCount > 1) { // [43]
      throw new BadRequestException('Chỉ được áp dụng tối đa 1 mã miễn phí vận chuyển'); // [44]
    }
    
    if (nonFreeshipCount > 2) { // [45]
      throw new BadRequestException('Chỉ được áp dụng tối đa 2 mã giảm giá sản phẩm'); // [46]
    }

    validVouchers.sort((a, b) => { /* ... */ }); // [47]
    
    let remainingSubTotal = subTotal; // [48]
    
    for (const v of validVouchers) { // [49]
      if (v.voucher_type === VoucherType.PERCENT) { // [50]
        let discount = (subTotal * Number(v.discount_value)) / 100; // [51]
        
        if (v.max_discount_amount /* [52] */ && discount > Number(v.max_discount_amount) /* [53] */ ) {
          discount = Number(v.max_discount_amount); // [54]
        }
        
        if (discount > remainingSubTotal) { // [55]
          discount = remainingSubTotal; // [56]
        }
        
        discountAmount += discount; // [57]
        remainingSubTotal -= discount; // [58]
        (v as any)._calculatedDiscount = discount; // [59]
      } else if (v.voucher_type === VoucherType.CASH) { // [60]
        let discount = Number(v.discount_value); // [61]
        
        if (discount > remainingSubTotal) { // [62]
          discount = remainingSubTotal; // [63]
        }
        
        discountAmount += discount; // [64]
        remainingSubTotal -= discount; // [65]
        (v as any)._calculatedDiscount = discount; // [66]
      }
    }

    for (const v of validVouchers) { // [67]
      if (v.voucher_type === VoucherType.FREESHIP_PERCENT) { // [68]
        let discount = (shippingFee * Number(v.discount_value)) / 100; // [69]
        
        if (v.max_discount_amount /* [70] */ && discount > Number(v.max_discount_amount) /* [71] */ ) {
          discount = Number(v.max_discount_amount); // [72]
        }
        
        if (discount > shippingFee - shippingDiscountAmount) { // [73]
          discount = shippingFee - shippingDiscountAmount; // [74]
        }
        
        shippingDiscountAmount += discount; // [75]
        (v as any)._calculatedDiscount = discount; // [76]
      } else if (v.voucher_type === VoucherType.FREESHIP_CASH) { // [77]
        let discount = Number(v.discount_value); // [78]
        
        if (discount > shippingFee - shippingDiscountAmount) { // [79]
          discount = shippingFee - shippingDiscountAmount; // [80]
        }
        
        shippingDiscountAmount += discount; // [81]
        (v as any)._calculatedDiscount = discount; // [82]
      }
    }
  }

  const totalAmount = subTotal - discountAmount + shippingFee - shippingDiscountAmount; // [83]

  const redisDeductedItems: { productId: string; quantity: number }[] = []; // [84]
  
  for (const item of validOrderItems) { // [85]
    const res = await this.redisService.deductStock(item.productId, item.quantity); // [86]
    
    if (res === -1) { // [87]
      const product = productMap.get(item.productId); // [88]
      await this.redisService.setStockNx(item.productId, product!.stock); // [89]
      const res2 = await this.redisService.deductStock(item.productId, item.quantity); // [90]
      
      if (res2 === 0) { // [91]
        await this.redisService.restoreStock(redisDeductedItems); // [92]
        throw new BadRequestException(`Rất tiếc, sản phẩm đã hết hàng (Redis)`); // [93]
      } else {
        redisDeductedItems.push({ productId: item.productId, quantity: item.quantity }); // [94]
      }
    } else if (res === 0) { // [95]
      await this.redisService.restoreStock(redisDeductedItems); // [96]
      throw new BadRequestException(`Rất tiếc, sản phẩm đã hết hàng (Redis)`); // [97]
    } else {
      redisDeductedItems.push({ productId: item.productId, quantity: item.quantity }); // [98]
    }
  }

  const queryRunner = this.dataSource.createQueryRunner(); // [99]
  await queryRunner.connect(); // [100]
  await queryRunner.startTransaction(); // [101]
  
  let orderId: string; // [102]
  
  try { // [103]
    if (createOrderDto.paymentMethod === 'COD') { // [104]
      for (const v of validVouchers) { // [105]
        const lockedVoucher = await queryRunner.manager.createQueryBuilder(Voucher, 'voucher').getOne(); // [106]
        
        if (!lockedVoucher) { // [107]
          throw new BadRequestException(`Mã voucher không tồn tại`); // [108]
        }
        
        if (lockedVoucher.used_count >= lockedVoucher.total_limit) { // [109]
          throw new BadRequestException(`Mã voucher đã hết lượt sử dụng`); // [110]
        }
        
        lockedVoucher.used_count += 1; // [111]
        await queryRunner.manager.save(lockedVoucher); // [112]
      }
    }

    let order = queryRunner.manager.create(Order, { /* ... */ }); // [113]
    order = await queryRunner.manager.save(order); // [114]
    orderId = order.id; // [115]

    const orderItems = validOrderItems.map((item) => queryRunner.manager.create(OrderItem, { /* ... */ })); // [116]
    await queryRunner.manager.save(orderItems); // [117]

    validOrderItems.sort((a, b) => a.productId.localeCompare(b.productId)); // [118]

    for (const item of validOrderItems) { // [119]
      const result = await queryRunner.manager.update(Product, /* ... */); // [120]
      
      if (result.affected === 0) { // [121]
        throw new BadRequestException(`Rất tiếc, sản phẩm không đủ số lượng`); // [122]
      }
    }

    if (validVouchers.length > 0) { // [123]
      const orderVouchers = validVouchers.map(v => { /* ... */ }); // [124]
      await queryRunner.manager.save(orderVouchers); // [125]
    }

    await queryRunner.commitTransaction(); // [126]
  } catch (e) { // [127]
    await queryRunner.rollbackTransaction(); // [128]
    await this.redisService.restoreStock(redisDeductedItems); // [129]
    throw e; // [130]
  } finally { // [131]
    await queryRunner.release(); // [132]
  }

  if (createOrderDto.paymentMethod === 'MOMO') { // [133]
    const payUrl = await this.momoService.buildMoMoPaymentUrl(orderId, totalAmount); // [134]
    return { orderId, payUrl, paymentRequired: true }; // [135]
  }

  if (createOrderDto.paymentMethod === 'VNPAY') { // [136]
    const payUrl = this.vnpayService.buildVnpayPaymentUrl(orderId, totalAmount, ipAddr); // [137]
    return { orderId, payUrl, paymentRequired: true }; // [138]
  }

  if (createOrderDto.paymentMethod === 'PAYPAL') { // [139]
    const payUrl = await this.paypalService.buildPayPalPaymentUrl(orderId, totalAmount); // [140]
    return { orderId, payUrl, paymentRequired: true }; // [141]
  }

  await this.clearPurchasedItemsFromCart(userId, productIds); // [142]

  const user = await this.userRepository.findOne({ where: { id: userId } }); // [143]
  
  if (user) { // [144]
    this.mailService.sendOrderStatusUpdateEmail(/* ... */); // [145]
  }

  return { orderId, payUrl: null, paymentRequired: false }; // [146]
}
```
