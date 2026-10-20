# Mã nguồn chức năng Lấy danh sách sản phẩm

File gốc: `backend/src/module/products/products.service.ts`
Hàm: `getAllProducts`

```typescript
  async getAllProducts(dto: GetAllProductDto, rawQuery: Record<string, any>): Promise<ApiResponse<any>> {
    // [1] Khởi tạo các giá trị phân trang và sắp xếp mặc định
[1] const page = dto?.page ? parseInt(dto.page.toString(), 10) : 1;
    const pageSize = dto?.pageSize ? parseInt(dto.pageSize.toString(), 10) : 50;

    // [2] Khởi tạo các biến filter từ DTO và rawQuery
[2] const sortBy = dto?.['filters[sortBy]'];
    const minPrice = dto?.['filters[minPrice]'] || undefined;
    const maxPrice = dto?.['filters[maxPrice]'] || undefined;

    let categories: string[] | undefined;
    const rawFiltersObj = rawQuery?.filters as Record<string, any>;

    // [3] Kiểm tra rawFiltersObj.categories có tồn tại hay không
[3] if (rawFiltersObj?.categories) {
      const rawCats = rawFiltersObj.categories;
      // [4] Kiểm tra rawCats có phải là mảng hay không
[4]   categories = Array.isArray(rawCats) 
        // [5] Gán trực tiếp nếu đã là mảng
[5]     ? rawCats 
        // [6] Đóng gói thành mảng nếu là chuỗi đơn lẻ
[6]     : [rawCats];
    } else {
      // [7] Khởi tạo catMap để trích xuất categories từ format filters[categories][index]
[7]   const catMap: Record<number, string> = {};
      // [8] Duyệt qua các keys của rawQuery
[8]   for (const key of Object.keys(rawQuery || {})) {
        const match = key.match(/^filters\[categories\]\[(\d+)\]$/);
        // [9] Kiểm tra key có khớp regex hay không
[9]     if (match) {
          // [10] Lưu category vào catMap theo index
[10]      catMap[Number(match[1])] = rawQuery[key] as string;
        }
      }
      // [11] Trích xuất và sắp xếp giá trị category theo index
[11]  const catValues = Object.keys(catMap)
        .sort((a, b) => Number(a) - Number(b))
        .map((k) => catMap[Number(k)]);
      // [12] Kiểm tra catValues có phần tử hay không
[12]  if (catValues.length > 0) {
        // [13] Gán categories từ catValues
[13]    categories = catValues;
      }
    }

    // [14] Khởi tạo QueryBuilder tìm kiếm sản phẩm và kết nối danh mục
[14] const skip = (page - 1) * pageSize;
    const qb = this.productsRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    // [15] Kiểm tra có tìm kiếm từ khóa dto.search hay không
[15] if (dto.search) {
      // [16] Gọi OpenSearch để tìm danh sách product id khớp từ khóa
[16]  const matchedIds = await this.opensearchService.searchProductIds(dto.search);
      // [17] Kiểm tra kết quả tìm kiếm có rỗng hay không
[17]  if (matchedIds.length === 0) {
        const response = new ApiResponse(true, 'Lấy danh sách sản phẩm thành công', []);
        response.pagination = { page, pageSize, totalItems: 0, totalPages: 0 };
        // [18] Trả về sớm mảng rỗng nếu không có sản phẩm nào khớp từ khóa
[18]    return response;
      }
      // [19] Thêm điều kiện lọc danh sách ID khớp từ OpenSearch
[19]  qb.andWhere('product.id IN (:...matchedIds)', { matchedIds });
    }

    // [20] Kiểm tra điều kiện categories tồn tại
[20] if (
      categories &&
      // [21] Kiểm tra categories là mảng
[21]  Array.isArray(categories) &&
      // [22] Kiểm tra mảng categories không rỗng
[22]  categories.length > 0
    ) {
      // [23] Thêm điều kiện lọc theo danh mục
[23]  qb.andWhere('category.id IN (:...categories)', { categories });
    }

    // [24] Parse minPrice và maxPrice sang dạng số
[24] const parsedMin = minPrice ? Number(minPrice) : NaN;
    const parsedMax = maxPrice ? Number(maxPrice) : NaN;
    // [25] Kiểm tra minPrice hợp lệ và [26] maxPrice hợp lệ
[25] if (
      !isNaN(parsedMin) && 
[26]  !isNaN(parsedMax)
    ) {
      // [27] Lọc sản phẩm trong khoảng giá BETWEEN
[27]  qb.andWhere('product.price BETWEEN :minPrice AND :maxPrice', { minPrice: parsedMin, maxPrice: parsedMax });
      // [28] Kiểm tra chỉ có minPrice hợp lệ
[28] } else if (!isNaN(parsedMin)) {
      // [29] Lọc sản phẩm có giá >= minPrice
[29]  qb.andWhere('product.price >= :minPrice', { minPrice: parsedMin });
      // [30] Kiểm tra chỉ có maxPrice hợp lệ
[30] } else if (!isNaN(parsedMax)) {
      // [31] Lọc sản phẩm có giá <= maxPrice
[31]  qb.andWhere('product.price <= :maxPrice', { maxPrice: parsedMax });
    }

    // [32] Rẽ nhánh sắp xếp theo tiêu chí sortBy
[32] switch (sortBy) {
      case EFilterState.PRICE_LOW_TO_HIGH:
        // [33] Sắp xếp giá tăng dần
[33]    qb.orderBy('product.price', 'ASC');
        break;
      case EFilterState.PRICE_HIGH_TO_LOW:
        // [34] Sắp xếp giá giảm dần
[34]    qb.orderBy('product.price', 'DESC');
        break;
      case EFilterState.POPULARITY:
        // [35] Sắp xếp theo đánh giá giảm dần
[35]    qb.orderBy('product.rating', 'DESC');
        break;
      case EFilterState.NEWEST:
      default:
        // [36] Sắp xếp theo ngày tạo mới nhất (mặc định)
[36]    qb.orderBy('product.createdAt', 'DESC');
        break;
    }

    // [37] Phân trang và truy vấn dữ liệu từ database
[37] qb.skip(skip).take(pageSize);
    const [products, totalItems] = await qb.getManyAndCount();
    const totalPages = Math.ceil(totalItems / pageSize);

    // [38] Định dạng lại dữ liệu và trả về ApiResponse kèm phân trang
[38] const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
      discountPercentage: product.discountPercentage,
      rating: product.rating,
      stock: Number(product.stock),
      soldCount: Number(product.soldCount),
      categoryName: product.category?.name || 'Chưa phân loại',
    }));

    const response = new ApiResponse(true, 'Lấy danh sách sản phẩm thành công', formattedProducts);
    response.pagination = {
      page: Number(page),
      pageSize: Number(pageSize),
      totalItems,
      totalPages,
    };

    return response;
  }
```
