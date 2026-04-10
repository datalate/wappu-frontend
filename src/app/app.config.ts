import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from 'src/app/app.routes';
import { provideAppTransloco } from 'src/app/i18n/transloco.config';
import { JsonDateInterceptor } from 'src/app/shared/interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideAppTransloco(),
    { provide: HTTP_INTERCEPTORS, useClass: JsonDateInterceptor, multi: true },
    provideHttpClient(withInterceptorsFromDi()),
  ],
};
