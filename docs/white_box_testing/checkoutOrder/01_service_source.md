# Mã nguồn Service `checkoutOrder`

File gốc: `backend/src/module/checkout/checkout.service.ts`

```typescript
async checkoutOrder(createOrderDto: CreateOrderDto, userId: string, ipAddr: string = '127.0.0.1'): Promise<{ orderId: string; payUrl: string | null, paymentRequired: boolean }> {
  // [1]
  if (!createOrderDto.items || createOrderDto.items.length === 0) { // [2] (!createOrderDto.items), [3] (length === 0)
    // [4]
    throw new BadRequestException('Giỏ hàng trống');
  }

  // [5]
  const address = await this.addressRepository.findOne({ where: { id: createOrderDto.addressId, userId } });
  
  // [6]
  if (!address) {
    // [7]
    throw new NotFoundException('Không tìm thấy địa chỉ giao hàng');
  }

  // [8]
  const productIds = createOrderDto.items.map((i) => i.productId);
  // [9]
  const products = await this.productRepository.findBy({ id: In(productIds) });
  // [10]
  const productMap = new Map(products.map((p) => [p.id, p]));
  // [11]
  let subTotal = 0;
  // [12]
  const validOrderItems = [];

  // [13]
  for (const item of createOrderDto.items) {
    // [14]
    const product = productMap.get(item.productId);
    
    // [15]
    if (!product) {
      // [16]
      throw new NotFoundException(`Sản phẩm ${item.productId} không tồn tại`);
    }
    
    // [17]
    if (item.quantity > product.stock) {
      // [18]
      throw new BadRequestException(`Sản phẩm "${product.name}" không đủ hàng`);
    }

    // [19]
    const price = Number(product.price);
    // [20]
    subTotal += price * item.quantity;
    // [21]
    validOrderItems.push({ /* ... */ });
  }

  // [22]
  const { boxLength, boxWidth, boxHeight, boxWeight, packingResult } = this.shippingService.calculateOptimalBox(createOrderDto.items, productMap);
  
  // [23]
  if (packingResult) {
    // [24]
    console.log("[checkoutOrder] Kiện hàng tối ưu:", packingResult);
  }

  // [25]
  const shippingFee = await this.shippingService.calcShippingFeeGHN(address.districtCode, address.wardCode.toString(), boxWeight, boxLength, boxWidth, boxHeight);
  
  // [26]
  let discountAmount = 0;
  // [27]
  let shippingDiscountAmount = 0;
  // [28]
  let validVouchers: Voucher[] = [];

  // [29]
  if (createOrderDto.voucherCodes && createOrderDto.voucherCodes.length > 0) { // [30], [31]
    // [32]
    let freeshipCount = 0;
    // [33]
    let nonFreeshipCount = 0;

    // [34]
    for (const code of createOrderDto.voucherCodes) {
      try { // [35]
        // [36]
        const voucher = await this.vouchersService.checkVoucherEligibility(code, userId, subTotal);
        // [37]
        validVouchers.push(voucher);
        
        // [38]
        if (voucher.voucher_type === VoucherType.FREESHIP_CASH || voucher.voucher_type === VoucherType.FREESHIP_PERCENT) { // [39], [40]
          // [41]
          freeshipCount++;
        } else {
          // [42]
          nonFreeshipCount++;
        }
      } catch (e) { // [43]
        // [44]
        throw new BadRequestException(e.message);
      }
    }

    // [45]
    if (freeshipCount > 1) {
      // [46]
      throw new BadRequestException('Chỉ được áp dụng tối đa 1 mã miễn phí vận chuyển');
    }
    
    // [47]
    if (nonFreeshipCount > 2) {
      // [48]
      throw new BadRequestException('Chỉ được áp dụng tối đa 2 mã giảm giá sản phẩm');
    }

    // [49]
    validVouchers.sort((a, b) => { /* ... */ });
    
    // [50]
    let remainingSubTotal = subTotal;
    
    // [51]
    for (const v of validVouchers) {
      // [52]
      if (v.voucher_type === VoucherType.PERCENT) {
        // [53]
        let discount = (subTotal * Number(v.discount_value)) / 100;
        
        // [54]
        if (v.max_discount_amount && discount > Number(v.max_discount_amount)) { // [55], [56]
          // [57]
          discount = Number(v.max_discount_amount);
        }
        
        // [58]
        if (discount > remainingSubTotal) {
          // [59]
          discount = remainingSubTotal;
        }
        
        // [60]
        discountAmount += discount;
        // [61]
        remainingSubTotal -= discount;
        // [62]
        (v as any)._calculatedDiscount = discount;
      } else if (v.voucher_type === VoucherType.CASH) { // [63]
        // [64]
        let discount = Number(v.discount_value);
        
        // [65]
        if (discount > remainingSubTotal) {
          // [66]
          discount = remainingSubTotal;
        }
        
        // [67]
        discountAmount += discount;
        // [68]
        remainingSubTotal -= discount;
        // [69]
        (v as any)._calculatedDiscount = discount;
      }
    }

    // [70]
    for (const v of validVouchers) {
      // [71]
      if (v.voucher_type === VoucherType.FREESHIP_PERCENT) {
        // [72]
        let discount = (shippingFee * Number(v.discount_value)) / 100;
        
        // [73]
        if (v.max_discount_amount && discount > Number(v.max_discount_amount)) { // [74], [75]
          // [76]
          discount = Number(v.max_discount_amount);
        }
        
        // [77]
        if (discount > shippingFee - shippingDiscountAmount) {
          // [78]
          discount = shippingFee - shippingDiscountAmount;
        }
        
        // [79]
        shippingDiscountAmount += discount;
        // [80]
        (v as any)._calculatedDiscount = discount;
      } else if (v.voucher_type === VoucherType.FREESHIP_CASH) { // [81]
        // [82]
        let discount = Number(v.discount_value);
        
        // [83]
        if (discount > shippingFee - shippingDiscountAmount) {
          // [84]
          discount = shippingFee - shippingDiscountAmount;
        }
        
        // [85]
        shippingDiscountAmount += discount;
        // [86]
        (v as any)._calculatedDiscount = discount;
      }
    }
  }

  // [87]
  const totalAmount = subTotal - discountAmount + shippingFee - shippingDiscountAmount;

  // [88]
  const redisDeductedItems: { productId: string; quantity: number }[] = [];
  
  // [89]
  for (const item of validOrderItems) {
    // [90]
    const res = await this.redisService.deductStock(item.productId, item.quantity);
    
    // [91]
    if (res === -1) {
      // [92]
      const product = productMap.get(item.productId);
      // [93]
      await this.redisService.setStockNx(item.productId, product!.stock);
      // [94]
      const res2 = await this.redisService.deductStock(item.productId, item.quantity);
      
      // [95]
      if (res2 === 0) {
        // [96]
        await this.redisService.restoreStock(redisDeductedItems);
        // [97]
        throw new BadRequestException(`Rất tiếc, sản phẩm đã hết hàng (Redis)`);
      } else {
        // [98]
        redisDeductedItems.push({ productId: item.productId, quantity: item.quantity });
      }
    } else if (res === 0) { // [99]
      // [100]
      await this.redisService.restoreStock(redisDeductedItems);
      // [101]
      throw new BadRequestException(`Rất tiếc, sản phẩm đã hết hàng (Redis)`);
    } else {
      // [102]
      redisDeductedItems.push({ productId: item.productId, quantity: item.quantity });
    }
  }

  // [103]
  const queryRunner = this.dataSource.createQueryRunner();
  // [104]
  await queryRunner.connect();
  // [105]
  await queryRunner.startTransaction();
  
  // [106]
  let orderId: string;
  
  try { // [107]
    // [108]
    if (createOrderDto.paymentMethod === 'COD') {
      // [109]
      for (const v of validVouchers) {
        // [110]
        const lockedVoucher = await queryRunner.manager.createQueryBuilder(Voucher, 'voucher').getOne();
        
        // [111]
        if (!lockedVoucher) {
          // [112]
          throw new BadRequestException(`Mã voucher không tồn tại`);
        }
        
        // [113]
        if (lockedVoucher.used_count >= lockedVoucher.total_limit) {
          // [114]
          throw new BadRequestException(`Mã voucher đã hết lượt sử dụng`);
        }
        
        // [115]
        lockedVoucher.used_count += 1;
        // [116]
        await queryRunner.manager.save(lockedVoucher);
      }
    }

    // [117]
    let order = queryRunner.manager.create(Order, { /* ... */ });
    // [118]
    order = await queryRunner.manager.save(order);
    // [119]
    orderId = order.id;

    // [120]
    const orderItems = validOrderItems.map((item) => queryRunner.manager.create(OrderItem, { /* ... */ }));
    // [121]
    await queryRunner.manager.save(orderItems);

    // [122]
    validOrderItems.sort((a, b) => a.productId.localeCompare(b.productId));

    // [123]
    for (const item of validOrderItems) {
      // [124]
      const result = await queryRunner.manager.update(Product, /* ... */);
      
      // [125]
      if (result.affected === 0) {
        // [126]
        throw new BadRequestException(`Rất tiếc, sản phẩm không đủ số lượng`);
      }
    }

    // [127]
    if (validVouchers.length > 0) {
      // [128]
      const orderVouchers = validVouchers.map(v => { /* ... */ });
      // [129]
      await queryRunner.manager.save(orderVouchers);
    }

    // [130]
    await queryRunner.commitTransaction();
  } catch (e) { // [131]
    // [132]
    await queryRunner.rollbackTransaction();
    // [133]
    await this.redisService.restoreStock(redisDeductedItems);
    // [134]
    throw e;
  } finally { // [135]
    // [136]
    await queryRunner.release();
  }

  // [137]
  if (createOrderDto.paymentMethod === 'MOMO') {
    // [138]
    const payUrl = await this.momoService.buildMoMoPaymentUrl(orderId, totalAmount);
    // [139]
    return { orderId, payUrl, paymentRequired: true };
  }

  // [140]
  if (createOrderDto.paymentMethod === 'VNPAY') {
    // [141]
    const payUrl = this.vnpayService.buildVnpayPaymentUrl(orderId, totalAmount, ipAddr);
    // [142]
    return { orderId, payUrl, paymentRequired: true };
  }

  // [143]
  if (createOrderDto.paymentMethod === 'PAYPAL') {
    // [144]
    const payUrl = await this.paypalService.buildPayPalPaymentUrl(orderId, totalAmount);
    // [145]
    return { orderId, payUrl, paymentRequired: true };
  }

  // [146]
  await this.clearPurchasedItemsFromCart(userId, productIds);

  // [147]
  const user = await this.userRepository.findOne({ where: { id: userId } });
  
  // [148]
  if (user) {
    // [149]
    this.mailService.sendOrderStatusUpdateEmail(/* ... */);
  }

  // [150]
  return { orderId, payUrl: null, paymentRequired: false };
}
```
