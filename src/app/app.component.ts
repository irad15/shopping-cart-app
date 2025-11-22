import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Root component that boots the standalone Angular app and hosts the router.
 * This is the entry point component that renders all child routes.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html'
})
export class App {
}

