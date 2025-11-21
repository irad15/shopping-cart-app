import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.models';

// Simple data access layer for fetching catalog products.
@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }
}

