import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { appRoutes } from 'src/app/app.routes';
import { JsonDateInterceptor } from 'src/app/shared/interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    importProvidersFrom(BrowserModule),
    { provide: HTTP_INTERCEPTORS, useClass: JsonDateInterceptor, multi: true },
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
  ],
};
