# Backend API Rules & Layer Responsibilities

Tài liệu này quy định chuẩn thiết kế và phân tầng trách nhiệm cho toàn bộ Backend NestJS trong hệ thống Marketplace.

---

## 1. Controller Layer (`*.controller.ts`)

**Nhiệm vụ:** Là tầng tiếp nhận HTTP Request, routing, áp dụng Guards/Decorators, bóc tách DTO, gọi Service và trả về định dạng chuẩn.

### DO (Nên làm):
- Sử dụng `@Controller('path')` với prefix rõ ràng theo chuẩn RESTful.
- Áp dụng các Guards khi cần thiết: `@UseGuards(JwtAuthGuard)` hoặc `@UseGuards(JwtAuthGuard, RolesGuard)` kết hợp `@Roles(EUserRole.ADMIN)`.
- Sử dụng `@UseGuards(OptionalJwtAuthGuard)` cho các endpoint cho phép cả khách vãng lai và user đã đăng nhập (như xem chi tiết sản phẩm).
- Gắn decorator HTTP method rõ ràng: `@Get()`, `@Post()`, `@Put()`, `@Delete()`, `@Patch()`.
- Chỉ định rõ HTTP status code: `@HttpCode(HttpStatus.OK)` hoặc `@HttpCode(HttpStatus.CREATED)`.
- Parse parameters bằng decorators: `@Body() dto: ExampleDto`, `@Param('id') id: string`, `@Query() query: PaginationQueryDto`, `@Req() req: any`.
- Trả về cấu trúc response chuẩn `{ success: true, message: '...', data: ... }` hoặc đối tượng `ApiResponse<T>`.

### DON'T (Tuyệt đối KHÔNG):
- **KHÔNG** chứa Business Logic trong Controller (chuyển toàn bộ vào Service).
- **KHÔNG** inject hoặc gọi trực tiếp TypeORM Repository trong Controller.
- **KHÔNG** thao tác trực tiếp với cơ sở dữ liệu hay Redis từ Controller.
- **KHÔNG** tự catch Exception rồi trả về response lỗi thủ công (hãy throw Exception để `HttpExceptionFilter` xử lý tự động).

```typescript
// Mẫu Controller chuẩn
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getProductById(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id;
    const data = await this.productsService.getProductById(id, userId);
    return { success: true, message: 'Lấy chi tiết sản phẩm thành công', data };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() dto: CreateProductDto) {
    const data = await this.productsService.createProduct(dto);
    return { success: true, message: 'Tạo sản phẩm thành công', data };
  }
}
```

---

## 2. Service Layer (`*.service.ts`)

**Nhiệm vụ:** Nơi tập trung toàn bộ Business Logic, validation nghiệp vụ, điều phối nhiều Repository, giao tiếp với Redis, OpenSearch, Mailer và xử lý lỗi.

### DO (Nên làm):
- Đánh dấu `@Injectable()`.
- Inject TypeORM Repositories bằng `@InjectRepository(EntityName) private readonly entityRepo: Repository<EntityName>`.
- Kiểm tra tính toàn vẹn dữ liệu, các điều kiện nghiệp vụ trước khi ghi dữ liệu.
- Ném lỗi bằng `CustomException` hoặc các NestJS Built-in Exceptions (`BadRequestException`, `UnauthorizedException`, `ForbiddenException`, `NotFoundException`, `ConflictException`).
- Sử dụng TypeORM Transaction (`DataSource.transaction` hoặc `QueryRunner`) cho các nghiệp vụ cập nhật nhiều bảng liên quan (ví dụ: Checkout, Order Creation, Refund).
- Tách các logic độc lập thành helper functions hoặc sub-services (như `RedisService`, `MediaService`, `MailsService`).

