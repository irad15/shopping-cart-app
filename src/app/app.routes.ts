import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './guards/auth.guard';

/**
 * Application route configuration.
 * 
 * Structure:
 * - Public routes: /login, /register (no authentication required)
 * - Protected routes: /products, /cart (require authentication via authGuard)
 * - Default redirect: / -> /products
 * - Catch-all: redirects to home (or login if not authenticated)
 */
export const routes: Routes = [
  // Public routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Protected shell with lazy children
  {
    path: '',
    canActivate: [authGuard],
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      {
        path: 'products',
        loadChildren: () =>
          import('./home/products.module').then(m => m.ProductsModule)
      },
      {
        path: 'cart',
        loadChildren: () =>
          import('./home/cart.module').then(m => m.CartModule)
      }
    ]
  },

  // Catch-all for any unknown route:
  // - If user is logged in → redirect to home page
  // - If not logged in → authGuard redirects to /login with returnUrl
  {
    path: '**',
    canActivate: [authGuard],
    redirectTo: ''
  }
];