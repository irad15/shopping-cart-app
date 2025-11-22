import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../services/products.service';
import { CartService } from '../services/cart.service';
import { Product } from '../models/product.models';

/**
 * Products component that displays the product catalog.
 * 
 * Features:
 * - Displays all available products in a grid layout
 * - Shows stock status (In Stock / Out of Stock)
 * - Add to cart functionality with stock validation
 * - Loading and error states
 * - Success/error notifications
 * - Prevents duplicate add-to-cart operations
 */
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

  /**
   * Loads products from the server.
   * Handles loading state and error scenarios.
   */
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

  /**
   * Checks if a product is in stock.
   * @param product - The product to check
   * @returns true if stock > 0, false otherwise
   */
  isInStock(product: Product): boolean {
    return product.stock > 0;
  }

  /**
   * Adds a product to the cart.
   * Validates stock availability and prevents duplicate operations.
   * 
   * @param product - The product to add to cart
   */
  addToCart(product: Product): void {
    // Only proceed if the product is in stock
    if (!this.isInStock(product)) {
      return;
    }

    // Prevent duplicate add-to-cart operations for the same product
    if (this.addingToCart[product.id]) {
      return;
    }

    this.addingToCart[product.id] = true;
    this.cartService.addToCart(
      product.id,
      product.title,
      product.price,
      product.image,
      product.stock
    ).subscribe({
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

  /**
   * Displays a temporary notification message.
   * Automatically clears after 3 seconds.
   * 
   * @param message - The message to display
   * @param type - Notification type: 'success' or 'error'
   */
  showNotification(message: string, type: 'success' | 'error' = 'success'): void {
    this.notificationMessage = message;
    this.notificationType = type;
    setTimeout(() => {
      this.notificationMessage = null;
    }, 3000);
  }
}

