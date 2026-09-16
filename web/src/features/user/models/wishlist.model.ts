export type WishlistItem = {
    id: string;
    name: string;
    price: number;
    discountPrice: number;
    thumbnail: string;
    isFavorite: true;
};

export type WishlistResponse = {
    items: WishlistItem[];
};
