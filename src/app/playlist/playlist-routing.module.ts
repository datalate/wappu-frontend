import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlaylistComponent } from 'src/app/playlist/playlist.component';
import { LATEST_RADIO } from 'src/app/playlist/shared';
import { playlistGuard } from 'src/app/playlist/playlist.guard';

const routes: Routes = [
  {
    path: ':radio',
    component: PlaylistComponent,
    canActivate: [playlistGuard()],
  },
  {
    path: '**',
    redirectTo: LATEST_RADIO,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlaylistRoutingModule {}
