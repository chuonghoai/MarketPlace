export function generateSlug(text: string): string {
    if (!text) return '';
    return text
        .toLowerCase()
        .normalize('NFD') // Chuẩn hóa Unicode, tách các ký tự có dấu
        .replace(/[\u0300-\u036f]/g, '') // Bỏ các dấu tiếng Việt
        .replace(/đ/g, 'd') // Đổi đ/Đ thành d
        .replace(/[^a-z0-9\s-]/g, '') // Bỏ các ký tự đặc biệt
        .trim() // Xóa khoảng trắng 2 đầu
        .replace(/\s+/g, '-') // Thay khoảng trắng bằng dấu -
        .replace(/-+/g, '-'); // Xóa các dấu - liên tiếp
}

export function buildProductUrl(product: { id: string; name: string }): string {
    if (!product || !product.id) return '/';
    const slug = generateSlug(product.name) || 'product';
    return `/${slug}-p${product.id}`;
}

const PRODUCT_ID_REGEX =
    /-p([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}|prod[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{12})$/i;

export function extractProductIdFromSlug(urlParam: string | undefined | null): string | null {
    if (!urlParam || typeof urlParam !== 'string') return null;
    const match = urlParam.match(PRODUCT_ID_REGEX);
    if (match && match[1]) {
        return match[1];
    }
    return null;
}

