export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  stock?: number;
  seller: SellerInfo;  
  description: string;
}


export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SellerInfo {
  id: string;
  name: string;
  avatarUrl: string;
  averageRating: number;
}
