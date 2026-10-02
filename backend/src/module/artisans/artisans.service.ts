import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateArtisanDto } from './dto/create-artisan.dto';
import { UpdateArtisanDto } from './dto/update-artisan.dto';
import { UpdateArtisanProductsDto } from './dto/update-artisan-products.dto';
import { Artisan } from './entities/artisan.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class ArtisansService {
  constructor(
    @InjectRepository(Artisan)
    private readonly artisanRepository: Repository<Artisan>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createArtisanDto: CreateArtisanDto) {
    const artisan = this.artisanRepository.create(createArtisanDto);
    return this.artisanRepository.save(artisan);
  }

  async findAll(page: number = 1, limit: number = 20, search: string = '') {
    const [data, total] = await this.artisanRepository.findAndCount({
      where: search ? { fullName: Like(`%${search}%`) } : {},
      skip: (page - 1) * limit,
      take: limit,
      relations: ['products'],
    });

    return {
      data: data.map(artisan => ({
        ...artisan,
        productCount: artisan.products?.length || 0,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const artisan = await this.artisanRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!artisan) throw new NotFoundException(`Artisan with id ${id} not found`);
    return artisan;
  }

  async update(id: string, updateArtisanDto: UpdateArtisanDto) {
    const artisan = await this.findOne(id);
    Object.assign(artisan, updateArtisanDto);
    return this.artisanRepository.save(artisan);
  }

  async remove(id: string) {
    const artisan = await this.findOne(id);
    return this.artisanRepository.remove(artisan);
  }

  async updateProducts(id: string, updateArtisanProductsDto: UpdateArtisanProductsDto) {
    const artisan = await this.findOne(id);
    const { productIds } = updateArtisanProductsDto;
    
    // Set artisanId to null for products previously associated with this artisan but not in the list
    await this.productRepository
      .createQueryBuilder()
      .update(Product)
      .set({ artisan: null as any })
      .where('artisanId = :id AND id NOT IN (:...productIds)', { 
        id, 
        productIds: productIds.length ? productIds : ['00000000-0000-0000-0000-000000000000'] 
      })
      .execute();

    // Assign artisan to the new products
    if (productIds.length > 0) {
      await this.productRepository
        .createQueryBuilder()
        .update(Product)
        .set({ artisan })
        .where('id IN (:...productIds)', { productIds })
        .execute();
    }

    return this.findOne(id);
  }
}
