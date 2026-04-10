import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppTranslocoLoader implements TranslocoLoader {
  private readonly http = inject(HttpClient);

  public getTranslation(language: string): Observable<Translation> {
    return this.http.get<Translation>(`assets/i18n/${language}.json`);
  }
}
