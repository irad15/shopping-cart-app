import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header.component';

// Auth-protected shell that shows the header and child routes (products/cart).
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
}

