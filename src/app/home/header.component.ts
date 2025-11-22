import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Header component that provides navigation and logout functionality.
 * 
 * Features:
 * - Navigation links to Products and Cart pages
 * - Active route highlighting
 * - Logout button that clears session and redirects to login
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Logs out the current user and redirects to the login page.
   * Clears authentication state and session data.
   */
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

