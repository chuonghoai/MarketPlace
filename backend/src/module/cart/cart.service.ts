import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { CustomException } from '../../core/exceptions/custom.exception';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getCartCount(userId: string): Promise<number> {
    const items = await this.cartItemRepository.find({
      where: { user: { id: userId } },
    });
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  async addToCart(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<number> {
    if (quantity <= 0) {
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        'INVALID_QUANTITY',
        'Số lượng phải lớn hơn 0',
      );
    }

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new CustomException(
        HttpStatus.NOT_FOUND,
        'NOT_FOUND',
        'Sản phẩm không tồn tại',
      );
    }

    let item = await this.cartItemRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    const currentQty = item ? item.quantity : 0;
    const targetQty = currentQty + quantity;

    if (targetQty > product.stock) {
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        'EXCEED_STOCK_LIMIT',
        `Số lượng vượt quá tồn kho khả dụng (còn ${product.stock} sản phẩm)`,
      );
    }

    if (item) {
      item.quantity = targetQty;
    } else {
      item = this.cartItemRepository.create({
        user: { id: userId },
        product: { id: productId },
        quantity: targetQty,
      });
    }
    await this.cartItemRepository.save(item);
    return this.getCartCount(userId);
  }

  async getCartItems(userId: string) {
    const items = await this.cartItemRepository.find({
      where: { user: { id: userId } },
      relations: ['product', 'product.seller', 'product.seller.user'],
    });

    return items.map((item) => ({
      product: {
        id: item.product.id,
        name: item.product.name,
        imageUrl: item.product.imageUrl,
        price: Number(item.product.price),
        stock: Number(item.product.stock ?? 0),
        description: item.product.description,
        seller: item.product.seller
          ? {
              id: item.product.seller.id,
              name: item.product.seller.user?.fullName,
              avatarUrl: item.product.seller.user?.avatarUrl,
              averageRating: item.product.seller.averageRating,
            }
          : null,
      },
      quantity: item.quantity,
    }));
  }

  async updateQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<number> {
    const item = await this.cartItemRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
      relations: ['product'],
    });

    if (!item) {
      throw new CustomException(
        HttpStatus.NOT_FOUND,
        'NOT_FOUND',
        'Sản phẩm không có trong giỏ hàng',
      );
    }

    if (quantity <= 0) {
      await this.cartItemRepository.remove(item);
    } else {
      if (item.product && quantity > item.product.stock) {
        throw new CustomException(
          HttpStatus.BAD_REQUEST,
          'EXCEED_STOCK_LIMIT',
          `Số lượng vượt quá tồn kho khả dụng (còn ${item.product.stock} sản phẩm)`,
        );
      }
      item.quantity = quantity;
      await this.cartItemRepository.save(item);
    }

    return this.getCartCount(userId);
  }

  async removeFromCart(userId: string, productId: string): Promise<number> {
    const item = await this.cartItemRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (item) {
      await this.cartItemRepository.remove(item);
    }

    return this.getCartCount(userId);
  }
}
