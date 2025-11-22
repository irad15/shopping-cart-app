import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app.component';

/**
 * Application entry point.
 * Bootstraps the standalone Angular application with the provided configuration.
 */
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
