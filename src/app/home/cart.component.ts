import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { CartItem } from '../models/product.models';

// Displays the current user's cart as a simple list with totals.
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

  removeFromCart(productId: number): void {
    if (this.removingItem[productId]) return;

    this.removingItem[productId] = true;
    this.cartService.removeFromCart(productId).subscribe({
      next: (response) => {
        this.removingItem[productId] = false;
        if (response.success) {
          // Find the cart item in the current cartItems array based on productId
          const item = this.cartItems.find(i => i.id === productId);
          if (item) {
            item.quantity -= 1;
            if (item.quantity <= 0) {
              // Remove the item from cartItems if its quantity is zero or less
              this.cartItems = this.cartItems.filter(item => item.id !== productId);
            }
          }
        }
      },
      error: () => {
        this.removingItem[productId] = false;
        this.loadCart();
      }
    });
  }

  getTotalPrice(): number {
    let total = 0;
    for (const item of this.cartItems) {
      total += item.price * item.quantity;
    }
    return total;
  }
}

