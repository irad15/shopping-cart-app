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
    // Prevent multiple simultaneous remove requests for the same product
    if (this.removingItem[productId]) {
      return; // Already removing this item → ignore extra clicks
    }
  
    // Set flag to block any further clicks while request is in progress
    this.removingItem[productId] = true;
  
    this.cartService.removeFromCart(productId).subscribe({
      next: (response) => {
        this.removingItem[productId] = false; // Always reset the flag
  
        if (response.success) {
          // Update the local cart UI to reflect the server change
          const item = this.cartItems.find(i => i.id === productId);
          if (item) {
            item.quantity -= 1;                    // Decrease quantity by 1
            if (item.quantity <= 0) {
              // If quantity reached 0 → completely remove the row from the cart
              this.cartItems = this.cartItems.filter(i => i.id !== productId);
            }
          }
        }
      },
      error: () => {
        this.removingItem[productId] = false; // Critical: reset even if server failed
        // Server failed → reload fresh data to stay in sync with backend
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

