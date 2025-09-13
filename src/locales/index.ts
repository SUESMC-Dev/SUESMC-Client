import { i18nConfig } from "../../next-i18next.config.mjs";
import en from "./en.json";
import zh_Hans from "./zh-Hans.json";

type LocaleResources = {
  [key: string]: {
    translation: Record<string, any>;
    display_name: string;
  };
};

export const localeResources: LocaleResources = {
  "zh-Hans": {
    translation: zh_Hans,
    display_name: "简体中文",
  },
  en: {
    translation: en,
    display_name: "English",
  },
};

export const DEFAULT_LOCALE = i18nConfig.defaultLocale;
