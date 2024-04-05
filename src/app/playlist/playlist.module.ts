import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaylistComponent } from 'src/app/playlist/playlist.component';
import { ProgramComponent } from 'src/app/playlist/program/program.component';
import { PlaylistRoutingModule } from 'src/app/playlist/playlist-routing.module';

@NgModule({
  declarations: [PlaylistComponent, ProgramComponent],
  imports: [CommonModule, PlaylistRoutingModule],
})
export class PlaylistModule {}
