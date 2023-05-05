import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { JsonDateInterceptor } from './interceptors';

import {
  ApiService,
  TracksService,
  ProgramsService
} from './services';

@NgModule({
  imports: [
    HttpClientModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JsonDateInterceptor, multi: true },
    ApiService,
    TracksService,
    ProgramsService,
  ]
})
export class CoreModule { }
