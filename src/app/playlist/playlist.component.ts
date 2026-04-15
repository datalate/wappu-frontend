import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { catchError, distinctUntilChanged, of, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProgramsService, TracksService } from 'src/app/shared/services';
import { Program, Radio, Track } from 'src/app/shared/models';
import { LATEST_RADIO, RADIO_EDITIONS } from 'src/app/shared/constants';
import { AVAILABLE_LANGUAGES } from 'src/app/i18n/language.util';
import { ProgramComponent } from 'src/app/playlist/program/program.component';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProgramComponent, TranslocoPipe],
})
export class PlaylistComponent implements OnInit {
  private readonly tracksService = inject(TracksService);
  private readonly programsService = inject(ProgramsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translocoService = inject(TranslocoService);

  private routeParams$ = this.route.params.pipe(takeUntilDestroyed());

  public tracks = signal<Track[]>([]);
  public programs = signal<Program[]>([]);
  public loading = signal(false);
  public selectedEdition = signal<string | null>(null);

  public scrollToBottom(): void {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  }

  public ngOnInit(): void {
    this.routeParams$
      .pipe(
        map((params) => params?.['radio'] ?? LATEST_RADIO),
        distinctUntilChanged(),
        map(
          (currentRadio) =>
            RADIO_EDITIONS.find((radio) => radio.id === currentRadio) as Radio,
        ),
      )
      .subscribe((radio) => {
        this.selectRadio(radio);
      });
  }

  get radioEditions(): readonly string[] {
    return RADIO_EDITIONS.map((radio) => radio.id).reverse();
  }

  get languages(): readonly string[] {
    return AVAILABLE_LANGUAGES;
  }

  get activeLanguage(): string {
    return this.translocoService.getActiveLang();
  }

  public onEditionChange(edition: string): void {
    this.router
      .navigate(['/', edition], { queryParamsHandling: 'preserve' })
      .then();
  }

  public onLanguageChange(language: string): void {
    this.router
      .navigate([], {
        queryParams: { lang: language },
        queryParamsHandling: 'merge',
      })
      .then();
  }

  public getTracksForProgram(program: Program): Track[] {
    return (
      this.tracks().filter(
        (track) =>
          track.playedAt >= program.startAt && track.playedAt < program.endAt,
      ) ?? []
    );
  }

  public addTrack(track: Track): void {
    this.tracksService.save(track).subscribe({
      next: (track) => {
        this.tracks.set(
          this.tracks()
            .concat(track)
            .sort((a, b) => PlaylistComponent.sortByPlayedAt(a, b, false)),
        );
      },
      error: () => {
        globalThis.alert('Failed to create track: API request failed');
      },
    });
  }

  public editTrack(track: Track): void {
    this.tracksService.save(track).subscribe({
      next: (track) => {
        this.tracks.set(
          this.tracks()
            .map((t) => (t.id === track.id ? track : t))
            .sort((a, b) => PlaylistComponent.sortByPlayedAt(a, b, false)),
        );
      },
      error: () => {
        globalThis.alert('Failed to update track: API request failed');
      },
    });
  }

  public deleteTrack(track: Track): void {
    if (track.id === null) {
      return;
    }

    const confirmed = globalThis.confirm(`Delete track "${track.title}"?`);

    if (!confirmed) {
      return;
    }

    this.tracksService.delete(track.id).subscribe({
      next: () => {
        this.tracks.set(this.tracks().filter((t) => t.id !== track.id));
      },
      error: () => {
        globalThis.alert('Failed to delete track: API request failed');
      },
    });
  }

  private selectRadio(radio: Radio): void {
    const queryParams = {
      startDate: radio.startAt,
      endDate: radio.endAt,
    };

    this.programs.set([]);
    this.tracks.set([]);
    this.loading.set(true);
    this.selectedEdition.set(radio.id);

    zip([
      this.programsService.query(queryParams),
      this.tracksService.query(queryParams),
    ])
      .pipe(
        map(([programs, tracks]) => ({ programs, tracks })),
        catchError(() => of({ programs: [], tracks: [] })),
      )
      .subscribe(({ programs, tracks }) => {
        this.programs.set(
          programs.sort((a, b) => PlaylistComponent.sortByStartAt(a, b, false)),
        );
        this.tracks.set(
          tracks.sort((a, b) => PlaylistComponent.sortByPlayedAt(a, b, false)),
        );
        this.loading.set(false);
      });
  }

  private static sortByPlayedAt(a: Track, b: Track, descending = true): number {
    return descending
      ? b.playedAt.getTime() - a.playedAt.getTime()
      : a.playedAt.getTime() - b.playedAt.getTime();
  }

  private static sortByStartAt(
    a: Program,
    b: Program,
    descending = true,
  ): number {
    return descending
      ? b.startAt.getTime() - a.startAt.getTime()
      : a.startAt.getTime() - b.startAt.getTime();
  }
}
