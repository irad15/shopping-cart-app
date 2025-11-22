import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { switchMap } from 'rxjs/operators';
import { CartItem, Cart } from '../models/product.models';

/**
 * Cart service that manages the user's shopping cart via server API.
 * 
 * Features:
 * - Fetch current user's cart
 * - Add products to cart (with stock validation)
 * - Remove products from cart (decrements quantity, removes if quantity reaches 0)
 * - All operations are user-specific via authentication headers
 */
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Fetches the current user's cart from the server
  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/cart`, { headers: this.authService.getAuthHeaders() });
  }

  // Updates the entire cart on the server
  updateCart(cart: Cart): Observable<{ success: boolean }> {
    const url = `${this.apiUrl}/cart`;
    const body = { cart };
    const headers = this.authService.getAuthHeaders();
    return this.http.post<{ success: boolean }>(url, body, { headers });
  }

  // Adds a product to the cart or increments quantity if already present, with stock validation
  addToCart(
    productId: number,
    title: string,
    price: number,
    image: string,
    stock: number
  ): Observable<{ success: boolean; error?: string }> {
    return this.getCart().pipe(
      switchMap((cart) => {
        const item = cart.items.find(i => i.id === productId);
        const currentQuantity = item?.quantity ?? 0;

        // Validate stock availability
        if (currentQuantity + 1 > stock) {
          return throwError(() => ({ error: 'Not enough in stock' }));
        }

        // Increment quantity if item exists, otherwise add new item
        if (item) {
          item.quantity += 1;
        } else {
          cart.items.push({
            id: productId,
            title,
            price,
            image,
            quantity: 1
          });
        }

        return this.updateCart(cart);
      })
    );
  }

  // Removes one unit of a product from the cart, or removes the item if quantity reaches 0
  removeFromCart(productId: number): Observable<{ success: boolean }> {
    return this.getCart().pipe(
      switchMap((cart) => {
        const item = cart.items.find(i => i.id === productId);
        
        if (item) {
          item.quantity -= 1;
          // Remove item completely if quantity reaches 0
          if (item.quantity <= 0) {
            cart.items = cart.items.filter(i => i.id !== productId);
          }
        }
        
        return this.updateCart(cart);
      })
    );
  }
}

