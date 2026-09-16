export interface PrepareCheckoutRequest {
    productId: string;
    quantity: number;
}

export interface PrepareCheckoutPayload {
    prepareTempId?: string;
    items?: PrepareCheckoutRequest[];
    addressId?: number;
    voucherCodes?: string[];
}
