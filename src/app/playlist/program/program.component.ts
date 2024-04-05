import { Component, Input } from '@angular/core';
import { Program, Track } from 'src/app/core/models';

@Component({
  selector: 'app-playlist-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss'],
})
export class ProgramComponent {
  @Input() show = true;
  @Input({ required: true }) program!: Program;
  @Input({ required: true }) tracks: Track[] = [];
}
