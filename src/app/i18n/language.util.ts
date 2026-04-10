export const AVAILABLE_LANGUAGES = ['fi', 'en'] as const;

export type SupportedLanguage = (typeof AVAILABLE_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = 'fi';

export const resolveInitialLanguage = (
  search: string = getCurrentSearch(),
  browserLanguages: readonly string[] = getBrowserLanguages(),
): SupportedLanguage => {
  return (
    resolveLanguageFromSearch(search) ??
    resolveLanguageFromBrowser(browserLanguages) ??
    DEFAULT_LANGUAGE
  );
};

export const resolveLanguageFromSearch = (
  search: string,
): SupportedLanguage | null => {
  const language = new URLSearchParams(search).get('lang');

  return normalizeLanguage(language);
};

const resolveLanguageFromBrowser = (
  browserLanguages: readonly string[],
): SupportedLanguage | null => {
  for (const language of browserLanguages) {
    const normalizedLanguage = normalizeLanguage(language);

    if (normalizedLanguage !== null) {
      return normalizedLanguage;
    }
  }

  return null;
};

export const normalizeLanguage = (
  language: string | null | undefined,
): SupportedLanguage | null => {
  const normalizedLanguage = language?.trim().toLowerCase();

  if (!normalizedLanguage) {
    return null;
  }

  const [baseLanguage] = normalizedLanguage.split('-');

  return AVAILABLE_LANGUAGES.includes(baseLanguage as SupportedLanguage)
    ? (baseLanguage as SupportedLanguage)
    : null;
};

const getCurrentSearch = (): string => {
  return typeof globalThis.location === 'undefined'
    ? ''
    : globalThis.location.search;
};

const getBrowserLanguages = (): readonly string[] => {
  if (typeof globalThis.navigator === 'undefined') {
    return [];
  }

  return globalThis.navigator.languages?.length
    ? globalThis.navigator.languages
    : [globalThis.navigator.language];
};
