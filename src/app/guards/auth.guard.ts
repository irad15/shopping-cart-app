import { inject } from '@angular/core';
import { CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Route guard that protects routes requiring authentication.
 * 
 * Behavior:
 * - Allows navigation if user is logged in
 * - Redirects to /login with returnUrl query parameter if user is not logged in
 * - The returnUrl allows users to return to their intended destination after login
 */
export const authGuard: CanActivateFn = (
  _route,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Redirect to login with returnUrl so user can return to intended page after login
  return router.createUrlTree(['/login'], { 
    queryParams: { returnUrl: state.url } 
  });
};