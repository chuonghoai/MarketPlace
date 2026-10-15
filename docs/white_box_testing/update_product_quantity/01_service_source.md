# Mã nguồn chức năng Update Quantity (Giỏ hàng)

**Đường dẫn file**: `backend/src/module/cart/cart.service.ts`
**Hàm**: `updateQuantity`

```typescript
  async updateQuantity(userId: string, productId: string, quantity: number): Promise<number> { // [1]
    const item = await this.cartItemRepository.findOne({ // [2]
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (!item) { // [3]
      throw new CustomException(HttpStatus.NOT_FOUND, 'NOT_FOUND', 'Sản phẩm không có trong giỏ hàng'); // [4]
    }

    if (quantity <= 0) { // [5]
      await this.cartItemRepository.remove(item); // [6]
    } else {
      item.quantity = quantity; // [7]
      await this.cartItemRepository.save(item); // [8]
    }

    return this.getCartCount(userId); // [9]
  }
```

*(Lưu ý: `getCartCount` là một hàm khác trong service được gọi nội bộ tại node `[9]` để trả về kết quả cuối cùng, chúng ta đóng gói thành phần này vào node `[9]` để giữ flow logic của hàm chính được trong suốt)*
