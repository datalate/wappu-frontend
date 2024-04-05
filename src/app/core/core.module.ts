import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JsonDateInterceptor } from 'src/app/core/interceptors';
import {
  ApiService,
  ProgramsService,
  TracksService,
} from 'src/app/core/services';

@NgModule({
  imports: [HttpClientModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JsonDateInterceptor, multi: true },
    ApiService,
    TracksService,
    ProgramsService,
  ],
})
export class CoreModule {}
