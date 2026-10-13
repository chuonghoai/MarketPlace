import { test, expect } from '@playwright/test';
import { extractProductIdFromSlug, generateSlug, buildProductUrl } from '../../web/src/utils/slug';

test.describe('Unit Test: extractProductIdFromSlug (MKP-049)', () => {
  // Case 1: Slug tái hiện issue
  test('Case 1: Slug tái hiện issue với từ chứa "p" trước ID', () => {
    const slug = 'tuong-phat-di-lac-dang-vang-p335e38eb-62b1-4c6e-8ee5-87ad183f06c1';
    expect(extractProductIdFromSlug(slug)).toBe('335e38eb-62b1-4c6e-8ee5-87ad183f06c1');
  });

  // Case 2: Slug chứa nhiều chữ "p" trước ID
  test('Case 2: Slug chứa nhiều chữ "p" trước ID', () => {
    const slug = 'san-pham-phong-cach-phat-p335e38eb-62b1-4c6e-8ee5-87ad183f06c1';
    expect(extractProductIdFromSlug(slug)).toBe('335e38eb-62b1-4c6e-8ee5-87ad183f06c1');
  });

  // Case 2b: Hỗ trợ ID sản phẩm mẫu của project dạng prodXXXX-...
  test('Case 2b: Slug chứa ID dạng prodXXXX-... của hệ thống', () => {
    const slug = 'tuong-phat-di-lac-dang-vang-pprod0019-0000-0000-0000-000000000019';
    expect(extractProductIdFromSlug(slug)).toBe('prod0019-0000-0000-0000-000000000019');
  });

  // Case 3: Slug không có chữ "p" trong tên nhưng có phần phân cách ID hợp lệ
  test('Case 3: Slug không có chữ "p" trong tên nhưng có phân cách ID hợp lệ', () => {
    const slug = 'ao-thun-nam-cotton-p335e38eb-62b1-4c6e-8ee5-87ad183f06c1';
    expect(extractProductIdFromSlug(slug)).toBe('335e38eb-62b1-4c6e-8ee5-87ad183f06c1');
  });

  // Case 4: Slug có tên sản phẩm dài và nhiều dấu gạch ngang
  test('Case 4: Slug có tên sản phẩm dài và nhiều dấu gạch ngang', () => {
    const slug = 'bo-bat-dia-gom-su-bat-trang-hoa-mat-troi-men-kem-cao-cap-p335e38eb-62b1-4c6e-8ee5-87ad183f06c1';
    expect(extractProductIdFromSlug(slug)).toBe('335e38eb-62b1-4c6e-8ee5-87ad183f06c1');
  });

  // Case 5: Slug không có ID
  test('Case 5: Slug không có ID', () => {
    expect(extractProductIdFromSlug('tuong-phat-di-lac-dang-vang')).toBeNull();
    expect(extractProductIdFromSlug('san-pham-khong-id')).toBeNull();
  });

  // Case 6: Slug có "-p" nhưng phần sau không phải UUID hợp lệ
  test('Case 6: Slug có "-p" nhưng phần sau không phải UUID hợp lệ', () => {
    expect(extractProductIdFromSlug('tuong-phat-p12345')).toBeNull();
    expect(extractProductIdFromSlug('tuong-phat-pnot-a-uuid')).toBeNull();
    expect(extractProductIdFromSlug('tuong-phat-pabcdefgh-ijkl-mnop-qrst-uvwxyz012345')).toBeNull();
  });

  // Case 7: UUID bị thiếu ký tự
  test('Case 7: UUID bị thiếu ký tự', () => {
    // Thiếu 1 ký tự ở nhóm cuối (11 ký tự thay vì 12)
    const shortUuid = 'tuong-phat-di-lac-dang-vang-p335e38eb-62b1-4c6e-8ee5-87ad183f06c';
    expect(extractProductIdFromSlug(shortUuid)).toBeNull();
  });

  // Case 8: UUID sai định dạng dấu gạch ngang
  test('Case 8: UUID sai định dạng dấu gạch ngang', () => {
    // Thiếu dấu gạch ngang giữa nhóm 1 và nhóm 2
    const badHyphen = 'tuong-phat-di-lac-dang-vang-p335e38eb62b1-4c6e-8ee5-87ad183f06c1';
    expect(extractProductIdFromSlug(badHyphen)).toBeNull();
    // Dấu gạch ngang đặt sai vị trí
    const misplacedHyphen = 'tuong-phat-di-lac-dang-vang-p335e38-eb62b1-4c6e-8ee5-87ad183f06c1';
    expect(extractProductIdFromSlug(misplacedHyphen)).toBeNull();
  });

  // Case 9: UUID hợp lệ nhưng không nằm ở cuối slug, có thêm ký tự phía sau
  test('Case 9: UUID hợp lệ nhưng không nằm ở cuối slug (có thêm ký tự phía sau)', () => {
    const trailingChars = 'tuong-phat-di-lac-dang-vang-p335e38eb-62b1-4c6e-8ee5-87ad183f06c1-extra';
    expect(extractProductIdFromSlug(trailingChars)).toBeNull();
    const trailingSlash = 'tuong-phat-di-lac-dang-vang-p335e38eb-62b1-4c6e-8ee5-87ad183f06c1/test';
    expect(extractProductIdFromSlug(trailingSlash)).toBeNull();
  });

  // Case 10: Chuỗi rỗng hoặc giá trị không hợp lệ theo kiểu dữ liệu của hàm
  test('Case 10: Chuỗi rỗng hoặc giá trị không hợp lệ', () => {
    expect(extractProductIdFromSlug('')).toBeNull();
    expect(extractProductIdFromSlug(undefined)).toBeNull();
    expect(extractProductIdFromSlug(null)).toBeNull();
    expect(extractProductIdFromSlug('   ')).toBeNull();
    expect(extractProductIdFromSlug('-p')).toBeNull();
  });

  // Case bổ sung: buildProductUrl & round-trip verification
  test('Round-trip: buildProductUrl và extractProductIdFromSlug hoạt động nhất quán', () => {
    const product = {
      id: '335e38eb-62b1-4c6e-8ee5-87ad183f06c1',
      name: 'Tượng Phật Di Lặc dâng vàng',
    };
    const url = buildProductUrl(product);
    expect(url).toBe('/tuong-phat-di-lac-dang-vang-p335e38eb-62b1-4c6e-8ee5-87ad183f06c1');
    const extractedId = extractProductIdFromSlug(url.slice(1));
    expect(extractedId).toBe(product.id);
  });
});
