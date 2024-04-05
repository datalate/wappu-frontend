import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { DateFilter, Program } from 'src/app/core/models';

@Injectable()
export class ProgramsService {
  readonly resourcePath = 'programs';

  constructor(private apiService: ApiService) { }

  public query(filter: DateFilter = {}): Observable<Program[]> {
    const params: any = {};

    if (filter.startDate) {
      params.startDate = filter.startDate.toISOString();
    }
    if (filter.endDate) {
      params.endDate = filter.endDate.toISOString();
    }

    return this.apiService.get<Program[]>(this.resourcePath, params);
  }

  public get(id: number): Observable<Program> {
    return this.apiService.get<Program>(`${ this.resourcePath }/${ id }`);
  }

  // public delete(id: number): Observable<{}> {
  //   return this.apiService.delete(`${ this.routerPath }/${ id }`);
  // }
  //
  // public save(program: Program): Observable<Program> {
  //   if (program.id) {
  //     return this.apiService.put<Program>(`${ this.routerPath }/${ program.id }`, program);
  //   } else {
  //     return this.apiService.post<Program>(this.routerPath, program);
  //   }
  // }
}
