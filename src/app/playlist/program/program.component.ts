import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Program, Track } from 'src/app/shared/models';
import { DatePipe, NgIf, NgTemplateOutlet } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RequireApiKeyDirective } from 'src/app/shared/directives';

@Component({
  selector: 'app-playlist-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    DatePipe,
    NgIf,
    ReactiveFormsModule,
    RequireApiKeyDirective,
    NgTemplateOutlet,
  ],
})
export class ProgramComponent {
  private readonly formBuilder = inject(FormBuilder);

  public readonly program = input.required<Program>();
  public readonly tracks = input.required<Track[]>();

  public readonly show = signal(true);
  public readonly editingTrack = signal<Track | null>(null);
  public readonly addingTrack = signal(false);

  public readonly onTrackAdded = output<Track>();
  public readonly onTrackEdited = output<Track>();
  public readonly onTrackDeleted = output<Track>();

  public readonly trackForm = this.formBuilder.group({
    artist: '',
    title: ['', Validators.required],
    playedAt: [
      '',
      [
        Validators.required,
        Validators.pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
      ],
    ],
  });

  public toggle(): void {
    this.show.set(!this.show());
  }

  public add(): void {
    this.trackForm.reset({});

    this.addingTrack.set(true);
    this.editingTrack.set(null);
  }

  public edit(track: Track): void {
    this.trackForm.patchValue({
      artist: track.artist,
      title: track.title,
      playedAt: `${track.playedAt.getHours().toString().padStart(2, '0')}:${track.playedAt.getMinutes().toString().padStart(2, '0')}`,
    });

    this.addingTrack.set(false);
    this.editingTrack.set(track);
  }

  public cancelEdit(): void {
    this.addingTrack.set(false);
    this.editingTrack.set(null);
  }

  public save(): void {
    this.trackForm.markAllAsTouched();
    if (!this.trackForm.valid) {
      return;
    }

    const { artist, title, playedAt } = this.trackForm.getRawValue();

    const [hours, minutes] = playedAt!.split(':');

    const numHours = Number(hours);
    const numMinutes = Number(minutes);

    let newPlayedAt = new Date(
      this.editingTrack()?.playedAt ?? this.program().startAt,
    );
    newPlayedAt.setHours(numHours, numMinutes, 0);

    if (this.editingTrack() !== null) {
      this.onTrackEdited.emit({
        id: this.editingTrack()!.id,
        artist: artist,
        title: title!,
        playedAt: newPlayedAt,
      });
    } else {
      this.onTrackAdded.emit({
        id: null,
        artist: artist,
        title: title!,
        playedAt: newPlayedAt,
      });
    }

    this.addingTrack.set(false);
    this.editingTrack.set(null);
  }

  public delete(track: Track): void {
    this.onTrackDeleted.emit(track);
  }
}
