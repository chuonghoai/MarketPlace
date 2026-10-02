import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ArtisansService } from './artisans.service';
import { CreateArtisanDto } from './dto/create-artisan.dto';
import { UpdateArtisanDto } from './dto/update-artisan.dto';
import { UpdateArtisanProductsDto } from './dto/update-artisan-products.dto';

@Controller('artisans')
export class ArtisansController {
  constructor(private readonly artisansService: ArtisansService) {}

  @Post()
  create(@Body() createArtisanDto: CreateArtisanDto) {
    return this.artisansService.create(createArtisanDto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.artisansService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      search,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artisansService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArtisanDto: UpdateArtisanDto) {
    return this.artisansService.update(id, updateArtisanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.artisansService.remove(id);
  }

  @Patch(':id/products')
  updateProducts(
    @Param('id') id: string,
    @Body() updateArtisanProductsDto: UpdateArtisanProductsDto,
  ) {
    return this.artisansService.updateProducts(id, updateArtisanProductsDto);
  }
}
