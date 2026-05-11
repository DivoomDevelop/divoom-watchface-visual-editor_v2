export const LANGUAGE_STORAGE_KEY = "divoom_editor_lang_enum";

export const DEFAULT_LANGUAGE_ENUM = "DIVOOM_LVGL_MENU_LANG_SC";

export const LANGUAGE_OPTIONS = Object.freeze([
  { value: "DIVOOM_LVGL_MENU_LANG_ENGLISH", locale: "en-US", label: "English" },
  { value: "DIVOOM_LVGL_MENU_LANG_SC", locale: "zh-CN", label: "简体中文" },
  { value: "DIVOOM_LVGL_MENU_LANG_JP", locale: "ja-JP", label: "日本語" },
  { value: "DIVOOM_LVGL_MENU_LANG_Thai", locale: "th-TH", label: "ไทย" },
  { value: "DIVOOM_LVGL_MENU_LANG_French", locale: "fr-FR", label: "Français" },
  { value: "DIVOOM_LVGL_MENU_LANG_Italy", locale: "it-IT", label: "Italiano" },
  { value: "DIVOOM_LVGL_MENU_LANG_Vietnam", locale: "vi-VN", label: "Tiếng Việt" },
  { value: "DIVOOM_LVGL_MENU_LANG_Spanish", locale: "es-ES", label: "Español" },
  { value: "DIVOOM_LVGL_MENU_LANG_Germany", locale: "de-DE", label: "Deutsch" },
  { value: "DIVOOM_LVGL_MENU_LANG_Russian", locale: "ru-RU", label: "Русский" },
  { value: "DIVOOM_LVGL_MENU_LANG_Portuguese", locale: "pt-PT", label: "Português" },
  { value: "DIVOOM_LVGL_MENU_LANG_Korean", locale: "ko-KR", label: "한국어" },
  { value: "DIVOOM_LVGL_MENU_LANG_Swedish", locale: "sv-SE", label: "Svenska" },
  { value: "DIVOOM_LVGL_MENU_LANG_Ukraine", locale: "uk-UA", label: "Українська" },
  { value: "DIVOOM_LVGL_MENU_LANG_TC", locale: "zh-TW", label: "繁體中文" },
  { value: "DIVOOM_LVGL_MENU_LANG_Danish", locale: "da-DK", label: "Dansk" },
  { value: "DIVOOM_LVGL_MENU_LANG_Turkey", locale: "tr-TR", label: "Türkçe" },
  { value: "DIVOOM_LVGL_MENU_LANG_Indonesian", locale: "id-ID", label: "Bahasa Indonesia" }
]);

export const LANGUAGE_VALUE_SET = new Set(LANGUAGE_OPTIONS.map((x) => x.value));

export const LANGUAGE_TO_LOCALE = Object.freeze(
  LANGUAGE_OPTIONS.reduce((acc, row) => {
    acc[row.value] = row.locale;
    return acc;
  }, {})
);

export function normalizeLanguageEnum(value) {
  if (typeof value !== "string") return null;
  return LANGUAGE_VALUE_SET.has(value) ? value : null;
}

export function getLocaleByLanguageEnum(value) {
  return LANGUAGE_TO_LOCALE[value] || LANGUAGE_TO_LOCALE[DEFAULT_LANGUAGE_ENUM] || "en-US";
}

export function detectLanguageByNavigator(navLanguage) {
  const nav = String(navLanguage || "").toLowerCase();
  if (nav.startsWith("zh-tw") || nav.startsWith("zh-hk") || nav.startsWith("zh-mo")) {
    return "DIVOOM_LVGL_MENU_LANG_TC";
  }
  if (nav.startsWith("zh")) return "DIVOOM_LVGL_MENU_LANG_SC";
  if (nav.startsWith("ja")) return "DIVOOM_LVGL_MENU_LANG_JP";
  if (nav.startsWith("th")) return "DIVOOM_LVGL_MENU_LANG_Thai";
  if (nav.startsWith("fr")) return "DIVOOM_LVGL_MENU_LANG_French";
  if (nav.startsWith("it")) return "DIVOOM_LVGL_MENU_LANG_Italy";
  if (nav.startsWith("vi")) return "DIVOOM_LVGL_MENU_LANG_Vietnam";
  if (nav.startsWith("es")) return "DIVOOM_LVGL_MENU_LANG_Spanish";
  if (nav.startsWith("de")) return "DIVOOM_LVGL_MENU_LANG_Germany";
  if (nav.startsWith("ru")) return "DIVOOM_LVGL_MENU_LANG_Russian";
  if (nav.startsWith("pt")) return "DIVOOM_LVGL_MENU_LANG_Portuguese";
  if (nav.startsWith("ko")) return "DIVOOM_LVGL_MENU_LANG_Korean";
  if (nav.startsWith("sv")) return "DIVOOM_LVGL_MENU_LANG_Swedish";
  if (nav.startsWith("uk")) return "DIVOOM_LVGL_MENU_LANG_Ukraine";
  if (nav.startsWith("da")) return "DIVOOM_LVGL_MENU_LANG_Danish";
  if (nav.startsWith("tr")) return "DIVOOM_LVGL_MENU_LANG_Turkey";
  if (nav.startsWith("id")) return "DIVOOM_LVGL_MENU_LANG_Indonesian";
  return "DIVOOM_LVGL_MENU_LANG_ENGLISH";
}
