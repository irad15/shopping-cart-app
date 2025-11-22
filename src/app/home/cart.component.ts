import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { CartItem } from '../models/product.models';

/**
 * Cart component that displays the user's shopping cart.
 * 
 * Features:
 * - Displays all cart items with details (image, title, price, quantity)
 * - Remove items from cart (decrements quantity, removes if quantity reaches 0)
 * - Calculates and displays total price
 * - Loading and error states
 * - Empty cart state
 * - Prevents duplicate remove operations
 */
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  isLoading = true;
  error: string | null = null;
  removingItem: { [productId: number]: boolean } = {};

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.loadCart();
  }

  /**
   * Loads the current user's cart from the server.
   * Handles loading state and error scenarios.
   */
  loadCart(): void {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cartItems = cart.items || [];
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load cart';
        this.isLoading = false;
      }
    });
  }

  /**
   * Removes one unit of a product from the cart.
   * If quantity reaches 0, the item is completely removed.
   * Prevents duplicate operations.
   * 
   * @param productId - The product ID to remove
   */
  removeFromCart(productId: number): void {
    if (this.removingItem[productId]) return;

    this.removingItem[productId] = true;
    this.cartService.removeFromCart(productId).subscribe({
      next: (response) => {
        this.removingItem[productId] = false;
        if (response.success) {
          // Update local state: decrement quantity or remove item if quantity reaches 0
          const item = this.cartItems.find(i => i.id === productId);
          if (item) {
            item.quantity -= 1;
            if (item.quantity <= 0) {
              // Remove item completely if quantity is zero or less
              this.cartItems = this.cartItems.filter(item => item.id !== productId);
            }
          }
        }
      },
      error: () => {
        this.removingItem[productId] = false;
        // Reload cart on error to ensure consistency
        this.loadCart();
      }
    });
  }

  /**
   * Calculates the total price of all items in the cart.
   * @returns Total price (price * quantity for each item)
   */
  getTotalPrice(): number {
    let total = 0;
    for (const item of this.cartItems) {
      total += item.price * item.quantity;
    }
    return total;
  }
}

