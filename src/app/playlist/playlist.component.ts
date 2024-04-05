import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, zip } from 'rxjs';
import { ProgramsService, TracksService } from 'src/app/core/services';
import { Program, Radio, Track } from 'src/app/core/models';
import { LATEST_RADIO, RADIO_EDITIONS } from 'src/app/playlist/shared';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistComponent implements OnInit {
  private readonly tracksService = inject(TracksService);
  private readonly programsService = inject(ProgramsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public tracks = signal<Track[]>([]);
  public programs = signal<Program[]>([]);
  public loading = signal(false);

  private routeParams$ = this.route.params.pipe(takeUntilDestroyed());

  public ngOnInit(): void {
    this.routeParams$
      .subscribe((params: any) => {
      if (params['radio']) {
        const radio = RADIO_EDITIONS.find(
          (edition) => edition.id === params['radio'],
        );
        if (radio) {
          this.updatePlayed(radio);
          return;
        }
      }

      this.router.navigate([LATEST_RADIO], { relativeTo: this.route });
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

  private updatePlayed(radio: Radio): void {
    const queryParams = {
      startDate: radio.startAt,
      endDate: radio.endAt,
    };

    this.programs.set([]);
    this.tracks.set([]);
    this.loading.set(true);

    zip([this.programsService.query(queryParams), this.tracksService.query(queryParams)])
      .pipe(
        map(([programs, tracks]) => ({ programs, tracks })),
        catchError(() => of({ programs: [], tracks: [] })),
      )
      .subscribe(({ programs, tracks }) => {
        this.programs.set(programs.sort((a, b) =>
          PlaylistComponent.sortByStartAt(a, b, false),
        ));
        this.tracks.set(tracks.sort((a, b) =>
          PlaylistComponent.sortByPlayedAt(a, b, false),
        ));
        this.loading.set(false);
      });
  }

  private static sortByPlayedAt(a: Track, b: Track, descending = true): number {
    return descending
      ? b.playedAt.getTime() - a.playedAt.getTime()
      : a.playedAt.getTime() - b.playedAt.getTime();
  }

  private static sortByStartAt(a: Program, b: Program, descending = true): number {
    return descending
      ? b.startAt.getTime() - a.startAt.getTime()
      : a.startAt.getTime() - b.startAt.getTime();
  }
}
