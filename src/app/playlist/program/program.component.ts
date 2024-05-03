import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { Program, Track } from 'src/app/shared/models';
import { DatePipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequireApiKeyDirective } from 'src/app/shared/directives';

@Component({
  selector: 'app-playlist-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DatePipe, NgIf, FormsModule, RequireApiKeyDirective],
})
export class ProgramComponent {
  public readonly program = input.required<Program>();
  public readonly tracks = input.required<Track[]>();

  public readonly show = signal(true);
  public readonly editingTrack = signal<Track | null>(null);

  public readonly onTrackEdited = output<Track>();
  public readonly onTrackDeleted = output<Track>();

  public editArtist: string | undefined = '';
  public editTitle: string = '';

  public toggle(): void {
    this.show.set(!this.show());
  }

  public edit(track: Track): void {
    this.editArtist = track.artist;
    this.editTitle = track.title;

    this.editingTrack.set(track);
  }

  public save(track: Track): void {
    this.onTrackEdited.emit({
      ...track,
      artist: this.editArtist,
      title: this.editTitle,
    });

    this.editingTrack.set(null);
  }

  public delete(track: Track): void {
    this.onTrackDeleted.emit(track);
  }
}
