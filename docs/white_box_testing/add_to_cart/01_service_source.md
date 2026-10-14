# 01. Source Code `addToCart`

File gốc: `backend/src/module/cart/cart.service.ts`  
Hàm: `addToCart`

```typescript
async addToCart(
  userId: string,
  productId: string,
  quantity: number,
): Promise<number> { // [1]
  let item = await this.cartItemRepository.findOne({ // [2]
    where: { user: { id: userId }, product: { id: productId } },
  });

  if (item) { // [3]
    item.quantity += quantity; // [4]
  } else {
    item = this.cartItemRepository.create({ // [5]
      user: { id: userId },
      product: { id: productId },
      quantity,
    });
  }
  await this.cartItemRepository.save(item); // [6]
  return this.getCartCount(userId); // [7]
}
```
