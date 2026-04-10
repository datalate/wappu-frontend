import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from 'src/app/app.routes';
import { JsonDateInterceptor } from 'src/app/shared/interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    { provide: HTTP_INTERCEPTORS, useClass: JsonDateInterceptor, multi: true },
    provideHttpClient(withInterceptorsFromDi()),
  ],
};
