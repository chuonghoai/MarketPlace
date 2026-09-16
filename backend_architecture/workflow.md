# Backend Development Workflow & Lifecycle

Tài liệu này hướng dẫn quy trình tiêu chuẩn từng bước để xây dựng một tính năng mới (Module/API) hoặc sửa chữa mã nguồn trong hệ thống Backend NestJS.

---

## 1. Quy trình phát triển một Feature mới

Khi tạo mới một tính năng hoặc nghiệp vụ trong Backend, hãy tuân theo 6 bước chuẩn hóa sau:

```mermaid
graph TD
    B1[Bước 1: Tạo Module & Schema Entity] --> B2[Bước 2: Định nghĩa Request/Response DTOs]
    B2 --> B3[Bước 3: Viết Business Logic trong Service]
    B3 --> B4[Bước 4: Tạo Controller & Gắn Guards]
    B4 --> B5[Bước 5: Đăng ký vào Module & AppModule]
    B5 --> B6[Bước 6: Kiểm thử API & Verification]
```

---

### Bước 1: Tạo Entity & Khai báo Schema TypeORM
1. Tạo thư mục module mới: `src/module/<feature_name>/entities/`.
2. Tạo file `<feature_name>.entity.ts` với đầy đủ `@Entity()`, `@PrimaryGeneratedColumn()`, `@Column()`, quan hệ `@ManyToOne` / `@OneToMany` và `@CreateDateColumn()`.
3. Đảm bảo Entity được nhận diện tự động (`autoLoadEntities: true`).

---

### Bước 2: Định nghĩa DTOs (Data Transfer Objects)
1. Tạo thư mục `src/module/<feature_name>/dto/`.
2. Khai báo các DTO đầu vào: `create-<feature>.dto.ts`, `update-<feature>.dto.ts`, `query-<feature>.dto.ts`.
3. Gắn đầy đủ annotation validation từ `class-validator` (`@IsNotEmpty`, `@IsString`, `@IsNumber`, `@IsOptional`, v.v.) và `class-transformer` (`@Type`).

---

### Bước 3: Triển khai Business Logic trong Service
1. Tạo file `<feature_name>.service.ts` với decorator `@Injectable()`.
2. Inject Repository thông qua `@InjectRepository(EntityName)`.
3. Viết các method nghiệp vụ:
   - Validate điều kiện nghiệp vụ (kiểm tra trùng lặp, quyền hạn, tồn tại).
   - Ném lỗi bằng `CustomException` nếu vi phạm.
   - Thao tác database / cache / email / storage.
   - Trả về dữ liệu sạch hoặc transformed entity.

---

### Bước 4: Tạo Controller & Gắn Guards
1. Tạo file `<feature_name>.controller.ts` với `@Controller('<feature_name>')`.
2. Định nghĩa các endpoints `@Get()`, `@Post()`, `@Put()`, `@Delete()`.
3. Gắn Guards tương ứng: `@UseGuards(JwtAuthGuard)` hoặc `@UseGuards(JwtAuthGuard, RolesGuard) @Roles(...)`.
4. Nhận params qua `@Body()`, `@Param()`, `@Query()`, `@Req()`.
5. Đặt HTTP Status code tương ứng (`HttpStatus.OK`, `HttpStatus.CREATED`).

---

### Bước 5: Đăng ký Module & Tích hợp AppModule
1. Tạo file `<feature_name>.module.ts`:
   - Import `TypeOrmModule.forFeature([EntityName])`.
   - Khai báo `controllers: [FeatureController]`.
   - Khai báo `providers: [FeatureService]`.
   - Export `FeatureService` nếu module khác cần sử dụng.
2. Import `FeatureModule` vào `src/app.module.ts`.

---

### Bước 6: Kiểm thử & Xác minh (Testing)
1. Khởi chạy server: `npm run backend:dev`.
2. Kiểm tra API bằng công cụ test API hoặc tích hợp trực tiếp với Frontend.
3. Kiểm tra các trường hợp:
   - Happy Path (200 / 201)
   - Validation Error (400 Bad Request)
   - Unauthorized / Forbidden (401 / 403)
   - Not Found (404)

---

## 2. Quy trình Fix Bug & Debugging

Khi điều tra và sửa lỗi Backend, Agent/Dev thực hiện truy vết theo thứ tự:

1. **Trace Controller & DTO:** Kiểm tra xem request gửi lên có bị `ValidationPipe` chặn không, decorator nhận đúng body/query/params chưa.
2. **Trace Guard & Auth:** Kiểm tra token có hợp lệ không, `tokenVersion` có khớp không, role có đủ quyền truy cập endpoint không.
3. **Trace Service:** Kiểm tra logic nghiệp vụ, điều kiện rẽ nhánh `if/else`, giá trị trả về hoặc exception bị throw.
4. **Trace Database Query & SQL:** Kiểm tra câu lệnh TypeORM sinh ra, quan hệ `relations` đã nạp đủ chưa, tránh lỗi `undefined property` khi truy cập quan hệ lồng nhau.
5. **Trace Redis / External:** Kiểm tra kết nối Redis, key name, TTL và dữ liệu cache có bị stale không.
