import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

/**
 * Application configuration that sets up global providers.
 * 
 * Providers:
 * - Router: Enables Angular routing
 * - HTTP Client: Enables HTTP requests to the API
 * - Zone.js: Angular change detection with event coalescing for better performance
 * - Error Listeners: Global error handling
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient()
  ]
};
