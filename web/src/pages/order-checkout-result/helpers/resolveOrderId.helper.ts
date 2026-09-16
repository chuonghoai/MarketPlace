export const resolveOrderIdFromUrl = (searchParams: URLSearchParams): string | null => {
    const orderId = searchParams.get("orderId");
    if (orderId) return orderId;

    const vnpTxnRef = searchParams.get("vnp_TxnRef");
    if (vnpTxnRef) return vnpTxnRef;

    const vnpOrderInfo = searchParams.get("vnp_OrderInfo");
    if (vnpOrderInfo) {
        const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
        const match = vnpOrderInfo.match(uuidRegex);
        if (match) {
            return match[0];
        }

        const parts = vnpOrderInfo.split(" ");
        const lastPart = parts[parts.length - 1];
        if (lastPart && lastPart.length > 0) {
            return lastPart;
        }
    }

    return null;
};
