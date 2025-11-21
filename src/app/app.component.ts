import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Root component that boots the standalone Angular app and hosts the router.

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html'
})
export class App {
  protected readonly title = signal('shopping-cart-app');
}

