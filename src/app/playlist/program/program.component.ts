import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { Program, Track } from 'src/app/shared/models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-playlist-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DatePipe],
})
export class ProgramComponent {
  public readonly show = signal(true);
  public readonly program = input.required<Program>();
  public readonly tracks = input.required<Track[]>();

  public toggle(): void {
    this.show.set(!this.show());
  }
}
