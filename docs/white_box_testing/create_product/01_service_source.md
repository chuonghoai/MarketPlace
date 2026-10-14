# 01. Source Code `createProduct`
File gốc: `backend/src/module/products/products.service.ts`
Hàm: `createProduct`

```typescript
async createProduct(createProductDto: CreateProductDto) { // [1]
  const category = await this.categoryRepository.findOne({ where: { id: createProductDto.categoryId } }); // [2]
  if (!category) { // [3]
    throw new CustomException(HttpStatus.NOT_FOUND, 'NOT_FOUND', 'Danh mục không tồn tại'); // [4]
  }

  const { mediaPublicIds, ...productData } = createProductDto; // [5]

  const product = this.productsRepository.create({ // [6]
    ...productData,
    category,
  });

  const productSaved = await this.productsRepository.save(product); // [7]

  if (mediaPublicIds /* [8] */ && mediaPublicIds.length > 0 /* [9] */) {
    try {
      await this.mediaService.confirmUpload(mediaPublicIds); // [10]
    } catch (err) { // [11]
      this.logger.warn(`[createProduct] Could not confirm media for product ${productSaved.id}: ${err?.message}`); // [12]
    }
  }

  // Index vao OpenSearch
  await this.opensearchService.indexProduct(productSaved); // [13]

  return productSaved; // [14]
}
```
