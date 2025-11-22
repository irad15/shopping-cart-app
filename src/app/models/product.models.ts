/**
 * Shared product and cart data models.
 * 
 * These interfaces define the structure of product and cart data
 * used throughout the application.
 */

/**
 * Product model representing an item in the catalog.
 */
export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  stock: number;
}

/**
 * Cart item model representing a product in the shopping cart.
 * Includes quantity information.
 */
export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

/**
 * Cart model representing the entire shopping cart.
 * Contains an array of cart items.
 */
export interface Cart {
  items: CartItem[];
}

