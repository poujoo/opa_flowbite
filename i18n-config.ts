export const i18n = {
    defaultLocale: "en",
    locales: ["en", "it", "gr"],
  } as const;
  
  export type Locale = (typeof i18n)["locales"][number];
  export type Locales = (typeof i18n)["locales"];