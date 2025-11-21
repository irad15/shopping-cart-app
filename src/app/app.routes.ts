// src/app/app.routes.ts  ← final perfect version

import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './guards/auth.guard';

// Route map: public auth pages plus guarded shell that lazy-loads features.
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
        loadComponent: () =>
          import('./home/products.component').then(m => m.ProductsComponent)
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./home/cart.component').then(m => m.CartComponent)
      }
    ]
  },

  // SMART CATCH-ALL: If logged in → go home, if not → go login
  {
    path: '**',
    canActivate: [authGuard],
    redirectTo: ''
  }
];