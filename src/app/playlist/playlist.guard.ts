import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LATEST_RADIO, RADIO_EDITIONS } from 'src/app/playlist/shared';

export const playlistGuard = (): CanActivateFn => (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);

  if (!RADIO_EDITIONS.some(radio => radio.id === LATEST_RADIO)) {
    throw new Error('Latest radio edition is missing from the configured editions');
  }

  return RADIO_EDITIONS
    .some(radio => radio.id === route.params['radio']) ? true : router.navigate([LATEST_RADIO]);
};
