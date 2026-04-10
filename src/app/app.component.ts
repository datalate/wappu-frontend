import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { map, distinctUntilChanged, filter } from 'rxjs';
import {
  AVAILABLE_LANGUAGES,
  type SupportedLanguage,
} from 'src/app/i18n/language.util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly translocoService = inject(TranslocoService);

  private queryParams$ = this.route.queryParams.pipe(takeUntilDestroyed());

  public ngOnInit(): void {
    this.queryParams$
      .pipe(
        map((params) => params['lang'] as string | undefined),
        filter((lang): lang is SupportedLanguage =>
          AVAILABLE_LANGUAGES.includes(lang as SupportedLanguage),
        ),
        distinctUntilChanged(),
      )
      .subscribe((language) => {
        this.translocoService.setActiveLang(language);
      });
  }
}
