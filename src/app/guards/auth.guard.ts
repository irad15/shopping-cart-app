// src/app/guards/auth.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Blocks navigation unless the user is logged in; redirects to /login otherwise.
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // This line is the key: return the navigation observable
  return router.createUrlTree(['/login'], { 
    queryParams: { returnUrl: state.url } 
  });
};