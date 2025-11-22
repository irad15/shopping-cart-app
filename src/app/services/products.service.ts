import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.models';

/**
 * Products service that provides access to the product catalog.
 * 
 * Responsibilities:
 * - Fetch all available products from the server
 * - Products include: id, title, price, image, and stock information
 */
@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  /**
   * Fetches all available products from the server.
   * @returns Observable of product array
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }
}

