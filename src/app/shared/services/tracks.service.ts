import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { DateFilter, Track } from 'src/app/shared/models';

@Injectable({ providedIn: 'root' })
export class TracksService {
  private readonly apiService = inject(ApiService);

  private readonly resourcePath = 'tracks';

  public query(filter: DateFilter = {}): Observable<Track[]> {
    const params: any = {};

    if (filter.startDate) {
      params.startDate = filter.startDate.toISOString();
    }
    if (filter.endDate) {
      params.endDate = filter.endDate.toISOString();
    }

    return this.apiService.get<Track[]>(this.resourcePath, params);
  }

  public get(id: number): Observable<Track> {
    return this.apiService.get<Track>(`${this.resourcePath}/${id}`);
  }

  public delete(id: number): Observable<{}> {
    return this.apiService.delete(`${ this.resourcePath }/${ id }`);
  }

  public save(track: Track): Observable<Track> {
    if (track.id) {
      return this.apiService.put<Track>(`${ this.resourcePath }/${ track.id }`, track);
    } else {
      return this.apiService.post<Track>(this.resourcePath, track);
    }
  }
}
