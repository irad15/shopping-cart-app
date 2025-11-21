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
          const item = this.cartItems.find(i => i.id === productId);
          if (item) {
            item.quantity -= 1;
            if (item.quantity <= 0) {
              this.cartItems = this.cartItems.filter(i => i.id !== productId);
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
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}

