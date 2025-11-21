import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { switchMap } from 'rxjs/operators';
import { CartItem, Cart } from '../models/product.models';

// Provides CRUD helpers for the user's server-backed shopping cart.
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/cart`, { headers: this.authService.getAuthHeaders() });
  }

  updateCart(cart: Cart): Observable<{ success: boolean }> {
    const url = `${this.apiUrl}/cart`;
    const body = { cart };
    const headers = this.authService.getAuthHeaders();
    return this.http.post<{ success: boolean }>(url, body, { headers });
  }

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
        const currentQuantity = item?.quantity || 0;

        if (currentQuantity + 1 > stock) {
          return throwError(() => ({ error: 'Not enough in stock' }));
        }

        if (item) {
          item.quantity += 1;
        } else {
          cart.items.push({ id: productId, title, price, image, quantity: 1 });
        }

        return this.updateCart(cart);
      })
    );
  }

  removeFromCart(productId: number): Observable<{ success: boolean }> {
    return this.getCart().pipe(
      switchMap((cart) => {
        const item = cart.items.find(i => i.id === productId);
        
        if (item) {
          item.quantity -= 1;
          if (item.quantity <= 0) {
            cart.items = cart.items.filter(i => i.id !== productId);
          }
        }
        
        return this.updateCart(cart);
      })
    );
  }
}

