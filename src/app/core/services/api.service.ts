import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class ApiService {
  private readonly httpClient = inject(HttpClient);

  public get<T>(path: string, params: any = {}): Observable<T> {
    return this.httpClient
      .get<T>(`${environment.apiBaseUrl}/${path}`, { params });
  }

  public put<T>(path: string, obj: T): Observable<T> {
    return this.httpClient
      .put<T>(`${environment.apiBaseUrl}/${path}`, obj);
  }

  public post<T>(path: string, obj: T): Observable<T> {
    return this.httpClient
      .post<T>(`${environment.apiBaseUrl}/${path}`, obj);
  }

  public delete(path: string): Observable<any> {
    return this.httpClient
      .delete(`${environment.apiBaseUrl}/${path}`);
  }
}
