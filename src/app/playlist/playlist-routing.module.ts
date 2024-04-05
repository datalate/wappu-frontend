import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlaylistComponent } from 'src/app/playlist/playlist.component';
import { LATEST_RADIO } from 'src/app/playlist/shared';

const routes: Routes = [
  {
    path: ':radio',
    component: PlaylistComponent,
  },
  {
    path: '**',
    redirectTo: LATEST_RADIO,
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlaylistRoutingModule { }
