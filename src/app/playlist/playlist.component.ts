import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { ProgramsService, TracksService } from 'src/app/core/services';
import { Program, Radio, Track } from 'src/app/core/models';
import { LATEST_RADIO, RADIO_EDITIONS } from 'src/app/playlist/shared';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent implements OnInit {
  public tracks: Track[] | undefined;
  public programs: Program[] | undefined;

  constructor(
    private tracksService: TracksService,
    private programsService: ProgramsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  public ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
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
      this.tracks?.filter(
        (track) =>
          track.playedAt >= program.startAt && track.playedAt < program.endAt,
      ) ?? []
    );
  }

  private updatePlayed(radio: Radio): void {
    this.programs = undefined;
    this.tracks = undefined;

    this.programsService
      .query({
        startDate: radio.startAt,
        endDate: radio.endAt,
      })
      .pipe(first())
      .subscribe((programs: Program[]) => {
        this.programs = programs.sort((a, b) =>
          this.sortByStartAt(a, b, false),
        );
      });

    this.tracksService
      .query({
        startDate: radio.startAt,
        endDate: radio.endAt,
      })
      .pipe(first())
      .subscribe((tracks: Track[]) => {
        this.tracks = tracks.sort((a, b) => this.sortByPlayedAt(a, b, false));
      });
  }

  private sortByPlayedAt(a: Track, b: Track, descending = true): number {
    return descending
      ? b.playedAt.getTime() - a.playedAt.getTime()
      : a.playedAt.getTime() - b.playedAt.getTime();
  }

  private sortByStartAt(a: Program, b: Program, descending = true): number {
    return descending
      ? b.startAt.getTime() - a.startAt.getTime()
      : a.startAt.getTime() - b.startAt.getTime();
  }
}
