import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, distinctUntilChanged, of, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProgramsService, TracksService } from 'src/app/shared/services';
import { Program, Radio, Track } from 'src/app/shared/models';
import { LATEST_RADIO, RADIO_EDITIONS } from 'src/app/shared/constants';
import { ProgramComponent } from 'src/app/playlist/program/program.component';
import { RequireApiKeyDirective } from 'src/app/shared/directives';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, ProgramComponent, RequireApiKeyDirective],
})
export class PlaylistComponent implements OnInit {
  private readonly tracksService = inject(TracksService);
  private readonly programsService = inject(ProgramsService);
  private readonly route = inject(ActivatedRoute);

  private routeParams$ = this.route.params.pipe(takeUntilDestroyed());

  public tracks = signal<Track[]>([]);
  public programs = signal<Program[]>([]);
  public loading = signal(false);

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
        this.updatePlayed(radio);
      });
  }

  get radioEditions(): string[] {
    return RADIO_EDITIONS.map((radio) => radio.id);
  }

  public getTracksForProgram(program: Program): Track[] {
    return (
      this.tracks().filter(
        (track) =>
          track.playedAt >= program.startAt && track.playedAt < program.endAt,
      ) ?? []
    );
  }

  public editTrack(track: Track): void {
    this.tracksService.save(track)
      .subscribe((track) => {
        this.tracks.set(
          this.tracks().map((t) => (t.id === track.id ? track : t))
        );
      });
  }

  public deleteTrack(track: Track): void {
    this.tracksService.delete(track.id)
      .subscribe(() => {
        this.tracks.set(
          this.tracks().filter((t) => t.id !== track.id)
        );
      });
  }

  private updatePlayed(radio: Radio): void {
    const queryParams = {
      startDate: radio.startAt,
      endDate: radio.endAt,
    };

    this.programs.set([]);
    this.tracks.set([]);
    this.loading.set(true);

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
