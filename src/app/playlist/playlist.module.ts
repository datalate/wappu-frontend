import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlaylistComponent } from './playlist.component';
import { PlaylistRoutingModule } from './playlist-routing.module';
import { ProgramComponent } from './program/program.component';

@NgModule({
  declarations: [
    PlaylistComponent,
    ProgramComponent,
  ],
  imports: [
    CommonModule,
    PlaylistRoutingModule,
  ]
})
export class PlaylistModule { }
