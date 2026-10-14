# 01. Source Code `createReviews`

File gốc: `backend/src/module/reviews/reviews.service.ts`  
Hàm: `createReviews`

```typescript
async createReviews(userId: string, request: CreateReviewRequestDto) { // [1]
  let submittedCount = 0; // [2]
  const productIdsToUpdate = new Set<string>(); // [3]

  for (const item of request.reviews) { // [4]
    const orderItem = await this.orderItemRepository.findOne({ // [5]
      where: { id: item.orderItemId },
    });
    if (!orderItem /* [6] */ || orderItem.isReviewed /* [7] */) continue;

    const review = this.reviewRepository.create({ // [8]
      content: item.comment,
      rating: item.rating,
      user: { id: userId },
      product: { id: orderItem.productId },
      orderItemId: item.orderItemId,
    });
    await this.reviewRepository.save(review); // [9]

    orderItem.isReviewed = true; // [10]
    await this.orderItemRepository.save(orderItem); // [11]

    productIdsToUpdate.add(orderItem.productId); // [12]
    submittedCount++; // [13]
  }

  for (const productId of productIdsToUpdate) { // [14]
    const result = await this.reviewRepository // [15]
      .createQueryBuilder('review')
      .innerJoin('review.product', 'product')
      .where('product.id = :productId', { productId })
      .select('AVG(review.rating)', 'avgRating')
      .getRawOne();

    const avg =
      result /* [16] */ && result.avgRating /* [17] */
        ? Number(Number(result.avgRating).toFixed(1)) /* [18] */
        : 0; /* [19] */
    await this.productRepository.update(productId, { rating: avg }); // [20]
  }

  return { submittedCount }; // [21]
}
```
