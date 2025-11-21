import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Displays navigation links and exposes a logout button.
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

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

