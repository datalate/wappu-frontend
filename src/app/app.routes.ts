import { Routes } from '@angular/router';
import { PlaylistComponent } from 'src/app/playlist/playlist.component';
import { playlistGuard } from 'src/app/playlist/playlist.guard';
import { LATEST_RADIO } from 'src/app/shared/constants';

export const appRoutes: Routes = [
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