### DON'T (Tuyệt đối KHÔNG):
- **KHÔNG** truy cập trực tiếp các đối tượng HTTP request/response của Express (như `req`, `res`) trong Service. Hãy truyền thuần túy tham số DTO, ID, User ID từ Controller xuống.
- **KHÔNG** để sót unhandled promise rejections.
- **KHÔNG** lặp lại logic xác thực hoặc validation đã có ở Service khác (hãy inject và tái sử dụng Service đã tồn tại).

```typescript
// Mẫu Service chuẩn
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly redisService: RedisService,
  ) {}

  async getProductById(id: string, userId?: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'variants', 'images'],
    });

    if (!product) {
      throw new CustomException(
        HttpStatus.NOT_FOUND,
        'PRODUCT_NOT_FOUND',
        'Không tìm thấy sản phẩm yêu cầu',
      );
    }

    return product;
  }
}
```

---

## 3. DTO & Validation Layer (`dto/*.dto.ts`)

**Nhiệm vụ:** Định nghĩa cấu trúc dữ liệu đầu vào / đầu ra và ràng buộc xác thực dữ liệu qua `class-validator` và `class-transformer`.

### Quy tắc:
- Mọi trường dữ liệu nhận từ client **BẮT BUỘC** có decorator validation.
- Sử dụng `@IsString()`, `@IsNotEmpty()`, `@IsOptional()`, `@IsNumber()`, `@IsEmail()`, `@IsEnum()`, `@Min()`, `@Max()`, `@IsArray()`, v.v.
- Khi parse query parameters dạng số hoặc boolean, sử dụng `@Type(() => Number)` hoặc `@Transform()`.
- DTO cập nhật (`UpdateProductDto`) nên kế thừa từ `PartialType(CreateProductDto)` của `@nestjs/mapped-types`.

```typescript
// Mẫu DTO chuẩn
export class CreateProductDto {
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  @IsString({ message: 'Tên sản phẩm phải là chuỗi' })
  name: string;

  @IsNotEmpty({ message: 'Giá sản phẩm không được để trống' })
  @IsNumber({}, { message: 'Giá sản phẩm phải là số' })
  @Min(0, { message: 'Giá sản phẩm không được nhỏ hơn 0' })
  price: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty({ message: 'Danh mục không được để trống' })
  @IsString()
  categoryId: string;
}
```

---

## 4. Entity Layer (`entities/*.entity.ts`)

**Nhiệm vụ:** Định nghĩa schema bảng trong cơ sở dữ liệu MySQL bằng TypeORM.

### Quy tắc:
- Đặt tên bảng rõ ràng bằng `@Entity('products')`.
- Sử dụng `@PrimaryGeneratedColumn('uuid')` cho UUID hoặc `@PrimaryGeneratedColumn()` cho Auto-increment ID tùy theo module.
- Khai báo quan hệ dữ liệu rõ ràng: `@ManyToOne()`, `@OneToMany()`, `@ManyToMany()`, `@JoinColumn()`.
- Luôn bao gồm `@CreateDateColumn()` và `@UpdateDateColumn()` để theo dõi lịch sử bản ghi.
- Đặt index trên các cột thường xuyên query/search: `@Index()`.

---

## 5. Chuẩn hóa Response & Error Response

### 5.1 Success Response (`ApiResponse<T>`)
```json
{
  "success": true,
  "message": "Thông điệp thành công (nếu có)",
  "data": { ... },
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 100,
    "totalPages": 5
  }
}
```

### 5.2 Error Response (Xử lý bởi `HttpExceptionFilter`)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Tên sản phẩm không được để trống"
  }
}
```

---

## 6. Chống trùng lặp code (Duplicate Prevention)

- **Search first:** Trước khi viết một hàm helper hoặc service method, luôn tìm kiếm trong codebase xem đã có hàm tương đương chưa (`utils/`, `core/`, `module/`).
- **Inject, don't duplicate:** Nếu cần chức năng từ module khác (ví dụ: tạo mã OTP, gửi email, kiểm tra số dư voucher), hãy import module tương ứng và inject service đó thay vì viết lại.
