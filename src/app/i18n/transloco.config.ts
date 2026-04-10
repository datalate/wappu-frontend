import { provideTransloco, translocoConfig } from '@jsverse/transloco';
import { environment } from 'src/environments/environment';
import {
  AVAILABLE_LANGUAGES,
  DEFAULT_LANGUAGE,
  resolveInitialLanguage,
} from 'src/app/i18n/language.util';
import { AppTranslocoLoader } from 'src/app/i18n/transloco.loader';

export const provideAppTransloco = () => {
  const initialLanguage = resolveInitialLanguage();

  return provideTransloco({
    config: translocoConfig({
      availableLangs: [...AVAILABLE_LANGUAGES],
      defaultLang: initialLanguage,
      fallbackLang: DEFAULT_LANGUAGE,
      reRenderOnLangChange: true,
      prodMode: environment.production,
    }),
    loader: AppTranslocoLoader,
  });
};
