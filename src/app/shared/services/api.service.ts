import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Configuration } from 'src/app/configuration/configuration';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiKey = localStorage.getItem('apiKey');

  public hasApiKey(): boolean {
    return !!this.apiKey;
  }

  private readonly headers: HttpHeaders = this.hasApiKey()
    ? new HttpHeaders().set('X-Api-Key', this.apiKey as string)
    : new HttpHeaders();

  public get<T>(path: string, params: any = {}): Observable<T> {
    return this.httpClient.get<T>(
      `${Configuration.config.apiBaseUrl}/${path}`,
      {
        params,
        headers: this.headers,
      },
    );
  }

  public put<T>(path: string, obj: T): Observable<T> {
    return this.httpClient.put<T>(
      `${Configuration.config.apiBaseUrl}/${path}`,
      obj,
      { headers: this.headers },
    );
  }

  public post<T>(path: string, obj: T): Observable<T> {
    return this.httpClient.post<T>(
      `${Configuration.config.apiBaseUrl}/${path}`,
      obj,
      { headers: this.headers },
    );
  }

  public delete(path: string): Observable<any> {
    return this.httpClient.delete(
      `${Configuration.config.apiBaseUrl}/${path}`,
      { headers: this.headers },
    );
  }
}
