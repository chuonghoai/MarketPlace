import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { CustomException } from '../../core/exceptions/custom.exception';

describe('CartService - Stock Limit Validation', () => {
  let service: CartService;
  let cartItemRepo: any;
  let productRepo: any;

  beforeEach(async () => {
    cartItemRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    productRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(CartItem),
          useValue: cartItemRepo,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: productRepo,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  describe('addToCart', () => {
    it('should throw EXCEED_STOCK_LIMIT when quantity exceeds available product stock', async () => {
      productRepo.findOne.mockResolvedValue({ id: 'prod-1', stock: 3 });
      cartItemRepo.findOne.mockResolvedValue(null);

      await expect(service.addToCart('user-1', 'prod-1', 4)).rejects.toThrow(
        CustomException,
      );
    });

    it('should allow adding when quantity is within product stock', async () => {
      productRepo.findOne.mockResolvedValue({ id: 'prod-1', stock: 5 });
      cartItemRepo.findOne.mockResolvedValue(null);
      cartItemRepo.create.mockReturnValue({
        user: { id: 'user-1' },
        product: { id: 'prod-1' },
        quantity: 3,
      });
      cartItemRepo.save.mockResolvedValue({});
      cartItemRepo.find.mockResolvedValue([{ quantity: 3 }]);

      const count = await service.addToCart('user-1', 'prod-1', 3);
      expect(count).toBe(3);
    });
  });

  describe('updateQuantity', () => {
    it('should throw EXCEED_STOCK_LIMIT when new quantity exceeds product stock', async () => {
      cartItemRepo.findOne.mockResolvedValue({
        id: 'item-1',
        quantity: 3,
        product: { id: 'prod-1', stock: 3 },
      });

      await expect(service.updateQuantity('user-1', 'prod-1', 4)).rejects.toThrow(
        CustomException,
      );
    });

    it('should update quantity successfully when within stock', async () => {
      cartItemRepo.findOne.mockResolvedValue({
        id: 'item-1',
        quantity: 2,
        product: { id: 'prod-1', stock: 5 },
      });
      cartItemRepo.save.mockResolvedValue({});
      cartItemRepo.find.mockResolvedValue([{ quantity: 3 }]);

      const count = await service.updateQuantity('user-1', 'prod-1', 3);
      expect(count).toBe(3);
    });
  });

  describe('getCartItems', () => {
    it('should return mapped cart items with product stock', async () => {
      cartItemRepo.find.mockResolvedValue([
        {
          quantity: 2,
          product: {
            id: 'prod-1',
            name: 'Bát đĩa',
            price: 100000,
            stock: 3,
            imageUrl: 'img.jpg',
            description: 'desc',
            seller: null,
          },
        },
      ]);

      const items = await service.getCartItems('user-1');
      expect(items).toHaveLength(1);
      expect(items[0].product.stock).toBe(3);
    });
  });
});
