import { provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from 'src/app/app.config';
import { AppComponent } from 'src/app/app.component';
import { Configuration } from 'src/app/configuration/configuration';

Configuration.init()
  .then(() => {
    bootstrapApplication(AppComponent, {
      ...appConfig,
      providers: [provideZonelessChangeDetection(), ...appConfig.providers],
    }).then();
  })
  .catch((error): void => console.error(error));
