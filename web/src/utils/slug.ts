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

export function extractProductIdFromSlug(urlParam: string | undefined): string | null {
    if (!urlParam) return null;
    const match = urlParam.match(/-p([a-zA-Z0-9-]+)$/);
    if (match && match[1]) {
        return match[1];
    }
    return null;
}

