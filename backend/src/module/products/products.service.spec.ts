/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { Favorite } from './entities/favorite.entity';
import { Category } from '../categories/entities/category.entity';
import { MediaService } from '../media/media.service';
import { OpensearchService } from '../opensearch/opensearch.service';
import { GetAllProductDto } from './dto/product.dto';

describe('ProductsService - Price Filter Validation (MKP-014)', () => {
  let service: ProductsService;
  let productsRepo: any;
  let favoriteRepo: any;
  let categoryRepo: any;
  let mediaService: any;
  let opensearchService: any;
  let queryBuilder: any;

  beforeEach(async () => {
    queryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
    };

    productsRepo = {
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
      findOne: jest.fn(),
      find: jest.fn(),
    };

    favoriteRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
    };

    categoryRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
    };

    mediaService = {
      deleteFiles: jest.fn(),
    };

    opensearchService = {
      searchProductIds: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: productsRepo,
        },
        {
          provide: getRepositoryToken(Favorite),
          useValue: favoriteRepo,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: categoryRepo,
        },
        {
          provide: MediaService,
          useValue: mediaService,
        },
        {
          provide: OpensearchService,
          useValue: opensearchService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    jest
      .spyOn(service, 'syncProductsToOpensearch')
      .mockImplementation(() => Promise.resolve('ok'));
  });

  describe('Price filter validation in getAllProducts', () => {
    it('1. minPrice > maxPrice: should throw BadRequestException and not query repository', async () => {
      const dto: GetAllProductDto = {
        'filters[minPrice]': '500000',
        'filters[maxPrice]': '100000',
      };

      await expect(service.getAllProducts(dto, {})).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.getAllProducts(dto, {})).rejects.toThrow(
        'minPrice must be less than or equal to maxPrice',
      );
      expect(productsRepo.createQueryBuilder).not.toHaveBeenCalled();
    });

    it('2. minPrice === maxPrice: should be accepted and apply BETWEEN filter', async () => {
      const dto: GetAllProductDto = {
        'filters[minPrice]': '200000',
        'filters[maxPrice]': '200000',
      };

      const result = await service.getAllProducts(dto, {});
      expect(result.success).toBe(true);
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'product.price BETWEEN :minPrice AND :maxPrice',
        { minPrice: 200000, maxPrice: 200000 },
      );
    });

    it('3. minPrice < maxPrice: should be accepted and apply BETWEEN filter', async () => {
      const dto: GetAllProductDto = {
        'filters[minPrice]': '100000',
        'filters[maxPrice]': '500000',
      };

      const result = await service.getAllProducts(dto, {});
      expect(result.success).toBe(true);
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'product.price BETWEEN :minPrice AND :maxPrice',
        { minPrice: 100000, maxPrice: 500000 },
      );
    });

    it('4. only minPrice: should be accepted and apply >= filter', async () => {
      const dto: GetAllProductDto = {
        'filters[minPrice]': '150000',
      };

      const result = await service.getAllProducts(dto, {});
      expect(result.success).toBe(true);
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'product.price >= :minPrice',
        { minPrice: 150000 },
      );
    });

    it('5. only maxPrice: should be accepted and apply <= filter', async () => {
      const dto: GetAllProductDto = {
        'filters[maxPrice]': '300000',
      };

      const result = await service.getAllProducts(dto, {});
      expect(result.success).toBe(true);
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'product.price <= :maxPrice',
        { maxPrice: 300000 },
      );
    });

    it('6. no price filters: should query all products without price condition', async () => {
      const dto: GetAllProductDto = {};

      const result = await service.getAllProducts(dto, {});
      expect(result.success).toBe(true);
      expect(queryBuilder.andWhere).not.toHaveBeenCalledWith(
        expect.stringContaining('product.price'),
        expect.anything(),
      );
    });

    it('7. malformed/negative price query: should throw BadRequestException', async () => {
      const malformedDto: GetAllProductDto = {
        'filters[minPrice]': 'invalid_number',
      };

      await expect(service.getAllProducts(malformedDto, {})).rejects.toThrow(
        BadRequestException,
      );

      const negativeDto: GetAllProductDto = {
        'filters[minPrice]': '-500',
      };

      await expect(service.getAllProducts(negativeDto, {})).rejects.toThrow(
        BadRequestException,
      );
      expect(productsRepo.createQueryBuilder).not.toHaveBeenCalled();
    });

    it('8. price equal to 0: should be accepted as valid price bound', async () => {
      const zeroMinDto: GetAllProductDto = {
        'filters[minPrice]': '0',
        'filters[maxPrice]': '50000',
      };

      const result = await service.getAllProducts(zeroMinDto, {});
      expect(result.success).toBe(true);
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'product.price BETWEEN :minPrice AND :maxPrice',
        { minPrice: 0, maxPrice: 50000 },
      );
    });
  });
});
