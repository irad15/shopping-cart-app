import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../services/products.service';
import { CartService } from '../services/cart.service';
import { Product } from '../models/product.models';

// Lists products and wires up add-to-cart actions.
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  isLoading = true;
  error: string | null = null;
  addingToCart: { [productId: number]: boolean } = {};
  notificationMessage: string | null = null;
  notificationType: 'success' | 'error' = 'success';

  constructor(
    private productsService: ProductsService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productsService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load products';
        this.isLoading = false;
      }
    });
  }

  isInStock(product: Product): boolean {
    return product.stock > 0;
  }

  addToCart(product: Product): void {
    if (!this.isInStock(product) || this.addingToCart[product.id]) return;

    this.addingToCart[product.id] = true;
    this.cartService.addToCart(product.id, product.title, product.price, product.image, product.stock).subscribe({
      next: () => {
        this.addingToCart[product.id] = false;
        this.showNotification(`${product.title} added to cart!`);
      },
      error: () => {
        this.addingToCart[product.id] = false;
        this.showNotification('Not enough in stock', 'error');
      }
    });
  }

  showNotification(message: string, type: 'success' | 'error' = 'success'): void {
    this.notificationMessage = message;
    this.notificationType = type;
    setTimeout(() => {
      this.notificationMessage = null;
    }, 3000);
  }
}

