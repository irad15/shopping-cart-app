import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { switchMap } from 'rxjs/operators';
import { CartItem, Cart } from '../models/product.models';

/**
 * Central service for all cart operations.
 * All cart actions go through the backend and are user-specific.
 */
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,          // Sends HTTP requests
    private authService: AuthService   // Provides x-user-email header
  ) { }

  // Simply fetch the current user's cart from server
  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/cart`, {
      headers: this.authService.getAuthHeaders()   // sends x-user-email
    });
  }

  // Save (replace) the entire cart on the server
  updateCart(cart: Cart): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(
      `${this.apiUrl}/cart`,
      { cart },
      { headers: this.authService.getAuthHeaders() }
    );
  }

  // Add one unit of a product (or add new item) – includes stock check
  addToCart(
    productId: number,
    title: string,
    price: number,
    image: string,
    stock: number
  ): Observable<{ success: boolean; error?: string }> {
    return this.getCart().pipe(
      switchMap((cart) => {
        const existingItem = cart.items.find(i => i.id === productId);
        const currentQty = existingItem?.quantity ?? 0;

        // Block if not enough stock
        if (currentQty + 1 > stock) {
          return throwError(() => ({ success: false, error: 'Not enough in stock' }));
        }

        // Increment or add new item
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.items.push({ id: productId, title, price, image, quantity: 1 });
        }

        // Save updated cart to server
        return this.updateCart(cart);
      })
    );
  }

  // Remove one unit – delete item completely if quantity becomes 0
  removeFromCart(productId: number): Observable<{ success: boolean }> {
    return this.getCart().pipe(
      switchMap((cart) => {
        const item = cart.items.find(i => i.id === productId);

        if (item) {
          item.quantity -= 1;

          // Remove item from array if quantity is 0 or less
          if (item.quantity <= 0) {
            cart.items = cart.items.filter(i => i.id !== productId);
          }
        }

        return this.updateCart(cart);
      })
    );
  }
}