import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Program, Track } from 'src/app/shared/models';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { RequireApiKeyDirective } from 'src/app/shared/directives';

@Component({
  selector: 'app-playlist-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    RequireApiKeyDirective,
    NgTemplateOutlet,
    TranslocoPipe,
  ],
})
export class ProgramComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly translocoService = inject(TranslocoService);

  public readonly program = input.required<Program>();
  public readonly tracks = input.required<Track[]>();

  public readonly show = signal(true);
  public readonly editingTrack = signal<Track | null>(null);
  public readonly addingTrack = signal(false);
  public readonly editingProgram = signal(false);

  public readonly onTrackAdded = output<Track>();
  public readonly onTrackEdited = output<Track>();
  public readonly onTrackDeleted = output<Track>();
  public readonly onProgramEdited = output<Program>();

  public readonly programForm = this.formBuilder.group({
    title: ['', Validators.required],
  });

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

  get dateLocale(): string {
    return this.translocoService.getActiveLang() === 'fi' ? 'fi-FI' : 'en-US';
  }

  public toggle(): void {
    this.show.set(!this.show());
  }

  public addTrack(): void {
    this.trackForm.reset({});

    this.addingTrack.set(true);
    this.editingTrack.set(null);
  }

  public editTrack(track: Track): void {
    this.trackForm.patchValue({
      artist: track.artist,
      title: track.title,
      playedAt: `${track.playedAt.getHours().toString().padStart(2, '0')}:${track.playedAt.getMinutes().toString().padStart(2, '0')}`,
    });

    this.addingTrack.set(false);
    this.editingTrack.set(track);
  }

  public cancelEditTrack(): void {
    this.addingTrack.set(false);
    this.editingTrack.set(null);
  }

  public saveTrack(): void {
    this.trackForm.markAllAsTouched();
    if (!this.trackForm.valid) {
      globalThis.alert(
        'Unable to save track. Check required fields and time format (HH:mm).',
      );

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

  public deleteTrack(track: Track): void {
    this.onTrackDeleted.emit(track);
  }

  public editProgram(): void {
    this.programForm.patchValue({ title: this.program().title });
    this.editingProgram.set(true);
  }

  public cancelEditProgram(): void {
    this.editingProgram.set(false);
  }

  public saveProgram(): void {
    this.programForm.markAllAsTouched();

    if (!this.programForm.valid) {
      globalThis.alert('Unable to save program. Title is required.');
      return;
    }

    const { title } = this.programForm.getRawValue();
    this.onProgramEdited.emit({
      ...this.program(),
      title: title!,
    });

    this.editingProgram.set(false);
  }
}
