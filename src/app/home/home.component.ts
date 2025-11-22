import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header.component';

/**
 * Home component that serves as the authenticated shell for the application.
 * 
 * This component:
 * - Displays the header navigation
 * - Hosts child routes (products, cart) via router-outlet
 * - Protected by authGuard (only accessible when logged in)
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
}

