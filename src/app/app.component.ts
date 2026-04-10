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
  normalizeLanguage,
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

  private routeParams$ = this.route.params.pipe(takeUntilDestroyed());

  public ngOnInit(): void {
    this.routeParams$
      .pipe(
        map((params) => normalizeLanguage(params['lang'])),
        filter((lang): lang is SupportedLanguage => lang !== null),
        distinctUntilChanged(),
      )
      .subscribe((language) => {
        this.translocoService.setActiveLang(language);
      });
  }
}
