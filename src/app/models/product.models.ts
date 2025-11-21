// Shared product-related interfaces

export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  stock: number;
}

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
}

